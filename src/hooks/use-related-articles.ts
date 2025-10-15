import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { secureLogger } from "@/utils/browserLogger";

type Article = Tables<"articles">;

interface UseRelatedArticlesProps {
  currentArticleId: string;
  categories: string[];
  limit?: number;
}

/**
 * Hook to fetch related articles based on shared categories
 * Prioritizes articles with most matching categories
 */
export function useRelatedArticles({
  currentArticleId,
  categories,
  limit = 3,
}: UseRelatedArticlesProps) {
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedArticles = async () => {
      if (!categories || categories.length === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch published articles that share at least one category
        // Exclude current article
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .eq("published", true)
          .neq("id", currentArticleId)
          .order("date", { ascending: false })
          .limit(limit * 3); // Fetch more to filter by category overlap

        if (error) throw error;

        if (data) {
          // Score articles by number of matching categories
          const scoredArticles = data
            .map(article => {
              const matchingCategories = article.category?.filter(cat =>
                categories.includes(cat)
              ) || [];
              
              return {
                ...article,
                score: matchingCategories.length,
              };
            })
            .filter(article => article.score > 0) // Only articles with at least 1 matching category
            .sort((a, b) => {
              // Sort by score (descending), then by date (descending)
              if (b.score !== a.score) {
                return b.score - a.score;
              }
              return new Date(b.date).getTime() - new Date(a.date).getTime();
            })
            .slice(0, limit);

          setRelatedArticles(scoredArticles);
        }
      } catch (error) {
        secureLogger.error("Error fetching related articles", { error });
        setRelatedArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedArticles();
  }, [currentArticleId, categories, limit]);

  return { relatedArticles, loading };
}
