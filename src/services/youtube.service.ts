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
    // Workaround: Use direct fetch instead of Supabase client
    // Supabase client .functions.invoke() sometimes never starts the fetch request (bug)
    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
    const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

    const response = await fetch(`${SUPABASE_URL}/functions/v1/youtube-feed`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ limit }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to fetch YouTube videos');
    }

    const data: YoutubeFeedResponse = await response.json();
    return data?.items ?? [];
  },
};
