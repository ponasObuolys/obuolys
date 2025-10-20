import { useEffect, useState } from "react";
import { Eye, TrendingUp } from "lucide-react";
import { useLiveReaders } from "@/hooks/use-live-readers";
import { analyticsService } from "@/services/analytics.service";
import { cn } from "@/lib/utils";

interface ReaderStatsProps {
  articleId: string;
  className?: string;
  variant?: "default" | "compact";
}

export function ReaderStats({ 
  articleId, 
  className,
  variant = "default" 
}: ReaderStatsProps) {
  const { count: liveReaders, loading: liveLoading } = useLiveReaders({ 
    articleId,
    enabled: true 
  });
  
  const [viewCount, setViewCount] = useState<number>(0);
  const [statsLoading, setStatsLoading] = useState(true);
  const [multiplier, setMultiplier] = useState<number>(1);

  useEffect(() => {
    const fetchViewCount = async () => {
      const stats = await analyticsService.getArticleDisplayCount(articleId);
      if (stats) {
        setViewCount(stats.displayCount);
        // Calculate multiplier from actual and display counts
        if (stats.actualCount > 0) {
          setMultiplier(stats.displayCount / stats.actualCount);
        }
      }
      setStatsLoading(false);
    };

    fetchViewCount();
  }, [articleId]);

  // Apply the same multiplier to live readers
  // Show actual count if only 1 reader, otherwise apply multiplier
  const displayLiveReaders = liveReaders === 0 
    ? 0 
    : liveReaders === 1 
      ? 1 
      : Math.round(liveReaders * multiplier);

  if (variant === "compact") {
    return (
      <div className={cn(
        "flex items-center gap-4 text-sm text-muted-foreground",
        className
      )}>
        {/* Live readers count */}
        <div className="flex items-center gap-1.5">
          <Eye className="h-4 w-4 text-green-500" />
          <span className="font-medium">
            {liveLoading ? "..." : displayLiveReaders}
          </span>
          <span className="hidden sm:inline">
            {displayLiveReaders === 1 ? "skaito dabar" : "skaito dabar"}
          </span>
        </div>

        {/* Total views */}
        {!statsLoading && viewCount > 0 && (
          <div className="flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            <span className="font-medium">
              {viewCount.toLocaleString("lt-LT")}
            </span>
            <span className="hidden sm:inline">
              peržiūrų
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn(
      "grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-card rounded-lg border",
      className
    )}>
      {/* Live readers card */}
      <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-md border border-green-500/20">
        <div className="flex-shrink-0">
          <div className="relative">
            <Eye className="h-6 w-6 text-green-500" />
            {!liveLoading && displayLiveReaders > 0 && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            )}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-muted-foreground">
            Skaito dabar
          </p>
          <p className="text-2xl font-bold text-foreground">
            {liveLoading ? (
              <span className="animate-pulse">...</span>
            ) : (
              displayLiveReaders
            )}
          </p>
        </div>
      </div>

      {/* Total views card */}
      <div className="flex items-center gap-3 p-3 bg-blue-500/10 rounded-md border border-blue-500/20">
        <div className="flex-shrink-0">
          <TrendingUp className="h-6 w-6 text-blue-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-muted-foreground">
            {statsLoading ? "Kraunama..." : "Viso peržiūrų"}
          </p>
          <p className="text-2xl font-bold text-foreground">
            {statsLoading ? (
              <span className="animate-pulse">...</span>
            ) : (
              viewCount.toLocaleString("lt-LT")
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
