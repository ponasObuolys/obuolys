/**
 * Component-level error boundary for isolated error handling
 * Catches errors in specific components without affecting the entire application
 */

import type { ErrorReport } from "@/utils/errorReporting";
import { createErrorReport, reportError, type ErrorType } from "@/utils/errorReporting";
import type { ErrorInfo, ReactNode } from "react";
import React, { Component } from "react";
import { ErrorFallback } from "./ErrorFallback";

export interface ComponentErrorBoundaryProps {
  children: ReactNode;
  // Fallback component customization
  fallback?: React.ComponentType<ComponentErrorBoundaryFallbackProps>;
  // Error handling options
  errorType?: ErrorType;
  componentName?: string;
  isolate?: boolean; // Whether to isolate errors to this component only
  showRetry?: boolean;
  showErrorDetails?: boolean;
  // Event handlers
  onError?: (error: Error, errorInfo: ErrorInfo, errorReport: ErrorReport) => void;
  onReset?: () => void;
  // Auto-reset options
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number>;
  // Styling
  className?: string;
}

export interface ComponentErrorBoundaryFallbackProps {
  error: Error;
  errorReport: ErrorReport;
  resetError: () => void;
  componentName?: string;
}

interface ComponentErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorReport: ErrorReport | null;
  errorId: string | null;
  retryCount: number;
}

/**
 * Component-level error boundary with isolation and recovery
 */
export class ComponentErrorBoundary extends Component<
  ComponentErrorBoundaryProps,
  ComponentErrorBoundaryState
> {
  private resetTimeoutId: number | null = null;
  private previousResetKeys: Array<string | number> = [];

  constructor(props: ComponentErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      errorReport: null,
      errorId: null,
      retryCount: 0,
    };

    // Store initial reset keys
    if (props.resetKeys) {
      this.previousResetKeys = [...props.resetKeys];
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ComponentErrorBoundaryState> {
    // Update state to trigger error UI rendering
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Create comprehensive error report
    const errorReport = createErrorReport(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: "ComponentErrorBoundary",
      additionalData: {
        componentName: this.props.componentName,
        isolate: this.props.isolate,
        errorType: this.props.errorType,
        resetKeys: this.props.resetKeys,
        reactErrorInfo: errorInfo,
      },
    });

    // Override error type if specified
    if (this.props.errorType) {
      errorReport.type = this.props.errorType;
    }

    // Update state with error report
    this.setState({
      errorReport,
      errorId: errorReport.id,
      retryCount: this.state.retryCount + 1,
    });

    // Report the error
    reportError(errorReport);

    // Call custom error handler
    this.props.onError?.(error, errorInfo, errorReport);

    // Papildomas konsolės log'as vystymo režime buvo pašalintas pagal lint taisykles
  }

  componentDidUpdate(prevProps: ComponentErrorBoundaryProps) {
    const { resetOnPropsChange, resetKeys } = this.props;

    // Check if we should reset based on prop changes
    if (resetOnPropsChange && this.state.hasError) {
      // Reset if any prop has changed
      const propsChanged = (
        Object.keys(this.props) as Array<keyof ComponentErrorBoundaryProps>
      ).some(key => this.props[key] !== prevProps[key]);

      if (propsChanged) {
        this.resetError();
      }
    }

    // Check if reset keys have changed
    if (resetKeys && this.state.hasError) {
      const resetKeysChanged =
        resetKeys.length !== this.previousResetKeys.length ||
        resetKeys.some((key, index) => key !== this.previousResetKeys[index]);

      if (resetKeysChanged) {
        this.previousResetKeys = [...resetKeys];
        this.resetError();
      }
    }
  }

  componentWillUnmount() {
    // Clear any pending reset timeouts
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  resetError = () => {
    // Clear any pending resets
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
      this.resetTimeoutId = null;
    }

    // Reset error state
    this.setState({
      hasError: false,
      error: null,
      errorReport: null,
      errorId: null,
      retryCount: 0,
    });

    // Call custom reset handler
    this.props.onReset?.();
  };

  retryWithDelay = (delay = 0) => {
    if (delay > 0) {
      this.resetTimeoutId = window.setTimeout(this.resetError, delay);
    } else {
      this.resetError();
    }
  };

  render() {
    if (this.state.hasError && this.state.error && this.state.errorReport) {
      // Use custom fallback component if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error}
            errorReport={this.state.errorReport}
            resetError={this.resetError}
            componentName={this.props.componentName}
          />
        );
      }

      // Use default error fallback
      return (
        <ErrorFallback
          error={this.state.error}
          errorType={this.state.errorReport.type}
          resetError={this.resetError}
          retryCount={this.state.retryCount}
          showRetry={this.props.showRetry !== false}
          showErrorDetails={this.props.showErrorDetails}
          variant="card"
          componentName={this.props.componentName}
          errorBoundaryType="ComponentErrorBoundary"
          className={this.props.className}
        />
      );
    }

    // No error - render children normally
    return this.props.children;
  }
}

// Hook'as perkeltas į atskirą failą `useComponentErrorBoundary.tsx` pagal fast-refresh taisykles

/**
 * Specialized component error boundary for form components
 */
export const FormComponentErrorBoundary = ({
  children,
  ...props
}: Omit<ComponentErrorBoundaryProps, "errorType">) => (
  <ComponentErrorBoundary
    {...props}
    errorType="validation"
    showRetry={true}
    showErrorDetails={false}
  >
    {children}
  </ComponentErrorBoundary>
);

/**
 * Specialized component error boundary for image components
 */
export const ImageComponentErrorBoundary = ({
  children,
  ...props
}: Omit<ComponentErrorBoundaryProps, "errorType">) => (
  <ComponentErrorBoundary {...props} errorType="image" showRetry={true} isolate={true}>
    {children}
  </ComponentErrorBoundary>
);

/**
 * Specialized component error boundary for admin components
 */
export const AdminComponentErrorBoundary = ({
  children,
  ...props
}: Omit<ComponentErrorBoundaryProps, "errorType">) => (
  <ComponentErrorBoundary
    {...props}
    errorType="component"
    showRetry={true}
    showErrorDetails={true}
    isolate={false} // Admin errors might need global attention
  >
    {children}
  </ComponentErrorBoundary>
);

/**
 * Specialized component error boundary for data loading components
 */
export const DataComponentErrorBoundary = ({
  children,
  ...props
}: Omit<ComponentErrorBoundaryProps, "errorType">) => (
  <ComponentErrorBoundary
    {...props}
    errorType="supabase"
    showRetry={true}
    resetOnPropsChange={true}
  >
    {children}
  </ComponentErrorBoundary>
);
