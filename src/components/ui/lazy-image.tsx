import React, { useState, useEffect, useRef } from 'react';
import { generateSrcSet, calculateSizes, getOptimalImageFormat } from '@/utils/imageOptimization';
import { useImageLoading } from '@/providers/ImageLoadingProvider';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholderSrc?: string;
  sizes?: string;
  srcSizes?: number[];
  threshold?: number;
  blurEffect?: boolean;
  priority?: boolean;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholderSrc,
  sizes,
  srcSizes = [320, 640, 960, 1280, 1920],
  threshold = 0.1,
  blurEffect = true,
  priority = false,
  className = '',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const { 
    addPriorityImage, 
    removePriorityImage, 
    isImageLoaded, 
    markImageAsLoaded 
  } = useImageLoading();
  
  // Generate optimized image sources
  const optimizedSrc = getOptimalImageFormat(src);
  const srcset = generateSrcSet(optimizedSrc, srcSizes);
  const sizesAttr = sizes || calculateSizes('100vw', [
    { 'max-width: 640px': '100vw' },
    { 'max-width: 1024px': '50vw' }
  ]);
  
  // Default low quality placeholder if not provided
  const defaultPlaceholder = `${src}?width=20&quality=30`;
  const lowQualitySrc = placeholderSrc || defaultPlaceholder;

  // Handle priority images
  useEffect(() => {
    if (priority) {
      addPriorityImage(optimizedSrc);
      return () => removePriorityImage(optimizedSrc);
    }
  }, [priority, optimizedSrc, addPriorityImage, removePriorityImage]);

  // Check if already loaded in cache
  useEffect(() => {
    if (isImageLoaded(optimizedSrc)) {
      setIsLoaded(true);
      setIsInView(true);
    }
  }, [optimizedSrc, isImageLoaded]);

  useEffect(() => {
    if (!imageRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsInView(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '50px',
        threshold
      }
    );
    
    observer.observe(imageRef.current);
    
    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, [threshold]);
  
  const handleImageLoad = () => {
    setIsLoaded(true);
    markImageAsLoaded(optimizedSrc);
  };
  
  const imageClasses = [
    className,
    blurEffect && !isLoaded ? 'filter blur-sm scale-105' : '',
    blurEffect && isLoaded ? 'filter blur-0 scale-100' : '',
    blurEffect ? 'transition-all duration-500' : ''
  ].filter(Boolean).join(' ');

  return (
    <img
      ref={imageRef}
      src={isInView || priority ? optimizedSrc : lowQualitySrc}
      srcSet={isInView || priority ? srcset : undefined}
      sizes={isInView || priority ? sizesAttr : undefined}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      onLoad={handleImageLoad}
      className={imageClasses}
      {...props}
    />
  );
};

export default LazyImage;
