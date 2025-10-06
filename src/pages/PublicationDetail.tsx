import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import LazyImage from "@/components/ui/lazy-image";
import { SafeRichText } from "@/components/ui/SafeHtml";
import { useToast } from "@/components/ui/use-toast";
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

type Publication = Tables<"articles">;

const PublicationDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [publication, setPublication] = useState<Publication | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const contentRef = useRef<HTMLDivElement>(null);

  useLazyImages(contentRef);

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
        slug: slug || '',
        image: publication.image_url || undefined,
        published_at: publication.date,
        updated_at: publication.updated_at || undefined,
        tags: publication.category ? [publication.category] : [],
      })
    : null;

  const structuredData = publication
    ? [
        generateArticleStructuredData({
          title: publication.title,
          description: publication.description || seoData?.description || '',
          slug: slug || '',
          image: publication.image_url || undefined,
          published_at: publication.date,
          updated_at: publication.updated_at || undefined,
          author: publication.author || undefined,
        }),
        generateBreadcrumbStructuredData([
          { name: 'Pradžia', url: 'https://ponasobuolys.lt' },
          { name: 'Publikacijos', url: 'https://ponasobuolys.lt/publikacijos' },
          { name: publication.title, url: `https://ponasobuolys.lt/publikacijos/${slug}` },
        ]),
      ]
    : null;

  return (
    <>
      {seoData && <SEOHead {...seoData} structuredData={structuredData || undefined} />}

      <article className="container mx-auto px-4 py-12">
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
              <Badge variant="outline">{publication.category}</Badge>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">{publication.title}</h1>

            <div className="flex flex-wrap gap-4 mb-8 text-sm text-gray-200">
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
            </div>

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
      </article>
    </>
  );
};

export default PublicationDetail;
