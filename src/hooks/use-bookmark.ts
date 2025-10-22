import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { secureLogger } from "@/utils/browserLogger";

interface UseBookmarkProps {
  articleId: string;
}

export function useBookmark({ articleId }: UseBookmarkProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if article is bookmarked
  const checkBookmark = useCallback(async () => {
    if (!user || !articleId) {
      setIsBookmarked(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("article_bookmarks")
        .select("id")
        .eq("article_id", articleId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      setIsBookmarked(!!data);
    } catch (error) {
      secureLogger.error("Error checking bookmark", { error, articleId });
    }
  }, [user, articleId]);

  useEffect(() => {
    checkBookmark();
  }, [checkBookmark]);

  const toggleBookmark = async () => {
    if (!user) {
      toast({
        title: "Prisijunkite",
        description: "Norėdami išsaugoti straipsnius, turite prisijungti.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (isBookmarked) {
        // Remove bookmark
        const { error } = await supabase
          .from("article_bookmarks")
          .delete()
          .eq("article_id", articleId)
          .eq("user_id", user.id);

        if (error) throw error;

        setIsBookmarked(false);
        toast({
          title: "Pašalinta",
          description: "Straipsnis pašalintas iš jūsų sąrašo.",
        });
      } else {
        // Add bookmark
        const { error } = await supabase.from("article_bookmarks").insert({
          article_id: articleId,
          user_id: user.id,
        });

        if (error) throw error;

        setIsBookmarked(true);
        toast({
          title: "Išsaugota!",
          description: "Straipsnis pridėtas į jūsų sąrašą.",
        });
      }
    } catch (error) {
      secureLogger.error("Error toggling bookmark", { error, articleId });
      toast({
        title: "Klaida",
        description: "Nepavyko išsaugoti straipsnio. Bandykite vėliau.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    isBookmarked,
    loading,
    toggleBookmark,
  };
}
