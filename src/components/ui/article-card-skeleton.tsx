import { Skeleton } from "./skeleton";

export const ArticleCardSkeleton = () => {
  return (
    <div className="project-card h-full">
      {/* Header with icon and title */}
      <div className="flex items-start gap-3 mb-3">
        <Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" />
        <div className="flex-1 min-w-0 space-y-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      {/* Image */}
      <Skeleton className="w-full h-48 rounded-lg mb-3" />

      {/* Description */}
      <div className="space-y-2 mb-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* Footer with metadata */}
      <div className="flex items-center gap-4 text-sm text-foreground/60">
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  );
};
