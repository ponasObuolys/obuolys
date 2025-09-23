import { lazy, createElement, ComponentType } from 'react';

// Cache for storing preloaded components
const componentCache = new Map<string, Promise<any>>();
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

/**
 * Creates a lazy-loaded component with intelligent caching and preloading
 * @param importFn - Function that returns a dynamic import
 * @param options - Configuration options
 */
export const createLazyComponent = (
  importFn: () => Promise<any>,
  options: {
    minLoadTime?: number;
    cacheKey?: string;
    preload?: boolean;
    retryCount?: number;
  } = {}
) => {
  const { minLoadTime = 50, cacheKey, preload = false, retryCount = 3 } = options;

  const loadComponent = async (attempt = 1): Promise<any> => {
    const startTime = performance.now();
    const metrics: LoadingMetrics = {
      startTime,
      cached: false,
      retries: attempt - 1
    };

    try {
      // Check cache first
      if (cacheKey && componentCache.has(cacheKey)) {
        metrics.cached = true;
        const cachedResult = await componentCache.get(cacheKey)!;
        metrics.endTime = performance.now();
        metrics.duration = metrics.endTime - startTime;
        loadingMetrics.set(cacheKey, metrics);
        return cachedResult;
      }

      // Load component with minimum time for UX
      const [moduleExports] = await Promise.all([
        importFn(),
        new Promise(resolve => setTimeout(resolve, minLoadTime))
      ]);

      // Cache the result
      if (cacheKey) {
        componentCache.set(cacheKey, Promise.resolve(moduleExports));
      }

      metrics.endTime = performance.now();
      metrics.duration = metrics.endTime - startTime;
      if (cacheKey) {
        loadingMetrics.set(cacheKey, metrics);
      }

      return moduleExports;
    } catch (error) {
      if (attempt < retryCount) {
        console.warn(`Retrying component load (attempt ${attempt + 1}/${retryCount}):`, error);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        return loadComponent(attempt + 1);
      }
      throw error;
    }
  };

  const LazyComponent = lazy(loadComponent);

  // Preload component if requested
  if (preload && cacheKey && !preloadedComponents.has(cacheKey)) {
    preloadedComponents.add(cacheKey);
    loadComponent().catch(error => {
      console.warn(`Failed to preload component ${cacheKey}:`, error);
      preloadedComponents.delete(cacheKey);
    });
  }

  return LazyComponent;
};

/**
 * Creates a chunk-specific lazy component with advanced error handling
 * @param chunkName - Name of the chunk for better debugging
 * @param importFn - Function that returns a dynamic import
 */
export const createNamedLazyComponent = (
  chunkName: string,
  importFn: () => Promise<any>
) => {
  return createLazyComponent(importFn, {
    cacheKey: chunkName,
    preload: false,
    retryCount: 3
  });
};

/**
 * Preloads a component and stores it in cache
 * @param importFn - Function that returns a dynamic import
 * @param cacheKey - Key to store the component in cache
 */
export const preloadComponent = (
  importFn: () => Promise<any>,
  cacheKey?: string
): Promise<any> => {
  const key = cacheKey || `preload_${Date.now()}`;

  if (componentCache.has(key)) {
    return componentCache.get(key)!;
  }

  const componentPromise = importFn();
  componentCache.set(key, componentPromise);
  preloadedComponents.add(key);

  return componentPromise;
};

/**
 * Preloads components based on user interaction hints
 * @param routes - Array of route information with preload priorities
 */
export const setupIntelligentPreloading = (routes: {
  path: string;
  importFn: () => Promise<any>;
  priority: 'high' | 'medium' | 'low';
  trigger?: 'hover' | 'visible' | 'idle';
}[]) => {
  const preloadQueue: { fn: () => Promise<any>; priority: number }[] = [];

  // Sort routes by priority
  const sortedRoutes = routes.sort((a, b) => {
    const priorities = { high: 3, medium: 2, low: 1 };
    return priorities[b.priority] - priorities[a.priority];
  });

  // Preload high priority components immediately
  sortedRoutes
    .filter(route => route.priority === 'high')
    .forEach(route => {
      preloadComponent(route.importFn, route.path);
    });

  // Queue medium priority components for idle time
  const mediumPriorityRoutes = sortedRoutes.filter(route => route.priority === 'medium');

  // Use requestIdleCallback for medium priority preloading
  const preloadOnIdle = () => {
    if ('requestIdleCallback' in window) {
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
      // Fallback for browsers without requestIdleCallback
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
    },
    getLoadingMetrics: () => loadingMetrics,
    getCacheStatus: () => ({
      cached: Array.from(componentCache.keys()),
      preloaded: Array.from(preloadedComponents)
    })
  };
};

/**
 * Enhanced error boundary component for lazy loading failures
 */
export const createErrorFallback = (chunkName: string) => {
  return () => createElement('div',
    {
      className: 'flex items-center justify-center min-h-[200px] p-8 bg-gray-50 rounded-lg border border-gray-200',
      role: 'alert',
      'aria-label': 'Komponentas neįkeltas'
    },
    createElement('div',
      { className: 'text-center max-w-md' },
      createElement('div',
        { className: 'mb-4' },
        createElement('svg',
          {
            className: 'w-12 h-12 text-gray-400 mx-auto',
            fill: 'none',
            stroke: 'currentColor',
            viewBox: '0 0 24 24'
          },
          createElement('path',
            {
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              strokeWidth: 2,
              d: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z'
            }
          )
        )
      ),
      createElement('h3',
        { className: 'text-lg font-medium text-gray-900 mb-2' },
        'Nepavyko įkelti komponento'
      ),
      createElement('p',
        { className: 'text-gray-600 mb-4 text-sm' },
        `Komponentas "${chunkName}" negali būti įkeltas. Patikrinkite interneto ryšį.`
      ),
      createElement('div',
        { className: 'flex flex-col sm:flex-row gap-2 justify-center' },
        createElement('button',
          {
            onClick: () => window.location.reload(),
            className: 'px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors'
          },
          'Atnaujinti puslapį'
        ),
        createElement('button',
          {
            onClick: () => window.history.back(),
            className: 'px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors'
          },
          'Grįžti atgal'
        )
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
    totalRetries: Array.from(loadingMetrics.values()).reduce((sum, m) => sum + m.retries, 0)
  };

  const durations = Array.from(loadingMetrics.values())
    .map(m => m.duration)
    .filter(d => d !== undefined) as number[];

  if (durations.length > 0) {
    stats.averageLoadTime = durations.reduce((sum, d) => sum + d, 0) / durations.length;
  }

  return stats;
};