import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { ImageLoadingProvider } from "@/providers/ImageLoadingProvider";
import HomePage from "./pages/Index";
import PublicationsPage from "./pages/PublicationsPage";
import PublicationDetail from "./pages/PublicationDetail";
import ToolsPage from "./pages/ToolsPage";
import ToolDetailPage from "./pages/ToolDetailPage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetail from "./pages/CourseDetail";
import ContactPage from "./pages/ContactPage";
import Auth from "./pages/Auth";
import ProfilePage from "./pages/ProfilePage";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import Layout from "@/components/layout/Layout";
import SupportPage from "./pages/SupportPage";

const queryClient = new QueryClient();

// Layout wrapper component
const SiteLayout = () => (
  <Layout>
    <Outlet /> {/* Renders the matched child route element */} 
  </Layout>
);

function App() {
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
                  <Route path="/publikacijos" element={<PublicationsPage />} />
                  <Route path="/publikacijos/:slug" element={<PublicationDetail />} />
                  <Route path="/irankiai" element={<ToolsPage />} />
                  <Route path="/irankiai/:slug" element={<ToolDetailPage />} />
                  <Route path="/kursai" element={<CoursesPage />} />
                  <Route path="/kursai/:slug" element={<CourseDetail />} />
                  <Route path="/kontaktai" element={<ContactPage />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/profilis" element={<ProfilePage />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/paremti" element={<SupportPage />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
              </TooltipProvider>
            </ImageLoadingProvider>
          </LanguageProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
