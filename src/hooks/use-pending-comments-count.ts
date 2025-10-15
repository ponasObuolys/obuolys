import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { secureLogger } from "@/utils/browserLogger";

export function usePendingCommentsCount() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCount();

    // Subscribe to changes
    const channel = supabase
      .channel("pending_comments_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "article_comments",
          filter: "is_approved=eq.false",
        },
        () => {
          fetchCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchCount = async () => {
    try {
      const { count: pendingCount, error } = await supabase
        .from("article_comments")
        .select("*", { count: "exact", head: true })
        .eq("is_approved", false)
        .eq("is_deleted", false);

      if (error) throw error;

      setCount(pendingCount || 0);
    } catch (error) {
      secureLogger.error("Error fetching pending comments count", { error });
    } finally {
      setLoading(false);
    }
  };

  return { count, loading, refetch: fetchCount };
}
