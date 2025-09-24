import type { ErrorReport, ErrorType } from "@/utils/errorReporting";
import React from "react";
import type { ComponentErrorBoundaryFallbackProps } from "./ComponentErrorBoundary";
import { ComponentErrorBoundary } from "./ComponentErrorBoundary";

export interface UseComponentErrorBoundaryProps {
  errorType?: ErrorType;
  componentName?: string;
  onError?: (error: Error, errorReport: ErrorReport) => void;
  fallbackComponent?: React.ComponentType<ComponentErrorBoundaryFallbackProps>;
}

// Hook for wrapping components with error boundaries
export function useComponentErrorBoundary({
  errorType = "component",
  componentName,
  onError,
  fallbackComponent,
}: UseComponentErrorBoundaryProps = {}) {
  return function withErrorBoundary<P extends object>(
    WrappedComponent: React.ComponentType<P>
  ): React.ComponentType<P> {
    const ComponentWithErrorBoundary = (props: P) => (
      <ComponentErrorBoundary
        errorType={errorType}
        componentName={componentName || WrappedComponent.displayName || WrappedComponent.name}
        onError={(error, _errorInfo, errorReport) => onError?.(error, errorReport)}
        fallback={fallbackComponent}
      >
        <WrappedComponent {...props} />
      </ComponentErrorBoundary>
    );

    ComponentWithErrorBoundary.displayName = `withErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name})`;

    return ComponentWithErrorBoundary;
  };
}
