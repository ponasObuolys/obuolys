import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { Suspense, useEffect } from 'react';
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { ImageLoadingProvider } from "@/providers/ImageLoadingProvider";
import { Analytics } from '@vercel/analytics/react';
import {
  createLazyComponent,
  createNamedLazyComponent,
  setupIntelligentPreloading
} from "@/utils/lazyLoad";
import { reportWebVitals } from "@/utils/webVitals";
import Layout from "@/components/layout/Layout";
import LoadingSpinner from "@/components/ui/loading-spinner";

// Keep critical/frequently accessed pages as regular imports
import HomePage from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy load pages with intelligent caching
const PublicationsPage = createLazyComponent(() => import("./pages/PublicationsPage"), {
  cacheKey: "publications",
  preload: true
});
const PublicationDetail = createLazyComponent(() => import("./pages/PublicationDetail"), {
  cacheKey: "publication-detail"
});
const ToolsPage = createLazyComponent(() => import("./pages/ToolsPage"), {
  cacheKey: "tools",
  preload: true
});
const ToolDetailPage = createLazyComponent(() => import("./pages/ToolDetailPage"), {
  cacheKey: "tool-detail"
});
const CoursesPage = createLazyComponent(() => import("./pages/CoursesPage"), {
  cacheKey: "courses"
});
const CourseDetail = createLazyComponent(() => import("./pages/CourseDetail"), {
  cacheKey: "course-detail"
});
const ContactPage = createLazyComponent(() => import("./pages/ContactPage"), {
  cacheKey: "contact"
});
const SupportPage = createLazyComponent(() => import("./pages/SupportPage"), {
  cacheKey: "support"
});

// Authentication and admin pages with separate chunking
const Auth = createNamedLazyComponent("auth-pages", () => import("./pages/Auth"));
const ProfilePage = createNamedLazyComponent("auth-pages", () => import("./pages/ProfilePage"));
const AdminDashboard = createNamedLazyComponent("admin-dashboard", () => import("./pages/AdminDashboard"));
const AdminUserCleanup = createNamedLazyComponent("admin-dashboard", () => import("./pages/AdminUserCleanup"));

const queryClient = new QueryClient();

// Layout wrapper component
const SiteLayout = () => (
  <Layout>
    <Outlet /> {/* Renders the matched child route element */} 
  </Layout>
);

function App() {
  // Initialize Web Vitals monitoring
  reportWebVitals();

  // Setup intelligent preloading
  useEffect(() => {
    const preloadManager = setupIntelligentPreloading([
      {
        path: "publications",
        importFn: () => import("./pages/PublicationsPage"),
        priority: "high"
      },
      {
        path: "tools",
        importFn: () => import("./pages/ToolsPage"),
        priority: "high"
      },
      {
        path: "courses",
        importFn: () => import("./pages/CoursesPage"),
        priority: "medium"
      },
      {
        path: "contact",
        importFn: () => import("./pages/ContactPage"),
        priority: "medium"
      },
      {
        path: "support",
        importFn: () => import("./pages/SupportPage"),
        priority: "low"
      },
      {
        path: "publication-detail",
        importFn: () => import("./pages/PublicationDetail"),
        priority: "medium"
      },
      {
        path: "tool-detail",
        importFn: () => import("./pages/ToolDetailPage"),
        priority: "medium"
      },
      {
        path: "course-detail",
        importFn: () => import("./pages/CourseDetail"),
        priority: "low"
      }
    ]);

    // Log preloading status in development
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        console.log('Preloading status:', preloadManager.getCacheStatus());
      }, 3000);
    }

    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LanguageProvider>
            <ImageLoadingProvider>
              <TooltipProvider>
              <Toaster />
              <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<SiteLayout />} > {/* Use SiteLayout as the element */}
                  <Route index element={<HomePage />} />
                  <Route
                    path="/publikacijos"
                    element={
                      <Suspense fallback={<LoadingSpinner text="Kraunamos publikacijos..." />}>
                        <PublicationsPage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/publikacijos/:slug"
                    element={
                      <Suspense fallback={<LoadingSpinner text="Kraunama publikacija..." />}>
                        <PublicationDetail />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/irankiai"
                    element={
                      <Suspense fallback={<LoadingSpinner text="Kraunami įrankiai..." />}>
                        <ToolsPage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/irankiai/:slug"
                    element={
                      <Suspense fallback={<LoadingSpinner text="Kraunamas įrankis..." />}>
                        <ToolDetailPage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/kursai"
                    element={
                      <Suspense fallback={<LoadingSpinner text="Kraunami kursai..." />}>
                        <CoursesPage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/kursai/:slug"
                    element={
                      <Suspense fallback={<LoadingSpinner text="Kraunamas kursas..." />}>
                        <CourseDetail />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/kontaktai"
                    element={
                      <Suspense fallback={<LoadingSpinner text="Kraunami kontaktai..." />}>
                        <ContactPage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/auth"
                    element={
                      <Suspense fallback={<LoadingSpinner text="Kraunama prisijungimo forma..." />}>
                        <Auth />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/profilis"
                    element={
                      <Suspense fallback={<LoadingSpinner text="Kraunamas profilis..." />}>
                        <ProfilePage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <Suspense fallback={<LoadingSpinner text="Kraunamas administravimo skydelis..." />}>
                        <AdminDashboard />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/admin/cleanup"
                    element={
                      <Suspense fallback={<LoadingSpinner text="Kraunamas naudotojų valymo skydelis..." />}>
                        <AdminUserCleanup />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/paremti"
                    element={
                      <Suspense fallback={<LoadingSpinner text="Kraunamas paramos puslapis..." />}>
                        <SupportPage />
                      </Suspense>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
              {import.meta.env.PROD && <Analytics />}
              </TooltipProvider>
            </ImageLoadingProvider>
          </LanguageProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
