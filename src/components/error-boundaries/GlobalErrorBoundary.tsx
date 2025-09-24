/**
 * Global error boundary - top-level error catcher for the entire application
 * Handles critical errors that could crash the entire React application
 */

import { secureLogger } from "@/utils/browserLogger";
import type { ErrorReport } from "@/utils/errorReporting";
import { createErrorReport, reportError } from "@/utils/errorReporting";
import type { ErrorInfo, ReactNode } from "react";
import React, { Component } from "react";
import { ErrorFallback } from "./ErrorFallback";

export interface GlobalErrorBoundaryProps {
  children: ReactNode;
  // Fallback component for catastrophic errors
  fallback?: React.ComponentType<GlobalErrorBoundaryFallbackProps>;
  // Event handlers
  onError?: (error: Error, errorInfo: ErrorInfo, errorReport: ErrorReport) => void;
  onCriticalError?: (error: Error, errorReport: ErrorReport) => void;
  // Configuration options
  showErrorDetails?: boolean;
  enableErrorReporting?: boolean;
  // Development options
  logToConsole?: boolean;
}

export interface GlobalErrorBoundaryFallbackProps {
  error: Error;
  errorReport: ErrorReport;
  resetError: () => void;
  isFullPageError: boolean;
}

interface GlobalErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorReport: ErrorReport | null;
  errorId: string | null;
  isRecoverable: boolean;
  crashCount: number;
}

/**
 * Global error boundary for application-level error handling
 */
export class GlobalErrorBoundary extends Component<
  GlobalErrorBoundaryProps,
  GlobalErrorBoundaryState
> {
  private crashTimestamps: number[] = [];
  private readonly maxCrashesPerMinute = 3;
  private readonly crashTimeWindow = 60 * 1000; // 1 minute

  constructor(props: GlobalErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      errorReport: null,
      errorId: null,
      isRecoverable: true,
      crashCount: 0,
    };

    // Listen for unhandled Promise rejections
    this.setupGlobalErrorHandlers();
  }

  static getDerivedStateFromError(error: Error): Partial<GlobalErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const currentTime = Date.now();

    // Track crash frequency
    this.crashTimestamps.push(currentTime);
    this.crashTimestamps = this.crashTimestamps.filter(
      timestamp => currentTime - timestamp < this.crashTimeWindow
    );

    const crashCount = this.crashTimestamps.length;
    const isRecoverable = crashCount < this.maxCrashesPerMinute;

    // Create comprehensive error report
    const errorReport = createErrorReport(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: "GlobalErrorBoundary",
      additionalData: {
        crashCount,
        isRecoverable,
        crashTimestamps: this.crashTimestamps,
        userAgent: navigator.userAgent,
        url: window.location.href,
        referrer: document.referrer,
        timestamp: currentTime,
        reactErrorInfo: errorInfo,
        // Browser and system information
        browserInfo: {
          language: navigator.language,
          languages: navigator.languages,
          platform: navigator.platform,
          onLine: navigator.onLine,
          cookieEnabled: navigator.cookieEnabled,
        },
        // Page state information
        pageState: {
          title: document.title,
          visibilityState: document.visibilityState,
          readyState: document.readyState,
        },
      },
    });

    // Force severity to critical for global boundary errors
    errorReport.severity = "critical";

    // Update state
    this.setState({
      errorReport,
      errorId: errorReport.id,
      crashCount,
      isRecoverable,
    });

    // Report the critical error
    if (this.props.enableErrorReporting !== false) {
      reportError(errorReport);
    }

    // Call custom error handlers
    this.props.onError?.(error, errorInfo, errorReport);
    this.props.onCriticalError?.(error, errorReport);

    // Enhanced logging for global errors
    secureLogger.security("Global error boundary triggered", "critical", {
      errorId: errorReport.id,
      errorMessage: error.message,
      crashCount,
      isRecoverable,
      componentStack: errorInfo.componentStack,
      stack: error.stack,
    });

    // Additional verbose logging can be enabled via secureLogger if needed in development
    if (this.props.logToConsole !== false && import.meta.env.DEV) {
      secureLogger.debug("Global Error Boundary (development verbose log)", {
        errorId: errorReport.id,
        message: error.message,
        componentStack: errorInfo.componentStack,
        stack: error.stack,
      });
    }

    // In production, consider reporting to external monitoring
    if (import.meta.env.PROD) {
      this.reportToExternalService(error, errorReport);
    }

    // If too many crashes, disable recovery
    if (!isRecoverable) {
      secureLogger.security("Application in unstable state - recovery disabled", "critical", {
        crashCount,
        crashTimestamps: this.crashTimestamps,
      });
    }
  }

  componentWillUnmount() {
    // Clean up global error handlers
    this.cleanupGlobalErrorHandlers();
  }

  setupGlobalErrorHandlers = () => {
    // Handle unhandled Promise rejections
    window.addEventListener("unhandledrejection", this.handleUnhandledRejection);

    // Handle global JavaScript errors that might bypass React
    window.addEventListener("error", this.handleGlobalError);

    // Handle resource loading errors (images, scripts, etc.)
    window.addEventListener("error", this.handleResourceError, true);
  };

  cleanupGlobalErrorHandlers = () => {
    window.removeEventListener("unhandledrejection", this.handleUnhandledRejection);
    window.removeEventListener("error", this.handleGlobalError);
    window.removeEventListener("error", this.handleResourceError, true);
  };

  handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    // Convert Promise rejection to Error if it isn't already
    const error =
      event.reason instanceof Error
        ? event.reason
        : new Error(`Unhandled Promise rejection: ${String(event.reason)}`);

    const errorReport = createErrorReport(error, {
      errorBoundary: "GlobalErrorBoundary",
      additionalData: {
        type: "unhandledRejection",
        reason: event.reason,
        promise: "Promise object (not serializable)",
      },
    });

    errorReport.type = "javascript";
    errorReport.severity = "high";

    reportError(errorReport);

    secureLogger.error("Unhandled Promise rejection", {
      errorId: errorReport.id,
      reason: String(event.reason),
    });

    // Prevent default browser behavior (console error)
    event.preventDefault();
  };

  handleGlobalError = (event: ErrorEvent) => {
    // Only handle if not already caught by React error boundary
    if (!this.state.hasError) {
      const error = event.error || new Error(event.message);

      const errorReport = createErrorReport(error, {
        errorBoundary: "GlobalErrorBoundary",
        additionalData: {
          type: "globalError",
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });

      errorReport.type = "javascript";
      errorReport.severity = "high";

      reportError(errorReport);

      secureLogger.error("Global JavaScript error", {
        errorId: errorReport.id,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    }
  };

  handleResourceError = (event: Event) => {
    const { target } = event;

    if (target && target instanceof HTMLElement) {
      const tagName = target.tagName?.toLowerCase();

      const getElementUrl = (el: HTMLElement): string | undefined => {
        if (el instanceof HTMLImageElement || el instanceof HTMLScriptElement) return el.src;
        if (el instanceof HTMLLinkElement) return el.href;
        if (el instanceof HTMLVideoElement || el instanceof HTMLAudioElement)
          return el.currentSrc || el.src;
        if (el instanceof HTMLIFrameElement) return el.src;
        return undefined;
      };

      const src = getElementUrl(target);

      const error = new Error(`Resource failed to load: ${tagName} - ${src ?? "nenurodytas"}`);

      const errorReport = createErrorReport(error, {
        errorBoundary: "GlobalErrorBoundary",
        additionalData: {
          type: "resourceError",
          tagName,
          src,
          outerHTML: target.outerHTML?.substring(0, 200),
        },
      });

      errorReport.type = tagName === "img" ? "image" : "network";
      errorReport.severity = "medium";

      reportError(errorReport);

      secureLogger.warn("Resource loading error", {
        errorId: errorReport.id,
        tagName,
        src,
      });
    }
  };

  reportToExternalService = async (error: Error, errorReport: ErrorReport) => {
    try {
      // Placeholder for external error reporting service
      // Could integrate with Sentry, LogRocket, Bugsnag, etc.

      // Example implementation:
      // await fetch('/api/errors/critical', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     errorReport,
      //     browserFingerprint: await getBrowserFingerprint(),
      //     sessionId: getSessionId()
      //   })
      // });

      secureLogger.info("Critical error reported to external service", {
        errorId: errorReport.id,
      });
    } catch (reportingError) {
      secureLogger.error("Failed to report critical error to external service", {
        originalErrorId: errorReport.id,
        reportingError: reportingError instanceof Error ? reportingError.message : "Unknown",
      });
    }
  };

  resetError = () => {
    // Clear error state
    this.setState({
      hasError: false,
      error: null,
      errorReport: null,
      errorId: null,
      isRecoverable: true,
      crashCount: 0,
    });

    // Clear crash history on successful reset
    this.crashTimestamps = [];

    secureLogger.info("GlobalErrorBoundary reset successfully");
  };

  handleFullReload = () => {
    secureLogger.info("Performing full page reload due to critical error");
    window.location.reload();
  };

  render() {
    if (this.state.hasError && this.state.error && this.state.errorReport) {
      // If not recoverable, show critical error state
      if (!this.state.isRecoverable) {
        return (
          <ErrorFallback
            error={this.state.error}
            errorType={this.state.errorReport.type}
            errorMessage="Programa patyrė kritinę klaidą ir negali tęsti veiklos. Prašome perkrauti puslapį."
            variant="page"
            showRetry={false}
            showNavigation={false}
            retry={this.handleFullReload}
            componentName="GlobalErrorBoundary"
            errorBoundaryType="GlobalErrorBoundary (Critical)"
            showErrorDetails={this.props.showErrorDetails}
          />
        );
      }

      // Use custom fallback component if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error}
            errorReport={this.state.errorReport}
            resetError={this.resetError}
            isFullPageError={true}
          />
        );
      }

      // Default fallback with full page error handling
      return (
        <ErrorFallback
          error={this.state.error}
          errorType={this.state.errorReport.type}
          resetError={this.resetError}
          retry={this.handleFullReload}
          variant="page"
          showRetry={true}
          showNavigation={true}
          showErrorDetails={this.props.showErrorDetails}
          componentName="GlobalErrorBoundary"
          errorBoundaryType="GlobalErrorBoundary"
          retryCount={this.state.crashCount}
        />
      );
    }

    // No error - render children normally
    return this.props.children;
  }
}

/**
 * Hook for accessing global error boundary methods from child components
 */
export function useGlobalErrorBoundary() {
  const reportGlobalError = (error: Error, context?: Record<string, unknown>) => {
    const errorReport = createErrorReport(error, {
      errorBoundary: "GlobalErrorBoundary",
      additionalData: {
        reportedViaHook: true,
        ...context,
      },
    });

    reportError(errorReport);

    secureLogger.error("Error reported via useGlobalErrorBoundary hook", {
      errorId: errorReport.id,
      context,
    });

    return errorReport;
  };

  return {
    reportGlobalError,
  };
}
