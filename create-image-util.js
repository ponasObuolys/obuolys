const fs = require('fs');
const content = `/**
 * Image Optimization Utilities
 * Leverages Supabase Storage image transformations for optimal loading
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
    return \`\${transformUrl}?\${params.toString()}\`;
  } catch (error) {
    console.error('Image optimization error:', error);
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
`;
fs.writeFileSync('src/utils/imageOptimization.ts', content);
console.log('Created imageOptimization.ts');
