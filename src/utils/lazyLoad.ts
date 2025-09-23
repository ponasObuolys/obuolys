import { lazy, createElement } from 'react';

/**
 * Creates a lazy-loaded component with a minimum loading time for better UX
 * @param importFn - Function that returns a dynamic import
 * @param minLoadTime - Minimum loading time in milliseconds (default: 100ms)
 */
export const createLazyComponent = (
  importFn: () => Promise<any>,
  minLoadTime: number = 100
) => {
  return lazy(() =>
    Promise.all([
      importFn(),
      new Promise(resolve => setTimeout(resolve, minLoadTime))
    ]).then(([moduleExports]) => moduleExports)
  );
};

/**
 * Preloads a lazy component to improve perceived performance
 * @param importFn - Function that returns a dynamic import
 */
export const preloadComponent = (importFn: () => Promise<any>) => {
  const componentImport = importFn();
  return componentImport;
};

/**
 * Creates a chunk-specific lazy component with better error handling
 * @param chunkName - Name of the chunk for better debugging
 * @param importFn - Function that returns a dynamic import
 */
export const createNamedLazyComponent = (
  chunkName: string,
  importFn: () => Promise<any>
) => {
  return lazy(() =>
    importFn().catch(error => {
      console.error(`Failed to load chunk: ${chunkName}`, error);
      // Return a fallback component
      return {
        default: () => createElement('div',
          { className: 'flex items-center justify-center p-8' },
          createElement('div',
            { className: 'text-center' },
            createElement('h3',
              { className: 'text-lg font-medium text-gray-900 mb-2' },
              'Klaida kraunant komponentą'
            ),
            createElement('p',
              { className: 'text-gray-600 mb-4' },
              'Nepavyko įkelti puslapio. Pabandykite dar kartą.'
            ),
            createElement('button',
              {
                onClick: () => window.location.reload(),
                className: 'px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
              },
              'Atnaujinti puslapį'
            )
          )
        )
      };
    })
  );
};