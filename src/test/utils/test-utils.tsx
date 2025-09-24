/* eslint-disable react-refresh/only-export-components */
// Pastaba: Testų pagalbinėse bylose leidžiame eksportuoti ne tik komponentus.
// Šis išjungimas taikomas tik šiai bylai, kad būtų išvengta klaidų dėl
// react-refresh taisyklės, kuri aktuali tik vystymo per HMR scenarijus.
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { RenderOptions } from "@testing-library/react";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
      },
    },
  });

  return (
    <HelmetProvider>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <LanguageProvider>{children}</LanguageProvider>
          </AuthProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// Create authenticated version with mock setup
const AuthenticatedProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
      },
    },
  });

  // For authenticated tests, we'll mock a pre-authenticated state
  // This requires the AuthProvider to be properly mocked in the test setup
  return (
    <HelmetProvider>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <LanguageProvider>{children}</LanguageProvider>
          </AuthProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
};

const renderWithAuth = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) =>
  render(ui, { wrapper: AuthenticatedProviders, ...options });

// Create a query client for tests
export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
      },
      mutations: {
        retry: false,
      },
    },
  });

// Re-export everything
export * from "@testing-library/react";
export { customRender as render, renderWithAuth };

// Common test data factories
export const createMockArticle = (overrides = {}) => ({
  id: "test-article-id",
  title: "Test Article",
  content: "Test content",
  excerpt: "Test excerpt",
  image_url: "https://example.com/image.jpg",
  author: "Test Author",
  published_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  category: "Test Category",
  tags: ["test", "article"],
  slug: "test-article",
  meta_description: "Test meta description",
  ...overrides,
});

export const createMockTool = (overrides = {}) => ({
  id: "test-tool-id",
  name: "Test Tool",
  description: "Test tool description",
  url: "https://example.com",
  category: "Test Category",
  image_url: "https://example.com/tool.jpg",
  pricing: "Free",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  tags: ["test", "tool"],
  ...overrides,
});

export const createMockCourse = (overrides = {}) => ({
  id: "test-course-id",
  title: "Test Course",
  description: "Test course description",
  content: "Test course content",
  image_url: "https://example.com/course.jpg",
  duration: "2 hours",
  difficulty: "Beginner",
  price: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  published: true,
  category: "Test Category",
  ...overrides,
});

export const createMockUser = (overrides = {}) => ({
  id: "test-user-id",
  email: "test@example.com",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  email_confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  role: "authenticated",
  user_metadata: {},
  app_metadata: {},
  ...overrides,
});

// Test utilities for async operations
export const waitForLoadingToFinish = () => new Promise(resolve => setTimeout(resolve, 0));

// Mock intersection observer for lazy loading tests
export const mockIntersectionObserver = () => {
  const mockIntersectionObserver = vi.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  });
  window.IntersectionObserver = mockIntersectionObserver;
  return mockIntersectionObserver;
};
