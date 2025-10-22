import type { RouteErrorBoundaryFallbackProps } from "@/components/error-boundaries";
import {
  AdminRouteErrorBoundary,
  AuthRouteErrorBoundary,
  ChunkErrorFallback,
  ContentRouteErrorBoundary,
  GlobalErrorBoundary,
  RouteErrorBoundary,
} from "@/components/error-boundaries";
import Layout from "@/components/layout/Layout";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ImageLoadingProvider } from "@/providers/ImageLoadingProvider";
import { CookieConsent } from "@/components/gdpr/cookie-consent";
import { log } from "@/utils/browserLogger";
import {
  createLazyComponent,
  createNamedLazyComponent,
  setupIntelligentPreloading,
} from "@/utils/lazyLoad";
import { reportWebVitals } from "@/utils/webVitals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";

// Keep critical/frequently accessed pages as regular imports
import HomePage from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy load pages with intelligent caching and error boundary integration
const PublicationsPage = createLazyComponent(() => import("./pages/PublicationsPage"), {
  cacheKey: "publications",
  preload: true,
});
const PublicationDetail = createLazyComponent(() => import("./pages/PublicationDetail"), {
  cacheKey: "publication-detail",
});
const ToolsPage = createLazyComponent(() => import("./pages/ToolsPage"), {
  cacheKey: "tools",
  preload: true,
});
const ToolDetailPage = createLazyComponent(() => import("./pages/ToolDetailPage"), {
  cacheKey: "tool-detail",
});
const CoursesPage = createLazyComponent(() => import("./pages/CoursesPage"), {
  cacheKey: "courses",
});
const CourseDetail = createLazyComponent(() => import("./pages/CourseDetail"), {
  cacheKey: "course-detail",
});
const ContactPage = createLazyComponent(() => import("./pages/ContactPage"), {
  cacheKey: "contact",
});
const SupportPage = createLazyComponent(() => import("./pages/SupportPage"), {
  cacheKey: "support",
});
const CustomSolutionsPage = createLazyComponent(() => import("./pages/CustomSolutionsPage"), {
  cacheKey: "custom-solutions",
});
const PrivacyPolicyPage = createLazyComponent(() => import("./pages/PrivacyPolicyPage"), {
  cacheKey: "privacy-policy",
});
const CookiePolicyPage = createLazyComponent(() => import("./pages/CookiePolicyPage"), {
  cacheKey: "cookie-policy",
});

// Authentication and admin pages with separate chunking
const Auth = createNamedLazyComponent("auth-pages", () => import("./pages/Auth"));
const AuthCallback = createNamedLazyComponent("auth-pages", () => import("./pages/AuthCallback"));
const ProfilePage = createNamedLazyComponent("auth-pages", () => import("./pages/ProfilePage"));
const MyBookmarksPage = createNamedLazyComponent(
  "auth-pages",
  () => import("./pages/MyBookmarksPage")
);
const AdminDashboard = createNamedLazyComponent(
  "admin-dashboard",
  () => import("./pages/AdminDashboard")
);
const AdminUserCleanup = createNamedLazyComponent(
  "admin-dashboard",
  () => import("./pages/AdminUserCleanup")
);
const AdminSetup = createNamedLazyComponent(
  "admin-dashboard",
  () => import("./components/admin/AdminSetup")
);
const AdminInfo = createNamedLazyComponent(
  "admin-dashboard",
  () => import("./components/admin/AdminInfo")
);
const AdminInquiriesPage = createNamedLazyComponent(
  "admin-dashboard",
  () => import("./pages/admin/InquiriesPage")
);
const AdminCTAManagementPage = createNamedLazyComponent(
  "admin-dashboard",
  () => import("./pages/admin/CTAManagementPage")
);
const AdminCTAAnalyticsPage = createNamedLazyComponent(
  "admin-dashboard",
  () => import("./pages/admin/CTAAnalyticsPage")
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Add error handling to React Query
      retry: (failureCount, error) => {
        // Don't retry auth errors
        if (error instanceof Error && error.message.includes("auth")) {
          return false;
        }
        return failureCount < 3;
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

// Fallback komponentas chunk klaidoms
const ChunkBoundaryFallback = ({ error, resetError }: RouteErrorBoundaryFallbackProps) => (
  <ChunkErrorFallback error={error} resetError={resetError} variant="page" />
);

// Enhanced Suspense wrapper with chunk error handling
const SuspenseWithChunkError = ({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback: React.ReactNode;
}) => (
  <Suspense fallback={fallback}>
    <RouteErrorBoundary
      fallback={ChunkBoundaryFallback}
      enableAutoRecovery={false} // Chunk errors typically require page reload
    >
      {children}
    </RouteErrorBoundary>
  </Suspense>
);

// Layout wrapper component with route-level error handling
const SiteLayout = () => (
  <Layout>
    <Outlet />
  </Layout>
);

const App = () => {
  // Initialize Web Vitals monitoring
  reportWebVitals();

  // Setup intelligent preloading
  useEffect(() => {
    const preloadManager = setupIntelligentPreloading([
      {
        path: "publications",
        importFn: () => import("./pages/PublicationsPage"),
        priority: "high",
      },
      {
        path: "tools",
        importFn: () => import("./pages/ToolsPage"),
        priority: "high",
      },
      {
        path: "courses",
        importFn: () => import("./pages/CoursesPage"),
        priority: "medium",
      },
      {
        path: "contact",
        importFn: () => import("./pages/ContactPage"),
        priority: "medium",
      },
      {
        path: "support",
        importFn: () => import("./pages/SupportPage"),
        priority: "low",
      },
      {
        path: "custom-solutions",
        importFn: () => import("./pages/CustomSolutionsPage"),
        priority: "medium",
      },
      {
        path: "publication-detail",
        importFn: () => import("./pages/PublicationDetail"),
        priority: "medium",
      },
      {
        path: "tool-detail",
        importFn: () => import("./pages/ToolDetailPage"),
        priority: "medium",
      },
      {
        path: "course-detail",
        importFn: () => import("./pages/CourseDetail"),
        priority: "low",
      },
    ]);

    // Log preloading status in development
    if (process.env.NODE_ENV === "development") {
      setTimeout(() => {
        log.info("Preloading status:", { cache: preloadManager.getCacheStatus() });
      }, 3000);
    }

    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <GlobalErrorBoundary
      enableErrorReporting={true}
      showErrorDetails={import.meta.env.DEV}
      logToConsole={import.meta.env.DEV}
      onCriticalError={(error, errorReport) => {
        // Enhanced critical error handling
        log.error("Critical application error:", {
          errorId: errorReport.id,
          message: error.message,
          type: errorReport.type,
          severity: errorReport.severity,
        });
      }}
    >
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <LanguageProvider>
              <ThemeProvider>
                <ImageLoadingProvider>
                  <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    <BrowserRouter
                      future={{
                        v7_startTransition: true,
                        v7_relativeSplatPath: true,
                      }}
                    >
                      <Routes>
                        <Route path="/" element={<SiteLayout />}>
                          {/* Home page with content error boundary */}
                          <Route
                            index
                            element={
                              <ContentRouteErrorBoundary
                                routePath="/"
                                routeName="HomePage"
                                enableAutoRecovery={true}
                              >
                                <HomePage />
                              </ContentRouteErrorBoundary>
                            }
                          />

                          {/* Public content pages with content error boundaries */}
                          <Route
                            path="/publikacijos"
                            element={
                              <ContentRouteErrorBoundary
                                routePath="/publikacijos"
                                routeName="PublicationsPage"
                              >
                                <SuspenseWithChunkError
                                  fallback={<LoadingSpinner text="Kraunamos publikacijos..." />}
                                >
                                  <PublicationsPage />
                                </SuspenseWithChunkError>
                              </ContentRouteErrorBoundary>
                            }
                          />
                          <Route
                            path="/publikacijos/:slug"
                            element={
                              <ContentRouteErrorBoundary
                                routePath="/publikacijos/:slug"
                                routeName="PublicationDetail"
                              >
                                <SuspenseWithChunkError
                                  fallback={<LoadingSpinner text="Kraunama publikacija..." />}
                                >
                                  <PublicationDetail />
                                </SuspenseWithChunkError>
                              </ContentRouteErrorBoundary>
                            }
                          />
                          <Route
                            path="/irankiai"
                            element={
                              <ContentRouteErrorBoundary
                                routePath="/irankiai"
                                routeName="ToolsPage"
                              >
                                <SuspenseWithChunkError
                                  fallback={<LoadingSpinner text="Kraunami įrankiai..." />}
                                >
                                  <ToolsPage />
                                </SuspenseWithChunkError>
                              </ContentRouteErrorBoundary>
                            }
                          />
                          <Route
                            path="/irankiai/:slug"
                            element={
                              <ContentRouteErrorBoundary
                                routePath="/irankiai/:slug"
                                routeName="ToolDetailPage"
                              >
                                <SuspenseWithChunkError
                                  fallback={<LoadingSpinner text="Kraunamas įrankis..." />}
                                >
                                  <ToolDetailPage />
                                </SuspenseWithChunkError>
                              </ContentRouteErrorBoundary>
                            }
                          />
                          <Route
                            path="/kursai"
                            element={
                              <ContentRouteErrorBoundary
                                routePath="/kursai"
                                routeName="CoursesPage"
                              >
                                <SuspenseWithChunkError
                                  fallback={<LoadingSpinner text="Kraunami kursai..." />}
                                >
                                  <CoursesPage />
                                </SuspenseWithChunkError>
                              </ContentRouteErrorBoundary>
                            }
                          />
                          <Route
                            path="/kursai/:slug"
                            element={
                              <ContentRouteErrorBoundary
                                routePath="/kursai/:slug"
                                routeName="CourseDetail"
                              >
                                <SuspenseWithChunkError
                                  fallback={<LoadingSpinner text="Kraunamas kursas..." />}
                                >
                                  <CourseDetail />
                                </SuspenseWithChunkError>
                              </ContentRouteErrorBoundary>
                            }
                          />
                          <Route
                            path="/kontaktai"
                            element={
                              <ContentRouteErrorBoundary
                                routePath="/kontaktai"
                                routeName="ContactPage"
                              >
                                <SuspenseWithChunkError
                                  fallback={<LoadingSpinner text="Kraunami kontaktai..." />}
                                >
                                  <ContactPage />
                                </SuspenseWithChunkError>
                              </ContentRouteErrorBoundary>
                            }
                          />
                          <Route
                            path="/paremti"
                            element={
                              <ContentRouteErrorBoundary
                                routePath="/paremti"
                                routeName="SupportPage"
                              >
                                <SuspenseWithChunkError
                                  fallback={<LoadingSpinner text="Kraunamas paramos puslapis..." />}
                                >
                                  <SupportPage />
                                </SuspenseWithChunkError>
                              </ContentRouteErrorBoundary>
                            }
                          />
                          <Route
                            path="/verslo-sprendimai"
                            element={
                              <ContentRouteErrorBoundary
                                routePath="/verslo-sprendimai"
                                routeName="CustomSolutionsPage"
                              >
                                <SuspenseWithChunkError
                                  fallback={<LoadingSpinner text="Kraunami verslo sprendimai..." />}
                                >
                                  <CustomSolutionsPage />
                                </SuspenseWithChunkError>
                              </ContentRouteErrorBoundary>
                            }
                          />
                          <Route
                            path="/privatumas"
                            element={
                              <ContentRouteErrorBoundary
                                routePath="/privatumas"
                                routeName="PrivacyPolicyPage"
                              >
                                <SuspenseWithChunkError
                                  fallback={
                                    <LoadingSpinner text="Kraunama privatumo politika..." />
                                  }
                                >
                                  <PrivacyPolicyPage />
                                </SuspenseWithChunkError>
                              </ContentRouteErrorBoundary>
                            }
                          />
                          <Route
                            path="/slapukai"
                            element={
                              <ContentRouteErrorBoundary
                                routePath="/slapukai"
                                routeName="CookiePolicyPage"
                              >
                                <SuspenseWithChunkError
                                  fallback={<LoadingSpinner text="Kraunama slapukų politika..." />}
                                >
                                  <CookiePolicyPage />
                                </SuspenseWithChunkError>
                              </ContentRouteErrorBoundary>
                            }
                          />

                          {/* Authentication routes with auth error boundaries */}
                          <Route
                            path="/auth"
                            element={
                              <AuthRouteErrorBoundary routePath="/auth" routeName="Auth">
                                <SuspenseWithChunkError
                                  fallback={
                                    <LoadingSpinner text="Kraunama prisijungimo forma..." />
                                  }
                                >
                                  <Auth />
                                </SuspenseWithChunkError>
                              </AuthRouteErrorBoundary>
                            }
                          />
                          <Route
                            path="/auth/callback"
                            element={
                              <AuthRouteErrorBoundary
                                routePath="/auth/callback"
                                routeName="AuthCallback"
                              >
                                <SuspenseWithChunkError
                                  fallback={<LoadingSpinner text="Jungiamasi..." />}
                                >
                                  <AuthCallback />
                                </SuspenseWithChunkError>
                              </AuthRouteErrorBoundary>
                            }
                          />
                          <Route
                            path="/profilis"
                            element={
                              <AuthRouteErrorBoundary routePath="/profilis" routeName="ProfilePage">
                                <SuspenseWithChunkError
                                  fallback={<LoadingSpinner text="Kraunamas profilis..." />}
                                >
                                  <ProfilePage />
                                </SuspenseWithChunkError>
                              </AuthRouteErrorBoundary>
                            }
                          />
                          <Route
                            path="/mano-sarasas"
                            element={
                              <AuthRouteErrorBoundary
                                routePath="/mano-sarasas"
                                routeName="MyBookmarksPage"
                              >
                                <SuspenseWithChunkError
                                  fallback={<LoadingSpinner text="Kraunamas sąrašas..." />}
                                >
                                  <MyBookmarksPage />
                                </SuspenseWithChunkError>
                              </AuthRouteErrorBoundary>
                            }
                          />

                          {/* Admin routes with admin error boundaries */}
                          <Route
                            path="/admin"
                            element={
                              <AdminRouteErrorBoundary
                                routePath="/admin"
                                routeName="AdminDashboard"
                              >
                                <SuspenseWithChunkError
                                  fallback={
                                    <LoadingSpinner text="Kraunamas administravimo skydelis..." />
                                  }
                                >
                                  <AdminDashboard />
                                </SuspenseWithChunkError>
                              </AdminRouteErrorBoundary>
                            }
                          />
                          <Route
                            path="/admin/cleanup"
                            element={
                              <AdminRouteErrorBoundary
                                routePath="/admin/cleanup"
                                routeName="AdminUserCleanup"
                              >
                                <SuspenseWithChunkError
                                  fallback={
                                    <LoadingSpinner text="Kraunamas naudotojų valymo skydelis..." />
                                  }
                                >
                                  <AdminUserCleanup />
                                </SuspenseWithChunkError>
                              </AdminRouteErrorBoundary>
                            }
                          />
                          <Route
                            path="/admin/setup"
                            element={
                              <ContentRouteErrorBoundary
                                routePath="/admin/setup"
                                routeName="AdminSetup"
                              >
                                <SuspenseWithChunkError
                                  fallback={<LoadingSpinner text="Kraunamas admin setup..." />}
                                >
                                  <AdminSetup />
                                </SuspenseWithChunkError>
                              </ContentRouteErrorBoundary>
                            }
                          />
                          <Route
                            path="/admin/info"
                            element={
                              <ContentRouteErrorBoundary
                                routePath="/admin/info"
                                routeName="AdminInfo"
                              >
                                <SuspenseWithChunkError
                                  fallback={<LoadingSpinner text="Kraunama admin informacija..." />}
                                >
                                  <AdminInfo />
                                </SuspenseWithChunkError>
                              </ContentRouteErrorBoundary>
                            }
                          />
                          <Route
                            path="/admin/inquiries"
                            element={
                              <AdminRouteErrorBoundary
                                routePath="/admin/inquiries"
                                routeName="AdminInquiriesPage"
                              >
                                <SuspenseWithChunkError
                                  fallback={<LoadingSpinner text="Kraunamos užklausos..." />}
                                >
                                  <AdminInquiriesPage />
                                </SuspenseWithChunkError>
                              </AdminRouteErrorBoundary>
                            }
                          />
                          <Route
                            path="/admin/cta"
                            element={
                              <AdminRouteErrorBoundary
                                routePath="/admin/cta"
                                routeName="AdminCTAManagementPage"
                              >
                                <SuspenseWithChunkError
                                  fallback={<LoadingSpinner text="Kraunamas CTA valdymas..." />}
                                >
                                  <AdminCTAManagementPage />
                                </SuspenseWithChunkError>
                              </AdminRouteErrorBoundary>
                            }
                          />
                          <Route
                            path="/admin/analytics"
                            element={
                              <AdminRouteErrorBoundary
                                routePath="/admin/analytics"
                                routeName="AdminCTAAnalyticsPage"
                              >
                                <SuspenseWithChunkError
                                  fallback={<LoadingSpinner text="Kraunama analytics..." />}
                                >
                                  <AdminCTAAnalyticsPage />
                                </SuspenseWithChunkError>
                              </AdminRouteErrorBoundary>
                            }
                          />

                          {/* 404 page with route error boundary */}
                          <Route
                            path="*"
                            element={
                              <ContentRouteErrorBoundary routePath="*" routeName="NotFound">
                                <NotFound />
                              </ContentRouteErrorBoundary>
                            }
                          />
                        </Route>
                      </Routes>
                    </BrowserRouter>
                  </TooltipProvider>
                </ImageLoadingProvider>
              </ThemeProvider>
            </LanguageProvider>
          </AuthProvider>
        </QueryClientProvider>
      </HelmetProvider>

      {/* GDPR Cookie Consent Banner */}
      <CookieConsent />
    </GlobalErrorBoundary>
  );
};

export default App;
