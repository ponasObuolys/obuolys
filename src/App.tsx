import { GlobalErrorBoundary } from "@/components/error-boundaries";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ImageLoadingProvider } from "@/providers/ImageLoadingProvider";
import { CookieConsent } from "@/components/gdpr/cookie-consent";
import { log } from "@/utils/browserLogger";
import { reportWebVitals } from "@/utils/webVitals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "@/AppRoutes";

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
      // Duomenys laikomi "šviežiais" 5 minutes
      staleTime: 5 * 60 * 1000,
      // Visada refetch'inti kai komponentas mount'inasi (išsprendžia navigacijos problemą)
      refetchOnMount: true,
      // Nerefetch'inti kai sugrįžtama į langą (išvengti nereikalingų refetch)
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  // Initialize Web Vitals monitoring
  reportWebVitals();

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
                      <AppRoutes />
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
