import { Skeleton } from "./skeleton";

export const ToolCardSkeleton = () => {
  return (
    <div className="project-card h-full flex flex-col">
      {/* Header with icon and title */}
      <div className="flex items-start gap-3 mb-4">
        <Skeleton className="w-12 h-12 rounded-lg flex-shrink-0" />
        <div className="flex-1 min-w-0 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      {/* Image */}
      <Skeleton className="w-full h-48 rounded-lg mb-4" />

      {/* Description */}
      <div className="space-y-2 mb-4 flex-1">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      {/* Footer with stats and buttons */}
      <div className="mt-auto space-y-3">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 flex-1 rounded-md" />
          <Skeleton className="h-10 flex-1 rounded-md" />
        </div>
      </div>
    </div>
  );
};
