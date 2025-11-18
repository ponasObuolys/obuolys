import { useQuery } from "@tanstack/react-query";
import type { YoutubeVideoItem } from "@/services/youtube.service";
import { youtubeService } from "@/services/youtube.service";

interface UseYoutubeVideosOptions {
  limit?: number;
}

export const useYoutubeVideos = ({ limit = 10 }: UseYoutubeVideosOptions = {}) => {
  return useQuery<YoutubeVideoItem[], Error>({
    queryKey: ["youtube-videos", limit],
    queryFn: () => youtubeService.getLatestVideos(limit),
    staleTime: 60 * 1000,
    refetchOnMount: true,
  });
};
