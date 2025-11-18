import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { YoutubeVideoItem } from "@/services/youtube.service";
import { useYoutubeVideos } from "@/hooks/use-youtube-videos";

const AITools = () => {
  const [limit, setLimit] = useState(3);
  const [selectedVideo, setSelectedVideo] = useState<YoutubeVideoItem | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  useEffect(() => {
    // Funkcija nustatyti kiek rodyti pagal lango dydį
    const getLimit = () => 3;

    const updateLimit = () => {
      setLimit(getLimit());
    };

    updateLimit();

    // Reaguok į lango dydžio pokytį
    const handleResize = () => updateLimit();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const {
    data: videos = [],
    isLoading,
  } = useYoutubeVideos({ limit });

  const openPlayer = (video: YoutubeVideoItem) => {
    setSelectedVideo(video);
    setIsPlayerOpen(true);
  };

  const closePlayer = () => {
    setIsPlayerOpen(false);
    setSelectedVideo(null);
  };

  const getEmbedUrl = (video: YoutubeVideoItem): string => {
    if (!video) return "";

    try {
      const url = new URL(video.url);
      const v = url.searchParams.get("v");
      const id = v || video.id;
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : video.url;
    } catch {
      return video.id ? `https://www.youtube.com/embed/${video.id}?autoplay=1` : video.url;
    }
  };

  return (
    <section id="youtube" className="py-12 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mb-8 md:mb-12 text-center">
          <h2 className="gradient-text">Naujausi YouTube video</h2>
          <p className="mt-3 text-foreground/90">
            Naujausi vaizdo įrašai iš ponas Obuolys YouTube kanalo apie dirbtinį intelektą ir
            jo pritaikymą.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-xl text-foreground/90">Kraunami YouTube video...</p>
          </div>
        ) : videos.length > 0 ? (
          <div className="tools-grid">
            {videos.map(video => (
              <button
                key={video.id}
                type="button"
                onClick={() => openPlayer(video)}
                className="block w-full rounded-xl border border-border bg-card overflow-hidden hover:border-primary/60 hover:shadow-lg transition-all group text-left"
              >
                <div className="aspect-video w-full overflow-hidden bg-muted">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-4 text-left">
                  <h3 className="font-semibold mb-1 line-clamp-2">{video.title}</h3>
                  <p className="text-xs text-foreground/60">
                    {new Date(video.publishedAt).toLocaleDateString("lt-LT", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    })}
                  </p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-xl text-foreground/90">Šiuo metu nepavyko gauti YouTube video.</p>
          </div>
        )}

        <div className="mt-8 md:mt-12">
          <a
            href="https://www.youtube.com/@ponasobuolys"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full sm:w-auto"
          >
            <Button className="button-outline w-full sm:w-auto">Daugiau video YouTube</Button>
          </a>
        </div>
      </div>

      <Dialog
        open={isPlayerOpen && !!selectedVideo}
        onOpenChange={open => {
          if (!open) {
            closePlayer();
          }
        }}
      >
        <DialogContent className="max-w-4xl w-full p-0 overflow-hidden bg-black aspect-video">
          {selectedVideo && (
            <>
              <DialogTitle className="sr-only">{selectedVideo.title}</DialogTitle>
              <iframe
                className="w-full h-full"
                src={getEmbedUrl(selectedVideo)}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default AITools;
