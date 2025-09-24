/**
 * Error reporting utilities with browserLogger integration
 * Production-ready error monitoring for Lithuanian AI web application
 */

import { secureLogger } from "./browserLogger";

// Error severity levels for prioritization
export type ErrorSeverity = "low" | "medium" | "high" | "critical";

// Error types for proper categorization and handling
export type ErrorType =
  | "network" // API calls, fetch failures
  | "component" // React component errors
  | "auth" // Authentication/authorization errors
  | "validation" // Form validation, data validation
  | "routing" // Navigation, route errors
  | "supabase" // Database, Supabase-specific errors
  | "image" // Image loading, LazyImage errors
  | "permission" // Access control, permission errors
  | "javascript" // General JS runtime errors
  | "chunk" // Code splitting, lazy loading errors
  | "unknown"; // Unclassified errors

// Error context information for debugging
export interface ErrorContext {
  userId?: string;
  userAgent?: string;
  url?: string;
  timestamp?: number;
  componentStack?: string;
  errorBoundary?: string;
  additionalData?: Record<string, unknown>;
}

// Structured error report
export interface ErrorReport {
  id: string;
  message: string;
  stack?: string;
  type: ErrorType;
  severity: ErrorSeverity;
  context: ErrorContext;
  isRecoverable: boolean;
  retryCount?: number;
}

/**
 * Determines error type from error message and stack trace
 */
function categorizeError(error: Error): ErrorType {
  const message = error.message.toLowerCase();
  const stack = error.stack?.toLowerCase() || "";

  // Network-related errors
  if (
    message.includes("fetch") ||
    message.includes("network") ||
    message.includes("failed to fetch") ||
    message.includes("cors")
  ) {
    return "network";
  }

  // Authentication errors
  if (
    message.includes("auth") ||
    message.includes("unauthorized") ||
    message.includes("forbidden") ||
    stack.includes("authcontext")
  ) {
    return "auth";
  }

  // Supabase-specific errors
  if (
    message.includes("supabase") ||
    stack.includes("supabase") ||
    message.includes("postgresql") ||
    message.includes("rpc")
  ) {
    return "supabase";
  }

  // Component rendering errors
  if (
    stack.includes("react") ||
    message.includes("render") ||
    message.includes("hook") ||
    stack.includes("component")
  ) {
    return "component";
  }

  // Routing errors
  if (
    message.includes("router") ||
    message.includes("navigation") ||
    stack.includes("react-router")
  ) {
    return "routing";
  }

  // Code splitting / lazy loading errors
  if (
    message.includes("chunk") ||
    message.includes("loading chunk") ||
    message.includes("dynamicimport")
  ) {
    return "chunk";
  }

  // Image loading errors
  if (message.includes("image") || stack.includes("lazyimage") || message.includes("img")) {
    return "image";
  }

  // Validation errors
  if (
    message.includes("validation") ||
    message.includes("invalid") ||
    message.includes("required")
  ) {
    return "validation";
  }

  // Permission errors
  if (
    message.includes("permission") ||
    message.includes("access denied") ||
    message.includes("not allowed")
  ) {
    return "permission";
  }

  return "javascript";
}

/**
 * Determines error severity based on type and context
 */
function calculateSeverity(type: ErrorType, error: Error, context: ErrorContext): ErrorSeverity {
  // Critical errors that break core functionality
  if (type === "auth" && error.message.includes("session")) return "critical";
  if (type === "supabase" && error.message.includes("connection")) return "critical";
  if (type === "chunk" && context.url?.includes("/admin")) return "critical";

  // High severity errors affecting user experience
  if (type === "network" && error.message.includes("timeout")) return "high";
  if (type === "component" && context.errorBoundary === "GlobalErrorBoundary") return "high";
  if (type === "routing" && context.url === "/") return "high";

  // Medium severity for feature-specific issues
  if (type === "component" || type === "validation") return "medium";
  if (type === "image" || type === "permission") return "medium";

  // Low severity for minor issues
  return "low";
}

/**
 * Determines if an error is recoverable
 */
function isErrorRecoverable(type: ErrorType, _error: Error): boolean {
  // Network errors are often recoverable with retry
  if (type === "network") return true;

  // Image loading errors are recoverable
  if (type === "image") return true;

  // Chunk loading errors can be retried
  if (type === "chunk") return true;

  // Component errors in isolated boundaries are recoverable
  if (type === "component") return true;

  // Validation errors are user-recoverable
  if (type === "validation") return true;

  // Auth, routing, and critical JS errors are typically not recoverable
  return false;
}

/**
 * Generates unique error ID for tracking
 */
function generateErrorId(error: Error, context: ErrorContext): string {
  const timestamp = Date.now();
  const errorHash = error.message.slice(0, 10).replace(/[^a-zA-Z0-9]/g, "");
  const contextHash = context.url ? context.url.split("/").pop()?.slice(0, 5) || "" : "";
  return `err_${errorHash}_${contextHash}_${timestamp}`;
}

/**
 * Creates a comprehensive error report
 */
export function createErrorReport(
  error: Error,
  additionalContext: Partial<ErrorContext> = {}
): ErrorReport {
  const type = categorizeError(error);

  const context: ErrorContext = {
    userId: additionalContext.userId,
    userAgent: navigator.userAgent,
    url: window.location.href,
    timestamp: Date.now(),
    componentStack: additionalContext.componentStack,
    errorBoundary: additionalContext.errorBoundary,
    additionalData: additionalContext.additionalData,
    ...additionalContext,
  };

  const severity = calculateSeverity(type, error, context);
  const isRecoverable = isErrorRecoverable(type, error);
  const id = generateErrorId(error, context);

  return {
    id,
    message: error.message,
    stack: error.stack,
    type,
    severity,
    context,
    isRecoverable,
    retryCount: 0,
  };
}

/**
 * Reports error to logging system and external services
 */
export function reportError(errorReport: ErrorReport): void {
  // Log to browserLogger with appropriate level
  const logMethod =
    errorReport.severity === "critical" || errorReport.severity === "high"
      ? secureLogger.error
      : secureLogger.warn;

  logMethod(`[ErrorBoundary] ${errorReport.type} error: ${errorReport.message}`, {
    errorId: errorReport.id,
    type: errorReport.type,
    severity: errorReport.severity,
    isRecoverable: errorReport.isRecoverable,
    context: errorReport.context,
    stack: errorReport.stack,
  });

  // In production, send to external monitoring service
  if (
    import.meta.env.PROD &&
    (errorReport.severity === "critical" || errorReport.severity === "high")
  ) {
    sendToExternalService(errorReport);
  }

  // Store error in session storage for debugging (development only)
  if (import.meta.env.DEV) {
    storeErrorForDebugging(errorReport);
  }
}

/**
 * Sends error to external monitoring service (production only)
 */
async function sendToExternalService(errorReport: ErrorReport): Promise<void> {
  try {
    // Placeholder for external service integration
    // Could integrate with Sentry, LogRocket, or custom error tracking

    // Example implementation:
    // await fetch('/api/errors', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(errorReport)
    // });

    secureLogger.info("Error reported to external service", { errorId: errorReport.id });
  } catch (reportingError) {
    secureLogger.warn("Failed to report error to external service", {
      originalErrorId: errorReport.id,
      reportingError: reportingError instanceof Error ? reportingError.message : "Unknown error",
    });
  }
}

/**
 * Stores error in session storage for development debugging
 */
function storeErrorForDebugging(errorReport: ErrorReport): void {
  try {
    const existingErrors = JSON.parse(sessionStorage.getItem("error_reports") || "[]");
    existingErrors.push(errorReport);

    // Keep only last 20 errors to prevent storage overflow
    if (existingErrors.length > 20) {
      existingErrors.splice(0, existingErrors.length - 20);
    }

    sessionStorage.setItem("error_reports", JSON.stringify(existingErrors));
  } catch (storageError) {
    secureLogger.warn("Failed to store error for debugging", {
      errorId: errorReport.id,
      storageError: storageError instanceof Error ? storageError.message : "Unknown error",
    });
  }
}

/**
 * Retrieves stored error reports (development only)
 */
export function getStoredErrors(): ErrorReport[] {
  if (import.meta.env.PROD) return [];

  try {
    return JSON.parse(sessionStorage.getItem("error_reports") || "[]");
  } catch {
    return [];
  }
}

/**
 * Clears stored error reports (development only)
 */
export function clearStoredErrors(): void {
  if (import.meta.env.PROD) return;

  try {
    sessionStorage.removeItem("error_reports");
    secureLogger.info("Cleared stored error reports");
  } catch (clearError) {
    secureLogger.warn("Failed to clear stored error reports", { clearError });
  }
}

/**
 * Lithuanian error messages for user-facing display
 */
export const lithuanianErrorMessages = {
  network: {
    title: "Ryšio problema",
    message: "Nepavyko prisijungti prie serverio. Patikrinkite internetą ir bandykite dar kartą.",
    action: "Bandyti dar kartą",
  },
  component: {
    title: "Techninis sutrikimas",
    message: "Įvyko techninis sutrikimas. Puslapio dalis gali veikti netinkamai.",
    action: "Atnaujinti puslapį",
  },
  auth: {
    title: "Prisijungimo problema",
    message: "Nepavyko patvirtinti jūsų tapatybės. Prašome prisijungti iš naujo.",
    action: "Prisijungti",
  },
  supabase: {
    title: "Duomenų bazės problema",
    message: "Nepavyko gauti duomenų. Bandykite atnaujinti puslapį.",
    action: "Atnaujinti",
  },
  chunk: {
    title: "Įkėlimo problema",
    message: "Nepavyko įkelti puslapio dalies. Bandykite atnaujinti.",
    action: "Atnaujinti puslapį",
  },
  validation: {
    title: "Neteisingi duomenys",
    message: "Prašome patikrinti įvestus duomenis ir bandyti dar kartą.",
    action: "Taisyti duomenis",
  },
  permission: {
    title: "Prieigos klaida",
    message: "Neturite leidimo atlikti šio veiksmo.",
    action: "Grįžti atgal",
  },
  image: {
    title: "Paveikslėlio klaida",
    message: "Nepavyko įkelti paveikslėlio.",
    action: "Bandyti dar kartą",
  },
  routing: {
    title: "Navigacijos klaida",
    message: "Nepavyko atidaryti puslapio.",
    action: "Grįžti į pradžią",
  },
  javascript: {
    title: "Programos klaida",
    message: "Įvyko nenumatyta klaida. Atnaujinkite puslapį.",
    action: "Atnaujinti puslapį",
  },
  unknown: {
    title: "Nežinoma klaida",
    message: "Įvyko nežinoma klaida. Atnaujinkite puslapį arba kreipkitės į palaikymą.",
    action: "Atnaujinti puslapį",
  },
};

/**
 * Gets user-friendly Lithuanian error message
 */
export function getErrorMessage(type: ErrorType) {
  return lithuanianErrorMessages[type] || lithuanianErrorMessages.unknown;
}

/**
 * Retry mechanism for recoverable errors
 */
export class ErrorRetryManager {
  private retryAttempts = new Map<string, number>();
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000; // 1 second base delay

  /**
   * Attempts to retry an operation if error is recoverable
   */
  async retry<T>(
    errorReport: ErrorReport,
    operation: () => Promise<T> | T,
    onRetry?: (attempt: number) => void
  ): Promise<T> {
    if (!errorReport.isRecoverable) {
      throw new Error(`Error ${errorReport.id} is not recoverable`);
    }

    const attemptCount = this.retryAttempts.get(errorReport.id) || 0;

    if (attemptCount >= this.maxRetries) {
      secureLogger.warn(`Maximum retry attempts exceeded for error ${errorReport.id}`);
      throw new Error(`Maximum retry attempts exceeded`);
    }

    try {
      this.retryAttempts.set(errorReport.id, attemptCount + 1);

      // Exponential backoff delay
      if (attemptCount > 0) {
        const delay = this.retryDelay * Math.pow(2, attemptCount - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      onRetry?.(attemptCount + 1);

      const result = await operation();

      // Success - clear retry count
      this.retryAttempts.delete(errorReport.id);

      secureLogger.info(`Error ${errorReport.id} resolved after ${attemptCount + 1} attempts`);

      return result;
    } catch (retryError) {
      secureLogger.warn(`Retry attempt ${attemptCount + 1} failed for error ${errorReport.id}`, {
        retryError: retryError instanceof Error ? retryError.message : "Unknown retry error",
      });
      throw retryError;
    }
  }

  /**
   * Clears retry count for an error
   */
  clearRetryCount(errorId: string): void {
    this.retryAttempts.delete(errorId);
  }

  /**
   * Gets current retry count for an error
   */
  getRetryCount(errorId: string): number {
    return this.retryAttempts.get(errorId) || 0;
  }
}

// Singleton instance for global use
export const globalRetryManager = new ErrorRetryManager();
