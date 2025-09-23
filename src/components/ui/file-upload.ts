/**
 * Utility functions for handling file uploads and local image storage
 */

// Simple in-memory storage for test/development purposes
const localImageStorage = new Map<string, string>();

/**
 * Store a local image in memory storage
 * @param key - The key to store the image under
 * @param dataUrl - The data URL of the image
 */
export const storeLocalImage = (key: string, dataUrl: string): void => {
  localImageStorage.set(key, dataUrl);
};

/**
 * Retrieve a local image from memory storage
 * @param key - The key of the image to retrieve
 * @returns The data URL of the image or null if not found
 */
export const getLocalImage = (key: string): string | null => {
  return localImageStorage.get(key) || null;
};

/**
 * Remove a local image from memory storage
 * @param key - The key of the image to remove
 */
export const removeLocalImage = (key: string): void => {
  localImageStorage.delete(key);
};

/**
 * Clear all local images from memory storage
 */
export const clearLocalImages = (): void => {
  localImageStorage.clear();
};

/**
 * Get all stored image keys
 * @returns Array of all stored image keys
 */
export const getAllImageKeys = (): string[] => {
  return Array.from(localImageStorage.keys());
};

/**
 * Convert a file to a data URL
 * @param file - The file to convert
 * @returns Promise that resolves to the data URL
 */
export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Validate if a file is a valid image
 * @param file - The file to validate
 * @returns True if the file is a valid image
 */
export const isValidImage = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  return validTypes.includes(file.type);
};

/**
 * Get image dimensions from a file
 * @param file - The image file
 * @returns Promise that resolves to width and height
 */
export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};