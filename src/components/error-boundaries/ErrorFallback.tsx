/**
 * Generic error fallback UI component with recovery options
 * Provides user-friendly Lithuanian error messages with appropriate actions
 */

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getErrorMessage, type ErrorType } from "@/utils/errorReporting";
import { AlertCircle, ArrowLeft, Home, RefreshCw } from "lucide-react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export interface ErrorFallbackProps {
  // Error information
  error?: Error;
  errorType?: ErrorType;
  errorMessage?: string;
  // Recovery options
  resetError?: () => void;
  retry?: () => void;
  isRetrying?: boolean;
  retryCount?: number;
  // Display options
  variant?: "minimal" | "card" | "page";
  showRetry?: boolean;
  showNavigation?: boolean;
  showErrorDetails?: boolean;
  // Custom styling
  className?: string;
  // Context information
  componentName?: string;
  errorBoundaryType?: string;
  // Papildomas turinys pateikiamas per children
  children?: ReactNode;
}

/**
 * Main error fallback component with recovery mechanisms
 */
export const ErrorFallback = ({
  error,
  errorType = "unknown",
  errorMessage,
  resetError,
  retry,
  isRetrying = false,
  retryCount = 0,
  variant = "card",
  showRetry = true,
  showNavigation = true,
  showErrorDetails = false,
  className,
  componentName,
  errorBoundaryType,
  children,
}: ErrorFallbackProps): JSX.Element => {
  const navigate = useNavigate();
  const lithuanianMessage = getErrorMessage(errorType);

  // Use custom message or Lithuanian translation
  const displayMessage = errorMessage || lithuanianMessage.message;
  const displayTitle = lithuanianMessage.title;
  const actionText = lithuanianMessage.action;

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const canRetry = showRetry && (retry || resetError);
  const showDetails = showErrorDetails && import.meta.env.DEV;

  // Minimal variant for inline errors
  if (variant === "minimal") {
    return (
      <Alert variant="destructive" className={cn("my-2", className)}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{displayTitle}</AlertTitle>
        <AlertDescription className="mt-2">
          <p>{displayMessage}</p>
          {canRetry && (
            <div className="flex gap-2 mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={retry || resetError}
                disabled={isRetrying}
              >
                {isRetrying && <RefreshCw className="h-3 w-3 mr-1 animate-spin" />}
                {actionText}
              </Button>
            </div>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  // Page variant for full-page errors
  if (variant === "page") {
    return (
      <div className={cn("min-h-screen flex items-center justify-center p-4", className)}>
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-xl">{displayTitle}</CardTitle>
            <CardDescription className="text-base">{displayMessage}</CardDescription>
          </CardHeader>

          <CardContent>
            {retryCount > 0 && (
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Bandymai: {retryCount} iš 3</AlertDescription>
              </Alert>
            )}

            {showDetails && error && (
              <details className="mb-4">
                <summary className="cursor-pointer text-sm text-muted-foreground mb-2">
                  Techninė informacija
                </summary>
                <div className="bg-muted p-3 rounded-md text-xs font-mono">
                  <p>
                    <strong>Komponentas:</strong> {componentName || "Nežinomas"}
                  </p>
                  <p>
                    <strong>Klaidos tipas:</strong> {errorType}
                  </p>
                  <p>
                    <strong>Error Boundary:</strong> {errorBoundaryType || "Nežinomas"}
                  </p>
                  <p>
                    <strong>Pranešimas:</strong> {error.message}
                  </p>
                  {error.stack && (
                    <div className="mt-2">
                      <strong>Stack trace:</strong>
                      <pre className="whitespace-pre-wrap mt-1 text-xs">{error.stack}</pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            {children}
          </CardContent>

          <CardFooter className="flex flex-col gap-2">
            {canRetry && (
              <Button className="w-full" onClick={retry || resetError} disabled={isRetrying}>
                {isRetrying && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
                {actionText}
              </Button>
            )}

            {showNavigation && (
              <div className="flex gap-2 w-full">
                <Button variant="outline" onClick={handleGoBack} className="flex-1">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Grįžti
                </Button>

                <Button variant="outline" onClick={handleGoHome} className="flex-1">
                  <Home className="h-4 w-4 mr-2" />
                  Pradžia
                </Button>

                <Button variant="outline" onClick={handleRefresh} className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Atnaujinti
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Card variant (default) for component-level errors
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
          <div>
            <CardTitle className="text-lg">{displayTitle}</CardTitle>
            <CardDescription>{displayMessage}</CardDescription>
          </div>
        </div>
      </CardHeader>

      {(retryCount > 0 || showDetails) && (
        <CardContent>
          {retryCount > 0 && (
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Bandymai: {retryCount} iš 3</AlertDescription>
            </Alert>
          )}

          {showDetails && error && (
            <details>
              <summary className="cursor-pointer text-sm text-muted-foreground mb-2">
                Techninė informacija
              </summary>
              <div className="bg-muted p-3 rounded-md text-xs font-mono">
                <p>
                  <strong>Komponentas:</strong> {componentName || "Nežinomas"}
                </p>
                <p>
                  <strong>Klaidos tipas:</strong> {errorType}
                </p>
                <p>
                  <strong>Error Boundary:</strong> {errorBoundaryType || "Nežinomas"}
                </p>
                <p>
                  <strong>Pranešimas:</strong> {error.message}
                </p>
              </div>
            </details>
          )}

          {children}
        </CardContent>
      )}

      <CardFooter className="flex gap-2">
        {canRetry && (
          <Button onClick={retry || resetError} disabled={isRetrying} size="sm">
            {isRetrying && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
            {actionText}
          </Button>
        )}

        {showNavigation && (
          <>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Atnaujinti
            </Button>

            <Button variant="outline" size="sm" onClick={handleGoHome}>
              <Home className="h-4 w-4 mr-2" />
              Pradžia
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

/**
 * Specialized fallback for network errors
 */
export const NetworkErrorFallback = (props: Omit<ErrorFallbackProps, "errorType">): JSX.Element => {
  return <ErrorFallback {...props} errorType="network" />;
};

/**
 * Specialized fallback for authentication errors
 */
export const AuthErrorFallback = (
  props: Omit<ErrorFallbackProps, "errorType" | "showNavigation">
): JSX.Element => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate("/auth");
  };

  return (
    <ErrorFallback {...props} errorType="auth" showNavigation={false}>
      <div className="flex gap-2 mt-4">
        <Button onClick={handleLoginRedirect}>Prisijungti</Button>
        <Button variant="outline" onClick={() => navigate("/")}>
          <Home className="h-4 w-4 mr-2" />
          Pradžia
        </Button>
      </div>
    </ErrorFallback>
  );
};

/**
 * Specialized fallback for chunk loading errors
 */
export const ChunkErrorFallback = (props: Omit<ErrorFallbackProps, "errorType">): JSX.Element => {
  return (
    <ErrorFallback
      {...props}
      errorType="chunk"
      retry={() => window.location.reload()}
      showRetry={true}
    />
  );
};

/**
 * Specialized fallback for image loading errors
 */
export const ImageErrorFallback = ({
  className,
  alt = "Paveikslėlis",
}: Omit<ErrorFallbackProps, "errorType" | "variant"> & {
  alt?: string;
}): JSX.Element => {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-muted rounded-md p-4 text-muted-foreground",
        className
      )}
    >
      <div className="text-center">
        <AlertCircle className="h-8 w-8 mx-auto mb-2" />
        <p className="text-sm">Nepavyko įkelti paveikslėlio</p>
        <p className="text-xs">{alt}</p>
      </div>
    </div>
  );
};
