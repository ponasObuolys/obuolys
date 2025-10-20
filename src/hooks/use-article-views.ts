import { useEffect, useState } from "react";
import { analyticsService } from "@/services/analytics.service";

interface UseArticleViewsOptions {
  articleId: string;
  enabled?: boolean;
}

/**
 * Hook to fetch article view count with display multiplier
 */
export function useArticleViews({ articleId, enabled = true }: UseArticleViewsOptions) {
  const [viewCount, setViewCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!enabled || !articleId) {
      setLoading(false);
      return;
    }

    const fetchViews = async () => {
      try {
        const result = await analyticsService.getArticleDisplayCount(articleId);
        if (result) {
          setViewCount(result.displayCount);
        }
      } catch {
        // Silently fail - not critical for UI
        setViewCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchViews();
  }, [articleId, enabled]);

  return { viewCount, loading };
}
