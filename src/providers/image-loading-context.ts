import { createContext } from "react";

export interface ImageLoadingContextType {
  priorityImages: string[];
  addPriorityImage: (src: string) => void;
  removePriorityImage: (src: string) => void;
  isImageLoaded: (src: string) => boolean;
  markImageAsLoaded: (src: string) => void;
  preloadImages: (srcs: string[]) => void;
}

export const ImageLoadingContext = createContext<ImageLoadingContextType | undefined>(undefined);
