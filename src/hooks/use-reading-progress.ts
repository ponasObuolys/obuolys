import { useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { secureLogger } from "@/utils/browserLogger";

interface UseReadingProgressProps {
  articleId: string;
  progress: number;
}

/**
 * Hook to save reading progress to database
 * Debounced to avoid too many database writes
 */
export function useReadingProgress({ articleId, progress }: UseReadingProgressProps) {
  const { user } = useAuth();

  const saveProgress = useCallback(async (progressPercentage: number) => {
    if (!user || !articleId) return;

    try {
      const { error } = await supabase
        .from("reading_progress")
        .upsert(
          {
            article_id: articleId,
            user_id: user.id,
            progress_percentage: Math.round(progressPercentage),
            completed: progressPercentage >= 95,
            last_position: Math.round(progressPercentage),
          },
          {
            onConflict: "article_id,user_id",
          }
        );

      if (error) throw error;
    } catch (error) {
      secureLogger.error("Error saving reading progress", { error, articleId });
    }
  }, [user, articleId]);

  useEffect(() => {
    // Debounce: only save every 5% progress change
    if (progress % 5 === 0 || progress >= 95) {
      saveProgress(progress);
    }
  }, [progress, saveProgress]);

  return { saveProgress };
}
