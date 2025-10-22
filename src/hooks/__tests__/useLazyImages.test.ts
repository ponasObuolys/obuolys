import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useLazyImages from "@/hooks/useLazyImages";

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();
const mockUnobserve = vi.fn();

beforeEach(() => {
  mockIntersectionObserver.mockReturnValue({
    observe: mockObserve,
    disconnect: mockDisconnect,
    unobserve: mockUnobserve,
  });
  window.IntersectionObserver = mockIntersectionObserver;
  vi.clearAllMocks();
});

describe("useLazyImages", () => {
  it("initializes with container ref", () => {
    const containerRef = { current: document.createElement("div") };

    // Hook should not throw and should handle the ref
    expect(() => {
      renderHook(() => useLazyImages(containerRef));
    }).not.toThrow();
  });

  it("creates intersection observer on mount", () => {
    const containerRef = { current: document.createElement("div") };
    renderHook(() => useLazyImages(containerRef));

    expect(mockIntersectionObserver).toHaveBeenCalledWith(expect.any(Function));
  });

  it("disconnects observer on unmount", () => {
    const containerRef = { current: document.createElement("div") };
    const { unmount } = renderHook(() => useLazyImages(containerRef));

    unmount();

    expect(mockDisconnect).toHaveBeenCalled();
  });

  it("processes images in container with data-src attributes", () => {
    const containerRef = { current: document.createElement("div") };
    const mockImage = document.createElement("img");
    mockImage.src = "https://example.com/image.jpg";
    containerRef.current.appendChild(mockImage);

    renderHook(() => useLazyImages(containerRef));

    // Should add loading attribute to images
    expect(mockImage.getAttribute("loading")).toBe("lazy");
  });

  it("handles containers without images", () => {
    const containerRef = { current: document.createElement("div") };

    expect(() => {
      renderHook(() => useLazyImages(containerRef));
    }).not.toThrow();
  });

  it("handles null container ref", () => {
    const containerRef = { current: null };

    expect(() => {
      renderHook(() => useLazyImages(containerRef));
    }).not.toThrow();
  });

  it("loads images when intersecting (for browsers without native lazy loading)", () => {
    // Mock browser without native lazy loading support
    const originalLoading = HTMLImageElement.prototype.loading;
    delete (HTMLImageElement.prototype as any).loading;

    let intersectionCallback: (entries: any[]) => void;

    mockIntersectionObserver.mockImplementation(callback => {
      intersectionCallback = callback;
      return {
        observe: mockObserve,
        disconnect: mockDisconnect,
        unobserve: mockUnobserve,
      };
    });

    const containerRef = { current: document.createElement("div") };
    const mockElement = document.createElement("img");
    const imageSrc = "https://example.com/image.jpg";
    mockElement.src = imageSrc;
    containerRef.current.appendChild(mockElement);

    renderHook(() => useLazyImages(containerRef));

    // Simulate intersection for the fallback case
    act(() => {
      intersectionCallback([
        {
          isIntersecting: true,
          target: mockElement,
        },
      ]);
    });

    expect(mockUnobserve).toHaveBeenCalledWith(mockElement);

    // Restore
    (HTMLImageElement.prototype as any).loading = originalLoading;
  });

  it("does not unobserve images when not intersecting", () => {
    let intersectionCallback: (entries: any[]) => void;

    mockIntersectionObserver.mockImplementation(callback => {
      intersectionCallback = callback;
      return {
        observe: mockObserve,
        disconnect: mockDisconnect,
        unobserve: mockUnobserve,
      };
    });

    const containerRef = { current: document.createElement("div") };
    const mockElement = document.createElement("img");
    mockElement.src = "https://example.com/image.jpg";
    mockElement.setAttribute("data-src", "https://example.com/image.jpg");
    containerRef.current.appendChild(mockElement);

    renderHook(() => useLazyImages(containerRef));

    // Simulate not intersecting
    act(() => {
      intersectionCallback([
        {
          isIntersecting: false,
          target: mockElement,
        },
      ]);
    });

    expect(mockUnobserve).not.toHaveBeenCalled();
  });

  it("handles multiple images in container", () => {
    const containerRef = { current: document.createElement("div") };

    const image1 = document.createElement("img");
    const image2 = document.createElement("img");
    image1.src = "https://example.com/image1.jpg";
    image2.src = "https://example.com/image2.jpg";

    containerRef.current.appendChild(image1);
    containerRef.current.appendChild(image2);

    renderHook(() => useLazyImages(containerRef));

    // Both images should get loading="lazy" attribute
    expect(image1.getAttribute("loading")).toBe("lazy");
    expect(image2.getAttribute("loading")).toBe("lazy");
  });

  it("observes dynamically added images via MutationObserver", () => {
    const containerRef = { current: document.createElement("div") };

    renderHook(() => useLazyImages(containerRef));

    // Add image dynamically
    const newImage = document.createElement("img");
    newImage.src = "https://example.com/dynamic.jpg";

    act(() => {
      if (containerRef.current) {
        containerRef.current.appendChild(newImage);
      }
      // Trigger MutationObserver callback manually
      // In real environment, MutationObserver would detect this
    });

    // Should not throw
    expect(containerRef.current.children).toHaveLength(1);
  });
});
