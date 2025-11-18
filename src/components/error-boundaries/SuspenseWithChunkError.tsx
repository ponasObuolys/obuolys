import { Suspense } from "react";
import { RouteErrorBoundary, ChunkErrorFallback } from "@/components/error-boundaries";
import type { RouteErrorBoundaryFallbackProps } from "@/components/error-boundaries";

// Fallback component for chunk errors
const ChunkBoundaryFallback = ({ error, resetError }: RouteErrorBoundaryFallbackProps) => (
  <ChunkErrorFallback error={error} resetError={resetError} variant="page" />
);

// Enhanced Suspense wrapper with chunk error handling
export const SuspenseWithChunkError = ({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback: React.ReactNode;
}) => (
  <Suspense fallback={fallback}>
    <RouteErrorBoundary
      fallback={ChunkBoundaryFallback}
      enableAutoRecovery={false} // Chunk errors typically require page reload
    >
      {children}
    </RouteErrorBoundary>
  </Suspense>
);
