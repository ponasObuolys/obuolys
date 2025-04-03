import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ImageLoadingProvider } from "@/providers/ImageLoadingProvider";
import HomePage from "./pages/Index";
import ArticlesPage from "./pages/ArticlesPage";
import ArticleDetail from "./pages/ArticleDetail";
import ToolsPage from "./pages/ToolsPage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetail from "./pages/CourseDetail";
import ContactPage from "./pages/ContactPage";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ImageLoadingProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route index element={<HomePage />} />
              <Route path="/straipsniai" element={<ArticlesPage />} />
              <Route path="/straipsniai/:slug" element={<ArticleDetail />} />
              <Route path="/irankiai" element={<ToolsPage />} />
              <Route path="/kursai" element={<CoursesPage />} />
              <Route path="/kursai/:slug" element={<CourseDetail />} />
              <Route path="/kontaktai" element={<ContactPage />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ImageLoadingProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
