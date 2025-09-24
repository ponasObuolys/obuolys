/**
 * Error boundary system exports
 * Comprehensive error handling for React application
 */

// Main error boundary components
export {
  AdminComponentErrorBoundary,
  ComponentErrorBoundary,
  DataComponentErrorBoundary,
  FormComponentErrorBoundary,
  ImageComponentErrorBoundary,
} from "./ComponentErrorBoundary";
export { GlobalErrorBoundary } from "./GlobalErrorBoundary";
export {
  AdminRouteErrorBoundary,
  AuthRouteErrorBoundary,
  ContentRouteErrorBoundary,
  RouteErrorBoundary,
} from "./RouteErrorBoundary";

// Fallback UI components
export {
  AuthErrorFallback,
  ChunkErrorFallback,
  ErrorFallback,
  ImageErrorFallback,
  NetworkErrorFallback,
} from "./ErrorFallback";

// HOCs and utility functions
export { useGlobalErrorBoundary } from "./GlobalErrorBoundary";
export { useComponentErrorBoundary } from "./useComponentErrorBoundary";
export { withRouteErrorBoundary } from "./withRouteErrorBoundary";

// Type exports
export type {
  GlobalErrorBoundaryFallbackProps,
  GlobalErrorBoundaryProps,
} from "./GlobalErrorBoundary";

export type {
  RouteErrorBoundaryFallbackProps,
  RouteErrorBoundaryProps,
} from "./RouteErrorBoundary";

export type {
  ComponentErrorBoundaryFallbackProps,
  ComponentErrorBoundaryProps,
} from "./ComponentErrorBoundary";

export type { UseComponentErrorBoundaryProps } from "./useComponentErrorBoundary";

export type { ErrorFallbackProps } from "./ErrorFallback";

// Re-export error handling utilities
export {
  clearStoredErrors,
  createErrorReport,
  ErrorRetryManager,
  getErrorMessage,
  getStoredErrors,
  globalRetryManager,
  lithuanianErrorMessages,
  reportError,
} from "@/utils/errorReporting";

export type { ErrorContext, ErrorReport, ErrorSeverity, ErrorType } from "@/utils/errorReporting";

// Re-export error handling hooks
export {
  useAuthErrorHandler,
  useErrorHandler,
  useNetworkErrorHandler,
  useSupabaseErrorHandler,
  useValidationErrorHandler,
} from "@/hooks/useErrorHandler";

export type { ErrorHandlerResult, UseErrorHandlerOptions } from "@/hooks/useErrorHandler";
