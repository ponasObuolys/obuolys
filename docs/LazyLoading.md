# Image Lazy Loading Implementation

This document explains the image lazy loading implementation in the Ponas Obuolys website and how to use it effectively.

## Overview

Lazy loading is a technique that defers the loading of non-critical resources (like images) until they are needed. This improves initial page load performance and reduces unnecessary data usage for users.

Our implementation includes:

1. A reusable `LazyImage` component
2. A utility function to add lazy loading to HTML content
3. A custom hook to observe and lazy load images
4. Image preloading capabilities
5. A global image loading provider

## Components and Utilities

### 1. LazyImage Component

The `LazyImage` component is a drop-in replacement for the standard HTML `<img>` tag that adds lazy loading capabilities.

**Usage:**

```tsx
import LazyImage from '@/components/ui/lazy-image';

// Basic usage
<LazyImage 
  src="/path/to/image.jpg" 
  alt="Description of image" 
/>

// With priority loading for important above-the-fold images
<LazyImage 
  src="/path/to/image.jpg" 
  alt="Description of image"
  priority={true}
/>

// With custom placeholder
<LazyImage 
  src="/path/to/image.jpg" 
  alt="Description of image"
  placeholderSrc="/path/to/placeholder.jpg"
/>
```

**Props:**

- `src`: Image source URL (required)
- `alt`: Image alt text (required)
- `placeholderSrc`: Custom placeholder image URL
- `sizes`: HTML sizes attribute for responsive images
- `srcSizes`: Array of sizes in pixels for the srcset
- `threshold`: Intersection observer threshold (0-1)
- `blurEffect`: Whether to apply blur transition effect
- `priority`: Whether the image should load with high priority
- All standard HTML img attributes are also supported

### 2. Lazy Loading HTML Content

The `addLazyLoadingToImages` utility function adds the `loading="lazy"` attribute to all images in HTML content:

```tsx
import { addLazyLoadingToImages } from '@/utils/lazyLoadImages';

// In a component that renders HTML content
<div dangerouslySetInnerHTML={{ __html: addLazyLoadingToImages(htmlContent) }} />
```

### 3. useLazyImages Hook

The `useLazyImages` hook sets up an IntersectionObserver to lazy load images that are dynamically added to the DOM:

```tsx
import useLazyImages from '@/hooks/useLazyImages';

const MyComponent = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Apply lazy loading to images in the content
  useLazyImages(contentRef);
  
  return (
    <div ref={contentRef}>
      {/* Dynamic content with images */}
    </div>
  );
};
```

### 4. Image Preloading

The `imagePreloader` utility provides functions to preload images when the browser is idle:

```tsx
import { preloadImagesWhenIdle, extractImagesFromHTML } from '@/utils/imagePreloader';

// Preload specific images
preloadImagesWhenIdle(['/path/to/image1.jpg', '/path/to/image2.jpg']);

// Extract and preload images from HTML content
const imageUrls = extractImagesFromHTML(htmlContent);
preloadImagesWhenIdle(imageUrls);
```

### 5. Image Loading Provider

The `ImageLoadingProvider` manages image loading across the application:

```tsx
import { useImageLoading } from '@/providers/ImageLoadingProvider';

const MyComponent = () => {
  const { 
    addPriorityImage, 
    removePriorityImage, 
    isImageLoaded, 
    markImageAsLoaded,
    preloadImages
  } = useImageLoading();
  
  // Use these functions to manage image loading
  
  return (
    // Component JSX
  );
};
```

The provider is already set up in the application root, so you don't need to add it to individual components.

## Image Optimization Utilities

Additional utilities for image optimization are available in `@/utils/imageOptimization`:

```tsx
import { 
  generateSrcSet, 
  calculateSizes, 
  getOptimalImageFormat 
} from '@/utils/imageOptimization';

// Generate srcset attribute for responsive images
const srcset = generateSrcSet('/path/to/image.jpg', [320, 640, 960, 1280]);

// Calculate sizes attribute
const sizes = calculateSizes('100vw', [
  { 'max-width: 640px': '100vw' },
  { 'max-width: 1024px': '50vw' }
]);

// Get optimal image format based on browser support
const optimizedSrc = getOptimalImageFormat('/path/to/image.jpg');
```

## Best Practices

1. **Use LazyImage for all images**: Replace standard `<img>` tags with `<LazyImage>` throughout the application.

2. **Set priority for above-the-fold images**: Use `priority={true}` for critical images visible in the initial viewport.

3. **Process HTML content**: Always use `addLazyLoadingToImages` when rendering HTML content with images.

4. **Use the useLazyImages hook**: Apply to containers with dynamically loaded content.

5. **Preload important images**: Use preloading for images that will be needed soon but aren't immediately visible.

6. **Provide proper image dimensions**: Always specify width and height attributes to prevent layout shifts.

7. **Use appropriate image formats**: Consider using WebP or AVIF formats for better compression.

## Performance Considerations

- The lazy loading implementation reduces initial page load time and data usage.
- Images are only loaded when they enter the viewport or are about to enter it.
- Priority images are loaded eagerly regardless of viewport position.
- Low-quality image placeholders are shown while the full image loads.
- Network conditions are detected to limit concurrent image loading on slow connections.

## Browser Support

- The implementation works in all modern browsers.
- For browsers that don't support IntersectionObserver, images will load normally.
- For browsers that don't support modern image formats, the original format will be used.
