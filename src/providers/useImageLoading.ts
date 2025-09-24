import { useContext } from "react";
import { ImageLoadingContext, type ImageLoadingContextType } from "./image-loading-context";

export const useImageLoading = (): ImageLoadingContextType => {
  const context = useContext(ImageLoadingContext);
  if (context === undefined) {
    throw new Error("useImageLoading must be used within an ImageLoadingProvider");
  }
  return context;
};
