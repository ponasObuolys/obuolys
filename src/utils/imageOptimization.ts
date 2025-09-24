/**
 * Utility functions for image optimization
 * These functions help with optimizing image loading and rendering
 */

/**
 * Generate responsive image srcset for different viewport sizes
 * @param src Base image URL
 * @param sizes Array of sizes in pixels for the srcset
 * @returns Formatted srcset string
 */
export const generateSrcSet = (
  src: string,
  sizes: number[] = [320, 640, 960, 1280, 1920]
): string => {
  // Skip srcset generation for external URLs that might not support resizing
  if (src.startsWith("http") && !src.includes("ponasobuolys.lt")) {
    return src;
  }

  // For local images or images on our domain
  const baseUrl = src.split("?")[0];

  return sizes.map(size => `${baseUrl}?width=${size} ${size}w`).join(", ");
};

/**
 * Calculate the appropriate sizes attribute for responsive images
 * @param defaultSize Default size as percentage of viewport width
 * @param breakpoints Breakpoint configurations for different viewport sizes
 * @returns Formatted sizes attribute string
 */
export const calculateSizes = (
  defaultSize = "100vw",
  breakpoints: { [key: string]: string }[] = []
): string => {
  if (breakpoints.length === 0) {
    return defaultSize;
  }

  const breakpointStrings = breakpoints.map(bp => {
    const [query, size] = Object.entries(bp)[0];
    return `(${query}) ${size}`;
  });

  return [...breakpointStrings, defaultSize].join(", ");
};

/**
 * Get appropriate image format based on browser support
 * Falls back to original format if modern formats not supported
 * @param src Original image source
 * @returns Best format for the current browser
 */
export const getOptimalImageFormat = (src: string): string => {
  // Check if browser supports webp
  const supportsWebp =
    typeof document !== "undefined" &&
    document.createElement("canvas").toDataURL("image/webp").indexOf("data:image/webp") === 0;

  if (supportsWebp) {
    // Convert to webp if supported
    if (src.includes("?")) {
      return `${src}&format=webp`;
    }
    return `${src}?format=webp`;
  }

  return src;
};

/**
 * Nustato, ar elementas yra matomas rodinyje pagal nurodytą slenkstį
 * @param element DOM elementas, kurį tikriname
 * @param threshold Kokia elemento dalis turi būti matoma (0–1)
 * @returns Ar elementas pakankamai matomas, kad būtų laikomas rodinyje
 */
export const isInViewport = (element: HTMLElement, threshold = 0.1): boolean => {
  if (!element || typeof window === "undefined") return false;

  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  // Apskaičiuojame matomos dalies plotą
  const intersectionWidth = Math.min(rect.right, windowWidth) - Math.max(rect.left, 0);
  const intersectionHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);

  const visibleWidth = Math.max(0, intersectionWidth);
  const visibleHeight = Math.max(0, intersectionHeight);

  const visibleArea = visibleWidth * visibleHeight;
  const elementArea = Math.max(1, rect.width * rect.height);

  const visibilityRatio = visibleArea / elementArea;

  return visibilityRatio >= threshold;
};

/**
 * Apply LQIP (Low Quality Image Placeholder) technique
 * @param imageElement Image element to apply LQIP to
 * @param src High quality image source
 * @param lowQualitySrc Low quality placeholder image source
 */
export const applyLQIP = (
  imageElement: HTMLImageElement,
  src: string,
  lowQualitySrc = `${src}?width=20&quality=30`
): void => {
  if (!imageElement) return;

  // Set initial low quality image
  imageElement.src = lowQualitySrc;

  // Load high quality image
  const highQualityImage = new Image();
  highQualityImage.src = src;

  highQualityImage.onload = () => {
    // Replace with high quality image when loaded
    imageElement.src = src;
    imageElement.classList.add("loaded");
  };
};
