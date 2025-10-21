import { ImageComponentErrorBoundary, ImageErrorFallback } from "@/components/error-boundaries";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useImageLoading } from "@/providers/useImageLoading";
import { calculateSizes, generateSrcSet, getOptimalImageFormat } from "@/utils/imageOptimization";
import React, { useEffect, useRef, useState } from "react";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholderSrc?: string;
  sizes?: string;
  srcSizes?: number[];
  threshold?: number;
  blurEffect?: boolean;
  priority?: boolean;
  // CLS optimization - explicit dimensions
  width?: number | string;
  height?: number | string;
  aspectRatio?: string; // e.g., "16/9", "4/3", "1/1"
  // Error handling props
  showErrorFallback?: boolean;
  errorFallbackClassName?: string;
  onImageError?: (error: Error) => void;
  retryOnError?: boolean;
}

const LazyImageInner: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholderSrc,
  sizes,
  srcSizes = [320, 640, 960, 1280, 1920],
  threshold = 0.1,
  blurEffect = true,
  priority = false,
  className = "",
  width,
  height,
  aspectRatio,
  showErrorFallback = true,
  errorFallbackClassName = "",
  onImageError,
  retryOnError = true,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [, setErrorMessage] = useState<string>("");
  const imageRef = useRef<HTMLImageElement>(null);

  const { addPriorityImage, removePriorityImage, isImageLoaded, markImageAsLoaded } =
    useImageLoading();

  const { handleError } = useErrorHandler({
    defaultErrorType: "image",
    showToast: false, // Don't show toast for image errors
    enableRetry: retryOnError,
    componentName: "LazyImage",
    additionalContext: {
      src,
      alt,
      priority,
    },
  });

  // Generate optimized image sources
  const optimizedSrc = getOptimalImageFormat(src);
  const srcset = generateSrcSet(optimizedSrc, srcSizes);
  const sizesAttr =
    sizes ||
    calculateSizes("100vw", [{ "max-width: 640px": "100vw" }, { "max-width: 1024px": "50vw" }]);

  // Default low quality placeholder if not provided
  const defaultPlaceholder = `${src}?width=20&quality=30`;
  const lowQualitySrc = placeholderSrc || defaultPlaceholder;

  // Handle priority images
  useEffect(() => {
    if (priority) {
      addPriorityImage(optimizedSrc);
      return () => removePriorityImage(optimizedSrc);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priority, optimizedSrc]);

  // Check if already loaded in cache
  useEffect(() => {
    if (isImageLoaded(optimizedSrc)) {
      setIsLoaded(true);
      setIsInView(true);
    }
  }, [optimizedSrc, isImageLoaded]);

  useEffect(() => {
    if (!imageRef.current) return;

    const currentImageRef = imageRef.current;

    const observer = new IntersectionObserver(
      entries => {
        const [entry] = entries;
        setIsInView(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: "50px",
        threshold,
      }
    );

    observer.observe(currentImageRef);

    return () => {
      if (currentImageRef) {
        observer.unobserve(currentImageRef);
      }
    };
  }, [threshold]);

  const handleImageLoad = () => {
    setIsLoaded(true);
    setHasError(false);
    setErrorMessage("");
    markImageAsLoaded(optimizedSrc);
  };

  const handleImageError = (_event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const error = new Error(`Image failed to load: ${src}`);
    handleError(error);

    setHasError(true);
    setErrorMessage(`Nepavyko įkelti paveikslėlio: ${alt}`);

    // Call custom error handler if provided
    onImageError?.(error);
  };

  const imageClasses = [
    className,
    blurEffect && !isLoaded ? "filter blur-sm scale-105" : "",
    blurEffect && isLoaded ? "filter blur-0 scale-100" : "",
    blurEffect ? "transition-all duration-500" : "",
  ]
    .filter(Boolean)
    .join(" ");

  // CLS optimization: Calculate inline styles for dimensions
  const dimensionStyles: React.CSSProperties = {
    ...(aspectRatio && { aspectRatio }),
    ...(width && { width: typeof width === 'number' ? `${width}px` : width }),
    ...(height && { height: typeof height === 'number' ? `${height}px` : height }),
  };

  // Show error fallback if image failed to load and error fallback is enabled
  if (hasError && showErrorFallback) {
    return <ImageErrorFallback className={errorFallbackClassName || className} alt={alt} />;
  }

  return (
    <img
      ref={imageRef}
      src={isInView || priority ? optimizedSrc : lowQualitySrc}
      srcSet={isInView || priority ? srcset : undefined}
      sizes={isInView || priority ? sizesAttr : undefined}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      onLoad={handleImageLoad}
      onError={handleImageError}
      className={imageClasses}
      style={dimensionStyles}
      {...props}
    />
  );
};

/**
 * LazyImage component with integrated error boundary
 */
const LazyImage: React.FC<LazyImageProps> = props => {
  return (
    <ImageComponentErrorBoundary
      componentName="LazyImage"
      isolate={true}
      showRetry={props.retryOnError !== false}
      fallback={() => (
        <ImageErrorFallback
          className={props.errorFallbackClassName || props.className}
          alt={props.alt}
        />
      )}
    >
      <LazyImageInner {...props} />
    </ImageComponentErrorBoundary>
  );
};

export default LazyImage;
