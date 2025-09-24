/**
 * Error handling hook with recovery mechanisms and Lithuanian translations
 * Provides consistent error handling across the application
 */

import { useToast } from "@/components/ui/use-toast";
import type { ErrorReport, ErrorType } from "@/utils/errorReporting";
import {
  createErrorReport,
  getErrorMessage,
  globalRetryManager,
  reportError,
} from "@/utils/errorReporting";
import { useCallback, useRef, useState } from "react";

export interface UseErrorHandlerOptions {
  // Default error type for auto-categorization
  defaultErrorType?: ErrorType;
  // Whether to show toast notifications
  showToast?: boolean;
  // Whether to enable retry for recoverable errors
  enableRetry?: boolean;
  // Custom error handler callback
  onError?: (errorReport: ErrorReport) => void;
  // Component context for better error tracking
  componentName?: string;
  // Additional context data
  additionalContext?: Record<string, unknown>;
}

export interface ErrorHandlerResult {
  // Main error handling function
  handleError: (error: Error, customType?: ErrorType) => ErrorReport;
  // Async error handling with automatic retry support
  handleAsyncError: <T>(
    operation: () => Promise<T>,
    customType?: ErrorType,
    onRetry?: (attempt: number) => void
  ) => Promise<T>;
  // Current error state
  currentError: ErrorReport | null;
  // Whether an error is currently being handled
  isHandlingError: boolean;
  // Whether a retry operation is in progress
  isRetrying: boolean;
  // Retry count for current error
  retryCount: number;
  // Clear current error state
  clearError: () => void;
  // Manual retry function
  retry: <T>(operation: () => Promise<T> | T) => Promise<T>;
}

/**
 * Hook for consistent error handling across components
 */
export function useErrorHandler(options: UseErrorHandlerOptions = {}): ErrorHandlerResult {
  const {
    defaultErrorType = "component",
    showToast = true,
    enableRetry = true,
    onError,
    componentName,
    additionalContext = {},
  } = options;

  const { toast } = useToast();
  const [currentError, setCurrentError] = useState<ErrorReport | null>(null);
  const [isHandlingError, setIsHandlingError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Store current operation for retry purposes
  const currentOperationRef = useRef<(() => Promise<unknown> | unknown) | null>(null);

  // Stabilizuojame papildomą kontekstą, kad išvengtume begalinės useEffect priklausomybių kilpos
  const stableAdditionalContextRef = useRef<Record<string, unknown>>(additionalContext);

  /**
   * Handles synchronous errors
   */
  const handleError = useCallback(
    (error: Error, customType?: ErrorType): ErrorReport => {
      setIsHandlingError(true);

      const errorReport = createErrorReport(error, {
        errorBoundary: componentName,
        additionalData: {
          component: componentName,
          ...stableAdditionalContextRef.current,
        },
      });

      // Override error type if provided
      if (customType) {
        errorReport.type = customType;
      } else if (defaultErrorType) {
        errorReport.type = defaultErrorType;
      }

      // Report the error
      reportError(errorReport);

      // Store current error state
      setCurrentError(errorReport);
      setRetryCount(globalRetryManager.getRetryCount(errorReport.id));

      // Show toast notification if enabled
      if (showToast) {
        const errorMessage = getErrorMessage(errorReport.type);
        toast({
          variant: "destructive",
          title: errorMessage.title,
          description: errorMessage.message,
        });
      }

      // Call custom error handler if provided
      onError?.(errorReport);

      setIsHandlingError(false);

      return errorReport;
    },
    [defaultErrorType, showToast, onError, componentName, toast]
  );

  /**
   * Handles asynchronous operations with automatic retry support
   */
  const handleAsyncError = useCallback(
    async <T>(
      operation: () => Promise<T>,
      customType?: ErrorType,
      onRetry?: (attempt: number) => void
    ): Promise<T> => {
      currentOperationRef.current = operation;
      setIsHandlingError(true);

      try {
        const result = await operation();

        // Clear error state on success
        if (currentError) {
          setCurrentError(null);
          setRetryCount(0);
          globalRetryManager.clearRetryCount(currentError.id);
        }

        setIsHandlingError(false);
        return result;
      } catch (error) {
        const errorReport = handleError(error as Error, customType);

        // Attempt retry if error is recoverable and retry is enabled
        if (enableRetry && errorReport.isRecoverable) {
          try {
            setIsRetrying(true);

            const result = await globalRetryManager.retry(errorReport, operation, attempt => {
              setRetryCount(attempt);
              onRetry?.(attempt);

              // Show retry toast
              if (showToast) {
                toast({
                  title: "Bandoma dar kartą",
                  description: `Bandymas ${attempt} iš 3`,
                });
              }
            });

            // Success after retry
            setCurrentError(null);
            setRetryCount(0);
            setIsRetrying(false);
            setIsHandlingError(false);

            if (showToast) {
              toast({
                title: "Pavyko!",
                description: "Operacija sėkmingai atlikta po pakartojimo.",
              });
            }

            return result;
          } catch (retryError) {
            // All retries failed
            setIsRetrying(false);
            setIsHandlingError(false);

            const finalErrorMessage = getErrorMessage(errorReport.type);

            if (showToast) {
              toast({
                variant: "destructive",
                title: "Operacija nepavyko",
                description: "Bandymai nepavyko. " + finalErrorMessage.message,
              });
            }

            throw retryError;
          }
        } else {
          setIsHandlingError(false);
          throw errorReport;
        }
      }
    },
    [handleError, enableRetry, currentError, showToast, toast]
  );

  /**
   * Clears current error state
   */
  const clearError = useCallback(() => {
    if (currentError) {
      globalRetryManager.clearRetryCount(currentError.id);
    }

    setCurrentError(null);
    setRetryCount(0);
    setIsRetrying(false);
    setIsHandlingError(false);
    currentOperationRef.current = null;
  }, [currentError]);

  /**
   * Manual retry function
   */
  const retry = useCallback(
    async <T>(operation?: () => Promise<T> | T): Promise<T> => {
      const operationToRetry = (operation || currentOperationRef.current) as
        | (() => Promise<T> | T)
        | null;

      if (!operationToRetry) {
        throw new Error("No operation to retry");
      }

      if (!currentError) {
        throw new Error("No current error to retry");
      }

      if (!currentError.isRecoverable) {
        throw new Error("Current error is not recoverable");
      }

      setIsRetrying(true);

      try {
        const result = await globalRetryManager.retry(currentError, operationToRetry, attempt => {
          setRetryCount(attempt);

          if (showToast) {
            toast({
              title: "Bandoma dar kartą",
              description: `Bandymas ${attempt} iš 3`,
            });
          }
        });

        // Success
        setCurrentError(null);
        setRetryCount(0);
        setIsRetrying(false);
        currentOperationRef.current = null;

        if (showToast) {
          toast({
            title: "Pavyko!",
            description: "Operacija sėkmingai atlikta po pakartojimo.",
          });
        }

        return result;
      } catch (retryError) {
        setIsRetrying(false);

        const errorMessage = getErrorMessage(currentError.type);

        if (showToast) {
          toast({
            variant: "destructive",
            title: "Bandymai nepavyko",
            description: errorMessage.message,
          });
        }

        throw retryError;
      }
    },
    [currentError, showToast, toast]
  );

  return {
    handleError,
    handleAsyncError,
    currentError,
    isHandlingError,
    isRetrying,
    retryCount,
    clearError,
    retry,
  };
}

/**
 * Hook specifically for network operation errors
 */
export function useNetworkErrorHandler(
  options: Omit<UseErrorHandlerOptions, "defaultErrorType"> = {}
) {
  return useErrorHandler({
    ...options,
    defaultErrorType: "network",
  });
}

/**
 * Hook specifically for authentication errors
 */
export function useAuthErrorHandler(
  options: Omit<UseErrorHandlerOptions, "defaultErrorType"> = {}
) {
  return useErrorHandler({
    ...options,
    defaultErrorType: "auth",
  });
}

/**
 * Hook specifically for Supabase database errors
 */
export function useSupabaseErrorHandler(
  options: Omit<UseErrorHandlerOptions, "defaultErrorType"> = {}
) {
  return useErrorHandler({
    ...options,
    defaultErrorType: "supabase",
  });
}

/**
 * Hook for handling form validation errors
 */
export function useValidationErrorHandler(
  options: Omit<UseErrorHandlerOptions, "defaultErrorType"> = {}
) {
  return useErrorHandler({
    ...options,
    defaultErrorType: "validation",
    enableRetry: false, // Validation errors typically don't benefit from retry
    showToast: false, // Validation errors usually show inline
  });
}
