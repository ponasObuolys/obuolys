/**
 * Route-level error boundary for page-specific error handling
 * Provides graceful error recovery for entire route components
 */

import { secureLogger } from "@/utils/browserLogger";
import type { ErrorReport } from "@/utils/errorReporting";
import { createErrorReport, reportError, type ErrorType } from "@/utils/errorReporting";
import type { ComponentType, ErrorInfo, ReactNode } from "react";
import { Component } from "react";
import { ErrorFallback } from "./ErrorFallback";

export interface RouteErrorBoundaryProps {
  children: ReactNode;
  // Route information
  routePath?: string;
  routeName?: string;
  isAuthRequired?: boolean;
  isAdminRoute?: boolean;
  // Error handling options
  fallback?: ComponentType<RouteErrorBoundaryFallbackProps>;
  onError?: (error: Error, errorInfo: ErrorInfo, errorReport: ErrorReport) => void;
  onNavigationError?: (error: Error, errorReport: ErrorReport) => void;
  // Recovery options
  showRetry?: boolean;
  showNavigation?: boolean;
  showErrorDetails?: boolean;
  // Auto-recovery
  enableAutoRecovery?: boolean;
  autoRecoveryDelay?: number; // seconds
}

export interface RouteErrorBoundaryFallbackProps {
  error: Error;
  errorReport: ErrorReport;
  resetError: () => void;
  routePath?: string;
  routeName?: string;
  isAuthRequired?: boolean;
  isAdminRoute?: boolean;
}

interface RouteErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorReport: ErrorReport | null;
  errorId: string | null;
  isRecovering: boolean;
  recoveryAttempts: number;
}

/**
 * Route-level error boundary with navigation awareness
 */
export class RouteErrorBoundary extends Component<
  RouteErrorBoundaryProps,
  RouteErrorBoundaryState
> {
  private recoveryTimeoutId: number | null = null;
  private maxRecoveryAttempts = 3;

  constructor(props: RouteErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      errorReport: null,
      errorId: null,
      isRecovering: false,
      recoveryAttempts: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<RouteErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { routePath, routeName, isAuthRequired, isAdminRoute } = this.props;

    // Determine error type based on route context
    let errorType: ErrorType = "routing";

    // Check for specific error types
    if (error.message.includes("ChunkLoadError") || error.message.includes("Loading chunk")) {
      errorType = "chunk";
    } else if (error.message.includes("auth") || error.message.includes("unauthorized")) {
      errorType = "auth";
    } else if (error.message.includes("supabase") || error.message.includes("database")) {
      errorType = "supabase";
    } else if (error.message.includes("network") || error.message.includes("fetch")) {
      errorType = "network";
    }

    // Create comprehensive error report
    const errorReport = createErrorReport(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: "RouteErrorBoundary",
      additionalData: {
        routePath,
        routeName,
        isAuthRequired,
        isAdminRoute,
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        timestamp: Date.now(),
        reactErrorInfo: errorInfo,
      },
    });

    // Override error type
    errorReport.type = errorType;

    // Adjust severity based on route importance
    if (isAdminRoute || routePath === "/") {
      errorReport.severity = "high";
    }

    // Update state
    this.setState({
      errorReport,
      errorId: errorReport.id,
      recoveryAttempts: this.state.recoveryAttempts + 1,
    });

    // Report the error
    reportError(errorReport);

    // Call custom error handler
    this.props.onError?.(error, errorInfo, errorReport);

    // Handle navigation-specific errors
    if (errorType === "routing" || errorType === "auth") {
      this.props.onNavigationError?.(error, errorReport);
    }

    // Log route-specific information
    secureLogger.error("RouteErrorBoundary caught error", {
      routePath,
      routeName,
      errorType,
      errorId: errorReport.id,
      isAuthRequired,
      isAdminRoute,
      recoveryAttempts: this.state.recoveryAttempts,
    });

    // Attempt auto-recovery if enabled
    this.attemptAutoRecovery();
  }

  componentWillUnmount() {
    if (this.recoveryTimeoutId) {
      clearTimeout(this.recoveryTimeoutId);
    }
  }

  attemptAutoRecovery = () => {
    const { enableAutoRecovery, autoRecoveryDelay = 5 } = this.props;
    const { recoveryAttempts } = this.state;

    if (
      enableAutoRecovery &&
      recoveryAttempts < this.maxRecoveryAttempts &&
      this.state.errorReport?.isRecoverable
    ) {
      this.setState({ isRecovering: true });

      this.recoveryTimeoutId = window.setTimeout(() => {
        secureLogger.info("Attempting auto-recovery", {
          errorId: this.state.errorId,
          attempt: recoveryAttempts + 1,
        });

        this.resetError();
      }, autoRecoveryDelay * 1000);
    }
  };

  resetError = () => {
    // Clear recovery timeout
    if (this.recoveryTimeoutId) {
      clearTimeout(this.recoveryTimeoutId);
      this.recoveryTimeoutId = null;
    }

    // Reset error state
    this.setState({
      hasError: false,
      error: null,
      errorReport: null,
      errorId: null,
      isRecovering: false,
      recoveryAttempts: 0,
    });

    secureLogger.info("RouteErrorBoundary reset", {
      routePath: this.props.routePath,
      routeName: this.props.routeName,
    });
  };

  retryRoute = () => {
    // For chunk errors, reload the page
    if (this.state.errorReport?.type === "chunk") {
      window.location.reload();
      return;
    }

    // For other errors, reset the boundary
    this.resetError();
  };

  render() {
    const { showRetry = true, showNavigation = true, showErrorDetails, fallback } = this.props;

    if (this.state.hasError && this.state.error && this.state.errorReport) {
      // Show recovery message if auto-recovering
      if (this.state.isRecovering) {
        return (
          <ErrorFallback
            error={this.state.error}
            errorType={this.state.errorReport.type}
            errorMessage="Automatiškai atkuriama..."
            variant="page"
            showRetry={false}
            showNavigation={false}
            isRetrying={true}
            retryCount={this.state.recoveryAttempts}
          />
        );
      }

      // Use custom fallback component if provided
      if (fallback) {
        const FallbackComponent = fallback;
        return (
          <FallbackComponent
            error={this.state.error}
            errorReport={this.state.errorReport}
            resetError={this.resetError}
            routePath={this.props.routePath}
            routeName={this.props.routeName}
            isAuthRequired={this.props.isAuthRequired}
            isAdminRoute={this.props.isAdminRoute}
          />
        );
      }

      // Use default error fallback with page layout
      return (
        <ErrorFallback
          error={this.state.error}
          errorType={this.state.errorReport.type}
          resetError={this.resetError}
          retry={this.retryRoute}
          retryCount={this.state.recoveryAttempts}
          variant="page"
          showRetry={showRetry}
          showNavigation={showNavigation}
          showErrorDetails={showErrorDetails}
          componentName={`Route: ${this.props.routeName || this.props.routePath}`}
          errorBoundaryType="RouteErrorBoundary"
        />
      );
    }

    // No error - render children normally
    return this.props.children;
  }
}

/**
 * Specialized route error boundary for authentication-required routes
 */
export const AuthRouteErrorBoundary = ({
  children,
  ...props
}: Omit<RouteErrorBoundaryProps, "isAuthRequired">) => {
  return (
    <RouteErrorBoundary
      {...props}
      isAuthRequired={true}
      enableAutoRecovery={false} // Auth errors typically require user action
      onNavigationError={(error, errorReport) => {
        // Redirect to login on auth errors
        if (errorReport.type === "auth") {
          secureLogger.auth("Route auth error, redirecting to login", undefined, {
            routePath: props.routePath,
            errorId: errorReport.id,
          });

          // Redirect to auth page after a short delay
          setTimeout(() => {
            window.location.href = "/auth";
          }, 1000);
        }
      }}
    >
      {children}
    </RouteErrorBoundary>
  );
};

/**
 * Specialized route error boundary for admin routes
 */
export const AdminRouteErrorBoundary = ({
  children,
  ...props
}: Omit<RouteErrorBoundaryProps, "isAdminRoute">) => {
  return (
    <RouteErrorBoundary
      {...props}
      isAdminRoute={true}
      showErrorDetails={true} // Show details for admin users
      enableAutoRecovery={true}
      autoRecoveryDelay={3}
      onError={(error, errorInfo, errorReport) => {
        // Enhanced logging for admin route errors
        secureLogger.security("Admin route error", "medium", {
          routePath: props.routePath,
          errorId: errorReport.id,
          errorType: errorReport.type,
          userId: "admin", // Could be enhanced with actual user ID
        });
      }}
    >
      {children}
    </RouteErrorBoundary>
  );
};

/**
 * Specialized route error boundary for public content routes
 */
export const ContentRouteErrorBoundary = ({ children, ...props }: RouteErrorBoundaryProps) => {
  return (
    <RouteErrorBoundary
      {...props}
      enableAutoRecovery={true}
      autoRecoveryDelay={5}
      showErrorDetails={false} // Hide technical details for public users
    >
      {children}
    </RouteErrorBoundary>
  );
};

/**
 * HOC for wrapping route components with error boundaries
 */
// withRouteErrorBoundary perkelta į atskirą failą, kad būtų palaikomas react-refresh
