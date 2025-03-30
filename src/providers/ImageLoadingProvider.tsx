import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define NetworkInformation interface for TypeScript
interface NetworkInformation {
  saveData: boolean;
  effectiveType: string;
  addEventListener: (type: string, listener: EventListener) => void;
  removeEventListener: (type: string, listener: EventListener) => void;
}

// Extend Navigator interface to include connection property
interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
}

interface ImageLoadingContextType {
  priorityImages: string[];
  addPriorityImage: (src: string) => void;
  removePriorityImage: (src: string) => void;
  isImageLoaded: (src: string) => boolean;
  markImageAsLoaded: (src: string) => void;
  preloadImages: (srcs: string[]) => void;
}

const ImageLoadingContext = createContext<ImageLoadingContextType | undefined>(undefined);

interface ImageLoadingProviderProps {
  children: ReactNode;
}

export const ImageLoadingProvider: React.FC<ImageLoadingProviderProps> = ({ children }) => {
  const [priorityImages, setPriorityImages] = useState<string[]>([]);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  
  // Add an image to the priority queue
  const addPriorityImage = (src: string) => {
    setPriorityImages(prev => {
      if (!prev.includes(src)) {
        return [...prev, src];
      }
      return prev;
    });
  };
  
  // Remove an image from the priority queue
  const removePriorityImage = (src: string) => {
    setPriorityImages(prev => prev.filter(img => img !== src));
  };
  
  // Check if an image is already loaded
  const isImageLoaded = (src: string): boolean => {
    return loadedImages.has(src);
  };
  
  // Mark an image as loaded
  const markImageAsLoaded = (src: string) => {
    setLoadedImages(prev => {
      const newSet = new Set(prev);
      newSet.add(src);
      return newSet;
    });
  };
  
  // Preload a batch of images
  const preloadImages = (srcs: string[]) => {
    if (!srcs.length) return;
    
    // Use requestIdleCallback if available, otherwise use setTimeout
    const requestIdleCallback = 
      window.requestIdleCallback || 
      ((cb) => setTimeout(cb, 1));
    
    requestIdleCallback(() => {
      srcs.forEach(src => {
        if (!isImageLoaded(src)) {
          const img = new Image();
          img.onload = () => markImageAsLoaded(src);
          img.src = src;
        }
      });
    });
  };
  
  // Listen for network status changes to manage loading strategy
  useEffect(() => {
    const handleConnectionChange = () => {
      const nav = navigator as NavigatorWithConnection;
      const isSlowConnection = nav.connection && 
        (nav.connection.saveData || 
        (nav.connection.effectiveType || '').includes('2g'));
      
      if (isSlowConnection) {
        // On slow connections, limit concurrent image loading
        setPriorityImages(prev => prev.slice(0, 3));
      }
    };
    
    // Add event listener if the API is available
    const nav = navigator as NavigatorWithConnection;
    if (nav.connection) {
      nav.connection.addEventListener('change', handleConnectionChange);
      handleConnectionChange();
    }
    
    return () => {
      const nav = navigator as NavigatorWithConnection;
      if (nav.connection) {
        nav.connection.removeEventListener('change', handleConnectionChange);
      }
    };
  }, []);
  
  const value = {
    priorityImages,
    addPriorityImage,
    removePriorityImage,
    isImageLoaded,
    markImageAsLoaded,
    preloadImages
  };
  
  return (
    <ImageLoadingContext.Provider value={value}>
      {children}
    </ImageLoadingContext.Provider>
  );
};

// Custom hook to use the image loading context
export const useImageLoading = (): ImageLoadingContextType => {
  const context = useContext(ImageLoadingContext);
  if (context === undefined) {
    throw new Error('useImageLoading must be used within an ImageLoadingProvider');
  }
  return context;
};
