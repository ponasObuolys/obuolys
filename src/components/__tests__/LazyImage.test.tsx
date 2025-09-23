import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/utils/test-utils';
import { LazyImage } from '@/components/ui/LazyImage';

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

  it('renders with placeholder initially', () => {
    render(<LazyImage {...defaultProps} />);

    const placeholder = screen.getByTestId('lazy-image-placeholder');
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toHaveClass('test-class');
  });

  it('sets up intersection observer on mount', () => {
    render(<LazyImage {...defaultProps} />);

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { threshold: 0.1 }
    );
  });

  it('loads image when intersecting', async () => {
    // Mock intersection observer callback
    let intersectionCallback: (entries: any[]) => void;
    mockIntersectionObserver.mockImplementation((callback) => {
      intersectionCallback = callback;
      return {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      };
    });

    render(<LazyImage {...defaultProps} />);

    // Simulate intersection
    const mockEntry = {
      isIntersecting: true,
      target: document.createElement('div')
    };

    intersectionCallback!([mockEntry]);

    await waitFor(() => {
      const img = screen.getByRole('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', defaultProps.src);
      expect(img).toHaveAttribute('alt', defaultProps.alt);
    });
  });

  it('handles image load error gracefully', async () => {
    // Mock intersection observer callback
    let intersectionCallback: (entries: any[]) => void;
    mockIntersectionObserver.mockImplementation((callback) => {
      intersectionCallback = callback;
      return {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      };
    });

    render(<LazyImage {...defaultProps} />);

    // Simulate intersection
    const mockEntry = {
      isIntersecting: true,
      target: document.createElement('div')
    };

    intersectionCallback!([mockEntry]);

    await waitFor(() => {
      const img = screen.getByRole('img');
      // Simulate error
      img.dispatchEvent(new Event('error'));
    });

    // Should still show the image element with potential fallback
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('cleans up intersection observer on unmount', () => {
    const mockDisconnect = vi.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: mockDisconnect,
    });

    const { unmount } = render(<LazyImage {...defaultProps} />);

    unmount();

    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('applies custom width and height', () => {
    render(
      <LazyImage
        {...defaultProps}
        width={200}
        height={150}
      />
    );

    const placeholder = screen.getByTestId('lazy-image-placeholder');
    expect(placeholder).toHaveStyle({ width: '200px', height: '150px' });
  });

  it('loads immediately when src changes', async () => {
    const { rerender } = render(<LazyImage {...defaultProps} />);

    // Change src prop
    rerender(<LazyImage {...defaultProps} src="https://example.com/new-image.jpg" />);

    // Should trigger new intersection observer setup
    expect(mockIntersectionObserver).toHaveBeenCalledTimes(2);
  });
});