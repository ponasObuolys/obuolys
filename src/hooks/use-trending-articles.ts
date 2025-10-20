import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { secureLogger } from "@/utils/browserLogger";

export interface TrendingArticle {
  id: string;
  title: string;
  slug: string;
  views: number;
  image_url: string | null;
  category: string[];
  description: string;
}

interface UseTrendingArticlesOptions {
  days?: number;
  limit?: number;
  enabled?: boolean;
}

/**
 * Hook to fetch trending articles based on recent views
 */
export function useTrendingArticles({
  days = 7,
  limit = 5,
  enabled = true,
}: UseTrendingArticlesOptions = {}) {
  return useQuery({
    queryKey: ["trending-articles", days, limit],
    queryFn: async () => {
      const sinceDate = new Date();
      sinceDate.setDate(sinceDate.getDate() - days);

      const { data, error } = await supabase.rpc("get_trending_articles", {
        since_date: sinceDate.toISOString(),
        limit_count: limit,
      });

      if (error) {
        secureLogger.error("Error fetching trending articles", { error });
        throw error;
      }

      return (data || []) as TrendingArticle[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled,
  });
}
