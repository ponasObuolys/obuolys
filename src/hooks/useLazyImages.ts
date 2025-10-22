import { useEffect, useRef } from "react";

/**
 * Hook to add lazy loading to images that are dynamically added to the DOM
 * This is useful for images that are added via innerHTML or dangerouslySetInnerHTML
 */
const useLazyImages = (containerRef: React.RefObject<HTMLElement>) => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Create a new IntersectionObserver if it doesn't exist
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          // If the element is in the viewport
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;

            // If the image has a data-src attribute, set the src to that value
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute("data-src");
            }

            // Stop observing the image
            observerRef.current?.unobserve(img);
          }
        });
      });
    }

    // Function to process images in the container
    const processImages = () => {
      if (!containerRef.current) return;

      // Get all images in the container
      const images = containerRef.current.querySelectorAll("img:not([loading])");

      // Add loading="lazy" attribute to all images
      images.forEach(img => {
        img.setAttribute("loading", "lazy");

        // For browsers that don't support loading="lazy"
        // Store the src in data-src and set src to a placeholder
        if (!("loading" in HTMLImageElement.prototype)) {
          const src = img.getAttribute("src");
          if (src) {
            img.setAttribute("data-src", src);
            img.setAttribute(
              "src",
              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMSAxIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIj48cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSIjZjFmMWYxIi8+PC9zdmc+"
            );
            observerRef.current?.observe(img);
          }
        }
      });
    };

    // Process images when the component mounts
    processImages();

    // Set up a MutationObserver to watch for new images being added to the container
    const observer = new MutationObserver(processImages);

    if (containerRef.current) {
      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
      });
    }

    // Clean up
    return () => {
      observer.disconnect();
      observerRef.current?.disconnect();
    };
  }, [containerRef]);
};

export default useLazyImages;
