/**
 * Image Optimization Utilities
 */

interface ImageTransformOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
}

export const optimizeSupabaseImage = (
  url: string | null | undefined,
  options: ImageTransformOptions = {}
): string => {
  if (!url) return '/opengraph-image.png';
  if (!url.includes('supabase.co/storage')) return url;

  const { width, height, quality = 80, format = 'webp' } = options;

  try {
    const transformUrl = url.replace('/storage/v1/object/public', '/storage/v1/render/image/public');
    const params = new URLSearchParams();
    if (width) params.append('width', width.toString());
    if (height) params.append('height', height.toString());
    params.append('quality', quality.toString());
    params.append('format', format);
    return `${transformUrl}?${params.toString()}`;
  } catch {
    // Fallback to original URL on transformation error
    return url;
  }
};

export const IMAGE_PRESETS = {
  thumbnail: { width: 200, quality: 75 },
  card: { width: 600, quality: 80 },
  hero: { width: 1200, quality: 85 },
  full: { width: 1920, quality: 85 },
} as const;

export const getOptimizedImage = (
  url: string | null | undefined,
  preset: keyof typeof IMAGE_PRESETS
): string => {
  return optimizeSupabaseImage(url, IMAGE_PRESETS[preset]);
};

/**
 * Get optimal image format (WebP with fallback)
 * Used by LazyImage for format selection
 */
export const getOptimalImageFormat = (url: string): string => {
  // If already optimized or not a Supabase URL, return as-is
  if (!url || !url.includes('supabase.co/storage')) {
    return url;
  }

  // Use optimizeSupabaseImage with default WebP format
  return optimizeSupabaseImage(url, { format: 'webp', quality: 80 });
};

/**
 * Generate srcset for responsive images
 * Used by LazyImage for responsive loading
 */
export const generateSrcSet = (
  url: string,
  sizes: number[] = [400, 800, 1200, 1600]
): string => {
  if (!url) return '';

  return sizes
    .map((width) => {
      const optimizedUrl = optimizeSupabaseImage(url, { width, quality: 80 });
      return `${optimizedUrl} ${width}w`;
    })
    .join(', ');
};

/**
 * Calculate sizes attribute for responsive images
 * Used by LazyImage for browser size hints
 */
export const calculateSizes = (
  defaultSize: string,
  breakpoints: Record<string, string>[] = []
): string => {
  if (breakpoints.length === 0) {
    return defaultSize;
  }

  const mediaQueries = breakpoints
    .map((bp) => {
      const [media, size] = Object.entries(bp)[0];
      return `(${media}) ${size}`;
    })
    .join(', ');

  return `${mediaQueries}, ${defaultSize}`;
};
