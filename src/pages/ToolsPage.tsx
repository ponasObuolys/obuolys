import { useEffect, useState, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Plus, ExternalLink } from "lucide-react";

import SEOHead from "@/components/SEO";
import { SITE_CONFIG } from "@/utils/seo";

// Importuojame naujus komponentus

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { YoutubeVideoItem } from "@/services/youtube.service";
import { useYoutubeVideos } from "@/hooks/use-youtube-videos";

const BusinessSolutionsCTA = lazy(() =>
  import("@/components/cta/business-solutions-cta").then((module) => ({
    default: module.BusinessSolutionsCTA,
  }))
);

const ToolsPage = () => {
  const [limit] = useState(24);
  const { toast } = useToast();
  const [selectedVideo, setSelectedVideo] = useState<YoutubeVideoItem | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  // Naudojame React Query hook vietoj useState + useEffect
  const {
    data: videos = [],
    isLoading: loading,
    error,
  } = useYoutubeVideos({ limit });

  // Rodome klaidos pranešimą jei įvyko klaida (useEffect išvengia infinite loop)
  useEffect(() => {
    if (error) {
      toast({
        title: "Klaida",
        description: "Nepavyko gauti YouTube video. Bandykite vėliau.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

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
    <>
      <SEOHead
        title="YouTube vaizdo įrašai"
        description="Naujausi ponas Obuolys YouTube kanalo vaizdo įrašai apie dirbtinį intelektą, AI įrankius ir jų pritaikymą versle."
        canonical={`${SITE_CONFIG.domain}/youtube`}
        keywords={[
          "YouTube",
          "AI video",
          "ponas Obuolys YouTube",
          "dirbtinis intelektas",
          "AI verslui",
        ]}
        type="website"
      />
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="dark-card mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-2 h-2 rounded-full bg-foreground/40"></span>
                    <span className="text-sm text-foreground/60">YouTube</span>
                  </div>

                  <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-left">
                    Naujausi YouTube video
                  </h1>

                  <p className="text-xl text-foreground/80 max-w-2xl text-left">
                    Ponas Obuolys YouTube kanalo turinys apie dirbtinį intelektą, praktinius AI
                    sprendimus ir realius verslo pavyzdžius.
                  </p>
                </div>
                <Link to="/kontaktai?type=YOUTUBE" className="w-full sm:w-auto">
                  <Button className="button-primary flex items-center justify-center gap-2 w-full sm:w-auto">
                    <Plus className="w-4 h-4" />
                    Pasiūlyti video temą
                  </Button>
                </Link>
              </div>
            </div>

            {/* Video sąrašas */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-64 rounded-xl bg-muted animate-pulse border border-border/40"
                  />
                ))}
              </div>
            ) : videos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map(video => (
                  <div
                    key={video.id}
                    className="rounded-xl border border-border bg-card overflow-hidden hover:border-primary/60 hover:shadow-lg transition-all group flex flex-col"
                  >
                    <button
                      type="button"
                      onClick={() => openPlayer(video)}
                      className="w-full text-left"
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
                    <div className="px-4 pb-4 mt-auto flex justify-between items-center gap-2">
                      <span className="text-xs text-foreground/50">Peržiūrėti svetainėje</span>
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Žiūrėti YouTube
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="dark-card">
                  <p className="text-xl text-foreground/60 mb-4">
                    Šiuo metu nepavyko gauti YouTube video.
                  </p>
                  <p className="text-foreground/50">
                    Patikrinkite vėliau arba apsilankykite kanale tiesiogiai.
                  </p>
                </div>
              </div>
            )}

            {/* Business Solutions CTA */}
            <div className="mt-16">
              <Suspense fallback={<div className="h-64 bg-muted/20 rounded-lg animate-pulse" />}>
                <BusinessSolutionsCTA context="tools" centered />
              </Suspense>
            </div>

            {/* Apie rekomendacijas sekcija */}
            <div className="mt-12">
              <div className="dark-card">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Apie YouTube turinį
                </h2>
                <p className="text-foreground/80 mb-6 leading-relaxed">
                  Visi kuriami video yra paremti asmenine patirtimi dirbtinio intelekto projektuose
                  ir realiais pavyzdžiais iš Lietuvos verslo. Kai kurios nuorodos po video gali būti
                  partnerinės, už kurias gaunamas komisinis mokestis.
                </p>
                <p className="text-foreground/70">
                  Tačiau tai neturi įtakos mano nuomonei apie pristatomus sprendimus. Visada
                  stengiuosi pateikti objektyvią ir naudingą informaciją apie AI sprendimus.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Dialog
        open={isPlayerOpen && !!selectedVideo}
        onOpenChange={open => {
          if (!open) {
            closePlayer();
          }
        }}
      >
        <DialogContent className="max-w-5xl w-full p-0 overflow-hidden bg-black aspect-video">
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
    </>
  );
};

export default ToolsPage;
