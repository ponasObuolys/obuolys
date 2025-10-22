/**
 * Adds lazy loading attributes to all img tags in HTML content
 * @param htmlContent The HTML content containing images
 * @returns Modified HTML content with lazy loading attributes added to images
 */
export const addLazyLoadingToImages = (htmlContent: string): string => {
  if (!htmlContent) return "";

  // Add loading="lazy" attribute to all img tags that don't already have it
  return htmlContent.replace(/<img(?!\s+[^>]*\sloading=)[^>]*>/gi, match => {
    // If the img tag already ends with />, insert the loading attribute before the closing
    if (match.endsWith("/>")) {
      return match.replace(/\/>$/, ' loading="lazy" />');
    }
    // Otherwise, insert the loading attribute before the closing >
    return match.replace(/>$/, ' loading="lazy">');
  });
};
