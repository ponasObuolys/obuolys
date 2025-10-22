import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import LazyImage from "@/components/ui/lazy-image";
import { SafeRichText } from "@/components/ui/SafeHtml";
import { useToast } from "@/components/ui/use-toast";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import useLazyImages from "@/hooks/useLazyImages";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { secureLogger } from "@/utils/browserLogger";
import { extractImagesFromHTML, preloadImagesWhenIdle } from "@/utils/imagePreloader";
import { addLazyLoadingToImages } from "@/utils/lazyLoadImages";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

import SEOHead from "@/components/SEO";
import {
  generateArticleSEO,
  generateArticleStructuredData,
  generateBreadcrumbStructuredData,
} from "@/utils/seo";
import { ShareButton } from "@/components/ui/share-button";
import { RelatedArticles } from "@/components/publications/related-articles";
import { useRelatedArticles } from "@/hooks/use-related-articles";
import { BookmarkButton } from "@/components/publications/bookmark-button";
import { ReadingProgressBar } from "@/components/reading/reading-progress-bar";
import { useReadingProgress } from "@/hooks/use-reading-progress";
import { CommentsSection } from "@/components/comments/comments-section";
import { BusinessSolutionsCTA } from "@/components/cta/business-solutions-cta";
import { ReaderStats } from "@/components/analytics/reader-stats";
import { analyticsService } from "@/services/analytics.service";

type Publication = Tables<"articles">;

const PublicationDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [publication, setPublication] = useState<Publication | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const contentRef = useRef<HTMLDivElement>(null);
  const articleRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useLazyImages(contentRef);

  // Fetch related articles based on current publication's categories
  const { relatedArticles, loading: relatedLoading } = useRelatedArticles({
    currentArticleId: publication?.id || "",
    categories: publication?.category || [],
    limit: 3,
  });

  // Track reading progress
  useReadingProgress({
    articleId: publication?.id || "",
    progress: scrollProgress,
  });

  // Calculate scroll progress
  useEffect(() => {
    const handleScroll = () => {
      if (!articleRef.current) return;

      const element = articleRef.current;
      const rect = element.getBoundingClientRect();
      const elementHeight = element.offsetHeight;
      const viewportHeight = window.innerHeight;
      const scrolled = -rect.top;
      const total = elementHeight - viewportHeight;

      if (total <= 0) {
        setScrollProgress(100);
        return;
      }

      const percentage = Math.min(100, Math.max(0, (scrolled / total) * 100));
      setScrollProgress(percentage);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [publication]);

  useEffect(() => {
    const fetchPublication = async () => {
      try {
        setLoading(true);

        if (!slug) return;

        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .eq("slug", slug)
          .eq("published", true)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setPublication(data as Publication);

          // Track page view for analytics
          analyticsService.trackPageView(data.id);

          if (data.content) {
            const imageUrls = extractImagesFromHTML(data.content);
            preloadImagesWhenIdle(imageUrls);
          }
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Nepavyko gauti publikacijos informacijos";
        toast({
          title: "Klaida",
          description: "Nepavyko gauti publikacijos informacijos. Bandykite vėliau.",
          variant: "destructive",
        });
        secureLogger.error("Error fetching publication", { error: errorMessage, slug });
      } finally {
        setLoading(false);
      }
    };

    fetchPublication();
    window.scrollTo(0, 0);
  }, [slug, toast]);

  if (loading) {
    return (
      <>
        <div className="container mx-auto px-4 py-16 text-center">
          <p>Kraunama...</p>
        </div>
      </>
    );
  }

  if (!publication) {
    return (
      <>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Publikacija nerasta</h1>
          <p className="mb-6">Atsiprašome, bet ieškoma publikacija neegzistuoja.</p>
          <Link to="/publikacijos">
            <Button className="button-primary">Grįžti į publikacijų sąrašą</Button>
          </Link>
        </div>
      </>
    );
  }

  // Generate SEO data
  const seoData = publication
    ? generateArticleSEO({
        title: publication.title,
        description: publication.description || undefined,
        content: publication.content || undefined,
        slug: slug || "",
        image: publication.image_url || undefined,
        published_at: publication.date,
        updated_at: publication.updated_at || undefined,
        tags: publication.category || [],
      })
    : null;

  const structuredData = publication
    ? [
        generateArticleStructuredData({
          title: publication.title,
          description: publication.description || seoData?.description || "",
          slug: slug || "",
          image: publication.image_url || undefined,
          published_at: publication.date,
          updated_at: publication.updated_at || undefined,
          author: publication.author || undefined,
        }),
        generateBreadcrumbStructuredData([
          { name: "Pradžia", url: "https://ponasobuolys.lt" },
          { name: "Publikacijos", url: "https://ponasobuolys.lt/publikacijos" },
          { name: publication.title, url: `https://ponasobuolys.lt/publikacijos/${slug}` },
        ]),
      ]
    : null;

  return (
    <>
      {seoData && <SEOHead {...seoData} structuredData={structuredData || undefined} />}

      {/* Reading progress bar */}
      {publication && (
        <ReadingProgressBar targetRef={articleRef} estimatedReadTime={publication.read_time} />
      )}

      <article ref={articleRef} className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Breadcrumbs
            items={[
              { label: "Straipsniai", href: "/publikacijos" },
              {
                label: publication?.content_type === "Naujiena" ? "AI Naujienos" : "Straipsniai",
                href: "/publikacijos",
              },
              { label: publication?.title || "Kraunama..." },
            ]}
          />
        </div>

        <Link
          to="/publikacijos"
          className="inline-flex items-center text-primary hover:text-primary/80 mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span>Grįžti į publikacijų sąrašą</span>
        </Link>

        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              {publication.content_type && (
                <Badge
                  variant={publication.content_type === "Naujiena" ? "destructive" : "secondary"}
                >
                  {publication.content_type}
                </Badge>
              )}
              {publication.category && publication.category.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {publication.category.map(cat => (
                    <Badge key={cat} variant="outline">
                      {cat}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-left">{publication.title}</h1>

            <div className="flex flex-wrap items-center gap-3 mb-8 text-sm text-gray-200">
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                <span>{new Date(publication.date).toLocaleDateString("lt-LT")}</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                <span>{publication.read_time} skaitymo</span>
              </div>
              <div>
                Autorius: <span className="font-medium">{publication.author}</span>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <BookmarkButton articleId={publication.id} size="sm" showText={false} />
                <ShareButton
                  title={publication.title}
                  description={
                    publication.description || publication.content?.substring(0, 200) || ""
                  }
                  url={`https://ponasobuolys.lt/publikacijos/${slug}`}
                  imageUrl={publication.image_url || undefined}
                  variant="outline"
                  size="sm"
                />
              </div>
            </div>

            {/* Reader Statistics */}
            <ReaderStats articleId={publication.id} variant="compact" className="mb-6" />

            {publication.image_url ? (
              <div className="mb-8 rounded-md overflow-hidden">
                <LazyImage
                  src={publication.image_url}
                  alt={publication.title}
                  className="w-full h-auto"
                />
              </div>
            ) : (
              <div className="h-64 bg-gray-800 rounded-md flex items-center justify-center text-gray-200 mb-8">
                Publikacijos nuotrauka
              </div>
            )}

            <div ref={contentRef}>
              <SafeRichText
                content={addLazyLoadingToImages(publication.content || "")}
                className="prose max-w-none mb-8 text-left"
              />
            </div>
          </div>
        </div>

        {/* Business Solutions CTA */}
        <div className="mt-16">
          <BusinessSolutionsCTA variant="compact" context="article" />
        </div>

        {/* Comments Section */}
        <CommentsSection articleId={publication.id} />

        {/* Related Articles Section */}
        <RelatedArticles articles={relatedArticles} loading={relatedLoading} />
      </article>
    </>
  );
};

export default PublicationDetail;
