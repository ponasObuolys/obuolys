/**
 * Centralized error handling utilities for type-safe error management
 */

import { useToast } from "@/hooks/use-toast";

// Base error interface for application errors
export interface AppError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
  originalError?: unknown;
}

// Specific error types for different domains
export interface ApiError extends AppError {
  status?: number;
  endpoint?: string;
}

export interface ValidationError extends AppError {
  field?: string;
  value?: unknown;
}

export interface AuthError extends AppError {
  type: "authentication" | "authorization" | "session";
}

export interface FileUploadError extends AppError {
  fileName?: string;
  fileSize?: number;
  maxSize?: number;
}

// Error handler function type
export type ErrorHandler<T = AppError, Args extends unknown[] = []> = (
  error: unknown,
  ...args: Args
) => T;

/**
 * Generic error handler that converts unknown errors to AppError
 */
export const handleError: ErrorHandler = (error: unknown): AppError => {
  // Handle Error instances
  if (error instanceof Error) {
    return {
      message: error.message,
      originalError: error,
    };
  }

  // Handle string errors
  if (typeof error === "string") {
    return {
      message: error,
      originalError: error,
    };
  }

  // Handle objects with message property
  if (error && typeof error === "object" && "message" in error) {
    return {
      message: String(error.message),
      originalError: error,
    };
  }

  // Fallback for unknown error types
  return {
    message: "Įvyko nežinoma klaida",
    originalError: error,
  };
};

/**
 * API-specific error handler
 */
export const handleApiError: ErrorHandler<ApiError> = (error: unknown): ApiError => {
  const baseError = handleError(error);

  // Handle Supabase errors
  if (error && typeof error === "object" && "code" in error) {
    return {
      ...baseError,
      code: String(error.code),
      status: "status" in error ? Number(error.status) : undefined,
    };
  }

  // Handle fetch errors
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return {
      ...baseError,
      message: "Nepavyko prisijungti prie serverio",
      code: "NETWORK_ERROR",
    };
  }

  return baseError;
};

/**
 * Authentication error handler
 */
export const handleAuthError: ErrorHandler<AuthError> = (error: unknown): AuthError => {
  const baseError = handleError(error);

  // Determine auth error type based on error content
  let type: AuthError["type"] = "authentication";

  if (baseError.message.includes("unauthorized") || baseError.message.includes("permission")) {
    type = "authorization";
  } else if (baseError.message.includes("session") || baseError.message.includes("token")) {
    type = "session";
  }

  return {
    ...baseError,
    type,
  };
};

/**
 * File upload error handler
 */
export const handleFileUploadError: ErrorHandler<FileUploadError, [string?, number?]> = (
  error: unknown,
  fileName?: string,
  fileSize?: number
): FileUploadError => {
  const baseError = handleError(error);

  return {
    ...baseError,
    fileName,
    fileSize,
    // Common file upload size limit (5MB)
    maxSize: 5 * 1024 * 1024,
  };
};

/**
 * Form validation error handler
 */
export const handleValidationError: ErrorHandler<ValidationError, [string?, unknown?]> = (
  error: unknown,
  field?: string,
  value?: unknown
): ValidationError => {
  const baseError = handleError(error);

  return {
    ...baseError,
    field,
    value,
  };
};

// Pre-defined error messages in Lithuanian
export const ERROR_MESSAGES = {
  // Authentication errors
  AUTH_FAILED: "Neteisingas el. paštas arba slaptažodis",
  AUTH_REQUIRED: "Reikia prisijungti prie sistemos",
  AUTH_EXPIRED: "Jūsų sesija baigėsi. Prašome prisijungti iš naujo",
  AUTH_PERMISSION: "Neturite leidimo atlikti šį veiksmą",

  // API errors
  NETWORK_ERROR: "Nepavyko prisijungti prie serverio",
  SERVER_ERROR: "Serverio klaida. Bandykite dar kartą vėliau",
  NOT_FOUND: "Ieškomas objektas nerastas",

  // File upload errors
  FILE_TOO_LARGE: "Failas per didelis. Maksimalus dydis: 5MB",
  FILE_INVALID_TYPE: "Netinkamas failo tipas",
  UPLOAD_FAILED: "Nepavyko įkelti failo",

  // Form validation errors
  REQUIRED_FIELD: "Šis laukas yra privalomas",
  INVALID_EMAIL: "Neteisingas el. pašto formatas",
  PASSWORD_TOO_SHORT: "Slaptažodis per trumpas",

  // Generic errors
  UNKNOWN_ERROR: "Įvyko nežinoma klaida",
  OPERATION_FAILED: "Nepavyko atlikti veiksmo",
} as const;

/**
 * Hook for handling errors with toast notifications
 */
export const useErrorHandler = () => {
  const { toast } = useToast();

  const showError = (error: AppError, title = "Klaida") => {
    toast({
      title,
      description: error.message,
      variant: "destructive",
    });
  };

  const handleAndShowError = (error: unknown, title = "Klaida") => {
    const appError = handleError(error);
    showError(appError, title);
    return appError;
  };

  const handleApiErrorWithToast = (error: unknown, title = "API klaida") => {
    const apiError = handleApiError(error);
    showError(apiError, title);
    return apiError;
  };

  const handleAuthErrorWithToast = (error: unknown, title = "Autentifikacijos klaida") => {
    const authError = handleAuthError(error);
    showError(authError, title);
    return authError;
  };

  const handleFileUploadErrorWithToast = (
    error: unknown,
    fileName?: string,
    fileSize?: number,
    title = "Įkėlimo klaida"
  ) => {
    const uploadError = handleFileUploadError(error, fileName, fileSize);
    showError(uploadError, title);
    return uploadError;
  };

  return {
    showError,
    handleAndShowError,
    handleApiErrorWithToast,
    handleAuthErrorWithToast,
    handleFileUploadErrorWithToast,
  };
};

/**
 * Utility function to create typed async handlers
 */
export const createAsyncHandler = <Args extends unknown[], Result>(
  handler: (...args: Args) => Promise<Result>,
  errorHandler: (error: unknown) => unknown = handleError
) => {
  return async (...args: Args): Promise<Result | undefined> => {
    try {
      return await handler(...args);
    } catch (error) {
      errorHandler(error);
      return undefined;
    }
  };
};

/**
 * Error boundary helper for React components
 */
export class ErrorBoundaryError extends Error {
  public readonly componentStack?: string;
  public readonly errorBoundary?: string;

  constructor(
    message: string,
    public readonly originalError: Error,
    componentStack?: string
  ) {
    super(message);
    this.name = "ErrorBoundaryError";
    this.componentStack = componentStack;
  }
}
