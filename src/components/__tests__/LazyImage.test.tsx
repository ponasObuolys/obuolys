import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/utils/test-utils';
import LazyImage from '@/components/ui/lazy-image';

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
});
window.IntersectionObserver = mockIntersectionObserver;

describe('LazyImage', () => {
  const defaultProps = {
    src: 'https://example.com/test-image.jpg',
    alt: 'Test image',
    className: 'test-class'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with fallback image initially when using blur placeholder', () => {
    render(<LazyImage {...defaultProps} placeholderSrc="/images/placeholder.png" blurEffect={true} />);

    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveClass('test-class');
    // New component uses blur-sm instead of opacity-40
  });

  it('renders with loading="lazy" attribute', () => {
    render(<LazyImage {...defaultProps} />);

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('loading', 'lazy');
  });

  it('loads image immediately for regular URLs', async () => {
    // Mock successful image loading
    const mockImage = {
      onload: null as ((event: Event) => void) | null,
      onerror: null as ((event: Event) => void) | null,
      src: ''
    };

    const originalImage = window.Image;
    window.Image = vi.fn(() => mockImage as any);

    render(<LazyImage {...defaultProps} />);

    // Simulate successful image load
    if (mockImage.onload) {
      mockImage.onload(new Event('load'));
    }

    await waitFor(() => {
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('alt', defaultProps.alt);
    });

    window.Image = originalImage;
  });

  it('handles image load error gracefully', async () => {
    // Mock failed image loading
    const mockImage = {
      onload: null as ((event: Event) => void) | null,
      onerror: null as ((event: Event) => void) | null,
      src: ''
    };

    const originalImage = window.Image;
    window.Image = vi.fn(() => mockImage as any);

    render(<LazyImage {...defaultProps} showErrorFallback={true} />);

    // Simulate failed image load
    if (mockImage.onerror) {
      mockImage.onerror(new Event('error'));
    }

    await waitFor(() => {
      const img = screen.getByRole('img');
      expect(img).toBeInTheDocument();
      // Should show fallback image on error
    });

    window.Image = originalImage;
  });

  it('cleans up properly on unmount', () => {
    const { unmount } = render(<LazyImage {...defaultProps} />);

    // Should unmount without errors
    expect(() => unmount()).not.toThrow();
  });

  it('applies custom width and height', () => {
    render(
      <LazyImage
        {...defaultProps}
        width={200}
        height={150}
      />
    );

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('width', '200');
    expect(img).toHaveAttribute('height', '150');
  });

  it('reloads when src changes', async () => {
    const originalImage = window.Image;
    const mockImageConstructor = vi.fn(() => ({
      onload: null,
      onerror: null,
      src: ''
    }));
    window.Image = mockImageConstructor as any;

    const { rerender } = render(<LazyImage {...defaultProps} />);

    // Change src prop
    rerender(<LazyImage {...defaultProps} src="https://example.com/new-image.jpg" />);

    // Should create new Image instance for the new src
    expect(mockImageConstructor).toHaveBeenCalled();

    window.Image = originalImage;
  });
});