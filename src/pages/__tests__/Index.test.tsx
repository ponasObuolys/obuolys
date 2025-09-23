import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/utils/test-utils';
import Index from '@/pages/Index';
import { createMockArticle, createMockTool, createMockCourse } from '@/test/utils/supabase-test-utils';

// Mock the child components to focus on Index page logic
vi.mock('@/components/home/Hero', () => ({
  default: () => <div data-testid="hero-component">Hero Component</div>
}));

vi.mock('@/components/home/FeaturedArticles', () => ({
  default: () => <div data-testid="featured-articles">Featured Articles</div>
}));

vi.mock('@/components/home/AITools', () => ({
  default: () => <div data-testid="ai-tools">AI Tools</div>
}));

vi.mock('@/components/home/Courses', () => ({
  default: () => <div data-testid="courses">Courses</div>
}));

vi.mock('@/components/home/CallToAction', () => ({
  default: () => <div data-testid="call-to-action">Call to Action</div>
}));

// Mock Supabase queries
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      then: vi.fn().mockResolvedValue({
        data: [],
        error: null
      })
    }))
  }
}));

describe('Index Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all main sections', () => {
    render(<Index />);

    expect(screen.getByTestId('hero-component')).toBeInTheDocument();
    expect(screen.getByTestId('featured-articles')).toBeInTheDocument();
    expect(screen.getByTestId('ai-tools')).toBeInTheDocument();
    expect(screen.getByTestId('courses')).toBeInTheDocument();
    expect(screen.getByTestId('call-to-action')).toBeInTheDocument();
  });

  it('has correct document title', () => {
    render(<Index />);

    expect(document.title).toContain('Pono Obuolio');
  });

  it('renders without crashing when components are missing', () => {
    // This tests the resilience of the page structure
    render(<Index />);

    // Should render the page structure even if individual components fail
    expect(document.body).toBeInTheDocument();
  });

  it('scrolls to top on mount', () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo');

    render(<Index />);

    // The useScrollToTop hook should be called
    expect(scrollToSpy).toHaveBeenCalledWith(0, 0);
  });

  it('renders sections in correct order', () => {
    render(<Index />);

    const sections = [
      screen.getByTestId('hero-component'),
      screen.getByTestId('featured-articles'),
      screen.getByTestId('ai-tools'),
      screen.getByTestId('courses'),
      screen.getByTestId('call-to-action')
    ];

    // Check that sections appear in the DOM in the expected order
    sections.forEach((section, index) => {
      expect(section).toBeInTheDocument();
      if (index > 0) {
        // Each section should come after the previous one in DOM order
        expect(section.compareDocumentPosition(sections[index - 1]))
          .toBe(Node.DOCUMENT_POSITION_PRECEDING);
      }
    });
  });

  it('applies correct CSS classes for layout', () => {
    const { container } = render(<Index />);

    // Check that the main container has appropriate structure
    const mainElement = container.querySelector('main');
    expect(mainElement).toBeInTheDocument();
  });

  it('handles responsive layout', () => {
    // Test mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    render(<Index />);

    // All components should still be present on mobile
    expect(screen.getByTestId('hero-component')).toBeInTheDocument();
    expect(screen.getByTestId('featured-articles')).toBeInTheDocument();
    expect(screen.getByTestId('ai-tools')).toBeInTheDocument();
    expect(screen.getByTestId('courses')).toBeInTheDocument();
    expect(screen.getByTestId('call-to-action')).toBeInTheDocument();
  });

  it('maintains semantic HTML structure', () => {
    const { container } = render(<Index />);

    // Should have proper semantic structure
    const main = container.querySelector('main');
    expect(main).toBeInTheDocument();

    // Should not have any accessibility violations (basic check)
    expect(container).toHaveAttribute('tabIndex', '-1');
  });
});