import { supabase } from "@/integrations/supabase/client";

export interface YoutubeVideoItem {
  id: string;
  title: string;
  url: string;
  publishedAt: string;
  thumbnailUrl: string;
}

interface YoutubeFeedResponse {
  items: YoutubeVideoItem[];
}

export const youtubeService = {
  async getLatestVideos(limit = 10): Promise<YoutubeVideoItem[]> {
    const { data, error } = await supabase.functions.invoke<YoutubeFeedResponse>("youtube-feed", {
      body: { limit },
    });

    if (error) {
      throw error;
    }

    return data?.items ?? [];
  },
};
