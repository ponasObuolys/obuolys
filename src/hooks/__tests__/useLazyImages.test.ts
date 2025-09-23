import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLazyImages } from '@/hooks/useLazyImages';

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

describe('useLazyImages', () => {
  it('initializes with empty loaded images set', () => {
    const { result } = renderHook(() => useLazyImages());

    expect(result.current.loadedImages).toEqual(new Set());
    expect(typeof result.current.imageRef).toBe('function');
    expect(typeof result.current.isImageLoaded).toBe('function');
  });

  it('creates intersection observer on mount', () => {
    renderHook(() => useLazyImages());

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { threshold: 0.1 }
    );
  });

  it('disconnects observer on unmount', () => {
    const { unmount } = renderHook(() => useLazyImages());

    unmount();

    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('observes elements when imageRef is called', () => {
    const { result } = renderHook(() => useLazyImages());
    const mockElement = document.createElement('img');
    mockElement.dataset.src = 'https://example.com/image.jpg';

    act(() => {
      result.current.imageRef(mockElement);
    });

    expect(mockObserve).toHaveBeenCalledWith(mockElement);
  });

  it('does not observe elements without data-src', () => {
    const { result } = renderHook(() => useLazyImages());
    const mockElement = document.createElement('img');

    act(() => {
      result.current.imageRef(mockElement);
    });

    expect(mockObserve).not.toHaveBeenCalled();
  });

  it('handles null element in imageRef', () => {
    const { result } = renderHook(() => useLazyImages());

    act(() => {
      result.current.imageRef(null);
    });

    // Should not throw or cause issues
    expect(mockObserve).not.toHaveBeenCalled();
  });

  it('marks images as loaded when intersecting', () => {
    let intersectionCallback: (entries: any[]) => void;

    mockIntersectionObserver.mockImplementation((callback) => {
      intersectionCallback = callback;
      return {
        observe: mockObserve,
        disconnect: mockDisconnect,
        unobserve: mockUnobserve,
      };
    });

    const { result } = renderHook(() => useLazyImages());
    const mockElement = document.createElement('img');
    const imageSrc = 'https://example.com/image.jpg';
    mockElement.dataset.src = imageSrc;

    act(() => {
      result.current.imageRef(mockElement);
    });

    // Simulate intersection
    act(() => {
      intersectionCallback([{
        isIntersecting: true,
        target: mockElement
      }]);
    });

    expect(result.current.isImageLoaded(imageSrc)).toBe(true);
    expect(result.current.loadedImages.has(imageSrc)).toBe(true);
    expect(mockElement.src).toBe(imageSrc);
    expect(mockUnobserve).toHaveBeenCalledWith(mockElement);
  });

  it('does not load images when not intersecting', () => {
    let intersectionCallback: (entries: any[]) => void;

    mockIntersectionObserver.mockImplementation((callback) => {
      intersectionCallback = callback;
      return {
        observe: mockObserve,
        disconnect: mockDisconnect,
        unobserve: mockUnobserve,
      };
    });

    const { result } = renderHook(() => useLazyImages());
    const mockElement = document.createElement('img');
    const imageSrc = 'https://example.com/image.jpg';
    mockElement.dataset.src = imageSrc;

    act(() => {
      result.current.imageRef(mockElement);
    });

    // Simulate not intersecting
    act(() => {
      intersectionCallback([{
        isIntersecting: false,
        target: mockElement
      }]);
    });

    expect(result.current.isImageLoaded(imageSrc)).toBe(false);
    expect(result.current.loadedImages.has(imageSrc)).toBe(false);
    expect(mockElement.src).toBe('');
    expect(mockUnobserve).not.toHaveBeenCalled();
  });

  it('handles multiple images', () => {
    let intersectionCallback: (entries: any[]) => void;

    mockIntersectionObserver.mockImplementation((callback) => {
      intersectionCallback = callback;
      return {
        observe: mockObserve,
        disconnect: mockDisconnect,
        unobserve: mockUnobserve,
      };
    });

    const { result } = renderHook(() => useLazyImages());

    const image1 = document.createElement('img');
    const image2 = document.createElement('img');
    const src1 = 'https://example.com/image1.jpg';
    const src2 = 'https://example.com/image2.jpg';

    image1.dataset.src = src1;
    image2.dataset.src = src2;

    act(() => {
      result.current.imageRef(image1);
      result.current.imageRef(image2);
    });

    // Load first image
    act(() => {
      intersectionCallback([{
        isIntersecting: true,
        target: image1
      }]);
    });

    expect(result.current.isImageLoaded(src1)).toBe(true);
    expect(result.current.isImageLoaded(src2)).toBe(false);
    expect(result.current.loadedImages.size).toBe(1);

    // Load second image
    act(() => {
      intersectionCallback([{
        isIntersecting: true,
        target: image2
      }]);
    });

    expect(result.current.isImageLoaded(src1)).toBe(true);
    expect(result.current.isImageLoaded(src2)).toBe(true);
    expect(result.current.loadedImages.size).toBe(2);
  });

  it('provides isImageLoaded function that works correctly', () => {
    const { result } = renderHook(() => useLazyImages());

    // Initially no images loaded
    expect(result.current.isImageLoaded('https://example.com/test.jpg')).toBe(false);

    // After simulating load
    act(() => {
      // Manually add to loaded set (simulating intersection behavior)
      result.current.loadedImages.add('https://example.com/test.jpg');
    });

    expect(result.current.isImageLoaded('https://example.com/test.jpg')).toBe(true);
  });
});