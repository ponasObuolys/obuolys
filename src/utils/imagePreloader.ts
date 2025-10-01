/**
 * Utility to preload images when the browser is idle
 * This helps with performance by loading images before they're needed
 * but only when the browser isn't busy with other tasks
 */

import { log } from '@/utils/browserLogger';

/**
 * Preload a single image
 * @param src Image source URL
 * @returns Promise that resolves when the image is loaded
 */
export const preloadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Preload multiple images when the browser is idle
 * @param imageSources Array of image source URLs
 */
export const preloadImagesWhenIdle = (imageSources: string[]): void => {
  // If requestIdleCallback is not supported, use setTimeout as fallback
  const requestIdleCallback = 
    window.requestIdleCallback || 
    ((cb) => setTimeout(cb, 1));

  // Preload images when browser is idle
  requestIdleCallback(() => {
    imageSources.forEach(src => {
      // Only preload if the image is not already in the cache
      if (!isImageCached(src)) {
        preloadImage(src).catch(err => {
          log.warn(`Failed to preload image: ${src}`, err);
        });
      }
    });
  });
};

/**
 * Check if an image is already cached by the browser
 * @param src Image source URL
 * @returns Boolean indicating if the image is cached
 */
const isImageCached = (src: string): boolean => {
  const img = new Image();
  img.src = src;
  return img.complete;
};

/**
 * Extract image URLs from HTML content
 * @param htmlContent HTML content string
 * @returns Array of image source URLs
 */
export const extractImagesFromHTML = (htmlContent: string): string[] => {
  const imgRegex = /<img[^>]+src="([^">]+)"/g;
  const images: string[] = [];
  let match;
  
  while ((match = imgRegex.exec(htmlContent)) !== null) {
    if (match[1]) {
      images.push(match[1]);
    }
  }
  
  return images;
};
