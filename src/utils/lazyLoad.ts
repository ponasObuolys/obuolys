import { createElement, lazy, type ComponentType, type LazyExoticComponent } from "react";
import { log } from "@/utils/browserLogger";

// Cache for storing preloaded components
const componentCache = new Map<string, Promise<LazyModule<ComponentType<unknown>>>>();
const preloadedComponents = new Set<string>();

// Performance metrics for component loading
interface LoadingMetrics {
  startTime: number;
  endTime?: number;
  duration?: number;
  cached: boolean;
  retries: number;
}

const loadingMetrics = new Map<string, LoadingMetrics>();

type LazyModule<T extends ComponentType<unknown>> = { default: T } & Record<string, unknown>;

type LazyImport<T extends ComponentType<unknown>> = () => Promise<LazyModule<T>>;

type LazyComponentOptions = {
  minLoadTime?: number;
  cacheKey?: string;
  preload?: boolean;
  retryCount?: number;
};

const storeInCache = <T extends ComponentType<unknown>>(
  key: string,
  modulePromise: Promise<LazyModule<T>>
) => {
  componentCache.set(key, modulePromise as Promise<LazyModule<ComponentType<unknown>>>);
};

const getFromCache = <T extends ComponentType<unknown>>(
  key: string
): Promise<LazyModule<T>> | undefined => {
  const cached = componentCache.get(key);
  return cached as Promise<LazyModule<T>> | undefined;
};

/**
 * Creates a lazy-loaded component with intelligent caching and preloading
 */
export const createLazyComponent = <T extends ComponentType<unknown>>(
  importFn: LazyImport<T>,
  options: LazyComponentOptions = {}
): LazyExoticComponent<T> => {
  const { minLoadTime = 50, cacheKey, preload = false, retryCount = 3 } = options;

  const loadComponent = async (attempt = 1): Promise<LazyModule<T>> => {
    const startTime = performance.now();
    const metrics: LoadingMetrics = {
      startTime,
      cached: false,
      retries: attempt - 1,
    };

    try {
      if (cacheKey) {
        const cached = getFromCache<T>(cacheKey);
        if (cached) {
          metrics.cached = true;
          const cachedResult = await cached;
          metrics.endTime = performance.now();
          metrics.duration = metrics.endTime - startTime;
          loadingMetrics.set(cacheKey, metrics);
          return cachedResult;
        }
      }

      const [moduleExports] = await Promise.all([
        importFn(),
        new Promise(resolve => setTimeout(resolve, minLoadTime)),
      ]);

      if (cacheKey) {
        storeInCache(cacheKey, Promise.resolve(moduleExports));
      }

      metrics.endTime = performance.now();
      metrics.duration = metrics.endTime - startTime;
      if (cacheKey) {
        loadingMetrics.set(cacheKey, metrics);
      }

      return moduleExports;
    } catch (error) {
      if (attempt < retryCount) {
        log.warn(`Retrying component load (attempt ${attempt + 1}/${retryCount}):`, error);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        return loadComponent(attempt + 1);
      }
      throw error;
    }
  };

  const LazyComponent = lazy(loadComponent);

  if (preload && cacheKey && !preloadedComponents.has(cacheKey)) {
    preloadedComponents.add(cacheKey);
    loadComponent().catch(error => {
      log.warn(`Failed to preload component ${cacheKey}:`, error);
      preloadedComponents.delete(cacheKey);
    });
  }

  return LazyComponent;
};

/**
 * Creates a chunk-specific lazy component with advanced error handling
 */
export const createNamedLazyComponent = <T extends ComponentType<unknown>>(
  chunkName: string,
  importFn: LazyImport<T>
) =>
  createLazyComponent(importFn, {
    cacheKey: chunkName,
    preload: false,
    retryCount: 3,
  });

/**
 * Preloads a component and stores it in cache
 */
export const preloadComponent = <T extends ComponentType<unknown>>(
  importFn: LazyImport<T>,
  cacheKey?: string
): Promise<LazyModule<T>> => {
  const key = cacheKey || `preload_${Date.now()}`;

  const cached = getFromCache<T>(key);
  if (cached) {
    return cached;
  }

  const componentPromise = importFn();
  storeInCache(key, componentPromise);
  preloadedComponents.add(key);

  return componentPromise;
};

/**
 * Preloads components based on user interaction hints
 */
export const setupIntelligentPreloading = (
  routes: Array<{
    path: string;
    importFn: LazyImport<ComponentType<unknown>>;
    priority: "high" | "medium" | "low";
    trigger?: "hover" | "visible" | "idle";
  }>
) => {
  const sortedRoutes = routes.slice().sort((a, b) => {
    const priorities = { high: 3, medium: 2, low: 1 };
    return priorities[b.priority] - priorities[a.priority];
  });

  sortedRoutes
    .filter(route => route.priority === "high")
    .forEach(route => {
      preloadComponent(route.importFn, route.path);
    });

  const mediumPriorityRoutes = sortedRoutes.filter(route => route.priority === "medium");

  const preloadOnIdle = () => {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(() => {
        const route = mediumPriorityRoutes.shift();
        if (route) {
          preloadComponent(route.importFn, route.path);
          if (mediumPriorityRoutes.length > 0) {
            preloadOnIdle();
          }
        }
      });
    } else {
      setTimeout(() => {
        const route = mediumPriorityRoutes.shift();
        if (route) {
          preloadComponent(route.importFn, route.path);
          if (mediumPriorityRoutes.length > 0) {
            preloadOnIdle();
          }
        }
      }, 2000);
    }
  };

  preloadOnIdle();

  return {
    preloadRoute: (path: string) => {
      const route = routes.find(r => r.path === path);
      if (route) {
        return preloadComponent(route.importFn, route.path);
      }
      return undefined;
    },
    getLoadingMetrics: () => loadingMetrics,
    getCacheStatus: () => ({
      cached: Array.from(componentCache.keys()),
      preloaded: Array.from(preloadedComponents),
    }),
  };
};

/**
 * Enhanced error boundary component for lazy loading failures
 */
export const createErrorFallback = (chunkName: string) => {
  return () =>
    createElement(
      "div",
      {
        className:
          "flex items-center justify-center min-h-[200px] p-8 bg-gray-50 rounded-lg border border-gray-200",
        role: "alert",
        "aria-label": "Komponentas neikeltas",
      },
      createElement(
        "div",
        { className: "text-center max-w-md" },
        createElement(
          "div",
          { className: "mb-4" },
          createElement(
            "svg",
            {
              className: "w-12 h-12 text-gray-400 mx-auto",
              fill: "none",
              stroke: "currentColor",
              viewBox: "0 0 24 24",
            },
            createElement("path", {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: 2,
              d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z",
            })
          )
        )
      ),
      createElement(
        "h3",
        { className: "text-lg font-medium text-gray-900 mb-2" },
        "Nepavyko ikelti komponento"
      ),
      createElement(
        "p",
        { className: "text-gray-600 mb-4 text-sm" },
        `Komponentas "${chunkName}" negali buti ikeltas. Patikrinkite interneto ry�i.`
      ),
      createElement(
        "div",
        { className: "flex flex-col sm:flex-row gap-2 justify-center" },
        createElement(
          "button",
          {
            onClick: () => window.location.reload(),
            className:
              "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors",
          },
          "Atnaujinti puslapi"
        ),
        createElement(
          "button",
          {
            onClick: () => window.history.back(),
            className:
              "px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors",
          },
          "Gri�ti atgal"
        )
      )
    );
};

/**
 * Get performance metrics for loaded components
 */
export const getComponentLoadingStats = () => {
  const stats = {
    totalComponents: loadingMetrics.size,
    cachedComponents: Array.from(loadingMetrics.values()).filter(m => m.cached).length,
    averageLoadTime: 0,
    totalRetries: Array.from(loadingMetrics.values()).reduce((sum, m) => sum + m.retries, 0),
  };

  const durations = Array.from(loadingMetrics.values())
    .map(m => m.duration)
    .filter((d): d is number => d !== undefined);

  if (durations.length > 0) {
    stats.averageLoadTime = durations.reduce((sum, d) => sum + d, 0) / durations.length;
  }

  return stats;
};
