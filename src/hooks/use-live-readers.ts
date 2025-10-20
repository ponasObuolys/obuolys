import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { secureLogger } from "@/utils/browserLogger";

interface UseLiveReadersOptions {
  articleId: string;
  enabled?: boolean;
}

interface LiveReadersState {
  count: number;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook to track and display live readers count for an article using Supabase Realtime Presence
 */
export function useLiveReaders({
  articleId,
  enabled = true,
}: UseLiveReadersOptions): LiveReadersState {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled || !articleId) {
      setLoading(false);
      return;
    }

    let channel: RealtimeChannel | null = null;

    const setupPresence = async () => {
      try {
        // Create a unique channel for this article
        const channelName = `article:${articleId}`;
        
        channel = supabase.channel(channelName, {
          config: {
            presence: {
              key: articleId,
            },
          },
        });

        // Track presence state changes
        channel
          .on("presence", { event: "sync" }, () => {
            const state = channel?.presenceState();
            if (state) {
              // Count unique users in the presence state
              const userCount = Object.keys(state).length;
              setCount(userCount);
              setLoading(false);
            }
          })
          .on("presence", { event: "join" }, ({ newPresences }) => {
            secureLogger.debug("New reader joined", { 
              articleId, 
              count: newPresences.length 
            });
          })
          .on("presence", { event: "leave" }, ({ leftPresences }) => {
            secureLogger.debug("Reader left", { 
              articleId, 
              count: leftPresences.length 
            });
          });

        // Subscribe to the channel
        await channel.subscribe(async (status) => {
          if (status === "SUBSCRIBED") {
            // Track this user's presence
            const presenceTrackStatus = await channel?.track({
              online_at: new Date().toISOString(),
              user_agent: navigator.userAgent.substring(0, 100),
            });
            
            if (presenceTrackStatus === "ok") {
              secureLogger.debug("Presence tracking started", { articleId });
            }
          }
        });

      } catch (err) {
        const error = err instanceof Error ? err : new Error("Failed to setup presence");
        setError(error);
        setLoading(false);
        secureLogger.error("Failed to setup live readers", { error, articleId });
      }
    };

    setupPresence();

    // Cleanup function
    return () => {
      if (channel) {
        channel.untrack();
        supabase.removeChannel(channel);
        secureLogger.debug("Presence tracking stopped", { articleId });
      }
    };
  }, [articleId, enabled]);

  return { count, loading, error };
}
