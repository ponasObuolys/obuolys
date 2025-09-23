import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { Suspense } from 'react';
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { ImageLoadingProvider } from "@/providers/ImageLoadingProvider";
import { Analytics } from '@vercel/analytics/react';
import { createLazyComponent, createNamedLazyComponent } from "@/utils/lazyLoad";
import { reportWebVitals } from "@/utils/webVitals";
import Layout from "@/components/layout/Layout";
import LoadingSpinner from "@/components/ui/loading-spinner";

// Keep critical/frequently accessed pages as regular imports
import HomePage from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy load heavy/less frequently accessed pages
const PublicationsPage = createLazyComponent(() => import("./pages/PublicationsPage"));
const PublicationDetail = createLazyComponent(() => import("./pages/PublicationDetail"));
const ToolsPage = createLazyComponent(() => import("./pages/ToolsPage"));
const ToolDetailPage = createLazyComponent(() => import("./pages/ToolDetailPage"));
const CoursesPage = createLazyComponent(() => import("./pages/CoursesPage"));
const CourseDetail = createLazyComponent(() => import("./pages/CourseDetail"));
const ContactPage = createLazyComponent(() => import("./pages/ContactPage"));
const SupportPage = createLazyComponent(() => import("./pages/SupportPage"));

// Lazy load authentication and admin pages (separate chunks)
const Auth = createNamedLazyComponent("auth", () => import("./pages/Auth"));
const ProfilePage = createNamedLazyComponent("profile", () => import("./pages/ProfilePage"));
const AdminDashboard = createNamedLazyComponent("admin", () => import("./pages/AdminDashboard"));

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
              <Analytics />
              </TooltipProvider>
            </ImageLoadingProvider>
          </LanguageProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
