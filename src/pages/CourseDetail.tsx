import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, CheckCircle } from "lucide-react";
import { SafeRichText } from "@/components/ui/SafeHtml";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { secureLogger } from "@/utils/browserLogger";
import { slateToHtml } from "@/utils/slateToHtml";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

import SEOHead from "@/components/SEO";
import {
  generateCourseSEO,
  generateCourseStructuredData,
  generateBreadcrumbStructuredData,
} from "@/utils/seo";
import { ShareButton } from "@/components/ui/share-button";

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  price: string;
  duration: string;
  level: string;
  highlights: string[];
  published: boolean;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

// Funkcija Patreon nuorodai gauti pagal kurso slug
const getPatreonLink = (slug: string): string => {
  const patreonLinks: { [key: string]: string } = {
    "vibe-coding-masterclass": "https://www.patreon.com/posts/vibe-coding-su-125505176",
  };
  return patreonLinks[slug] || "#";
};

// Funkcija lietuviškam valandų formatavimui
const formatDuration = (duration: string): string => {
  // Ištraukiame skaičių iš duration string (pvz., "14" iš "14")
  const hours = parseInt(duration);

  if (isNaN(hours)) {
    return duration; // Jei nepavyko parse'inti, grąžiname originalą
  }

  // Lietuviška daugiskaita:
  // 1, 21, 31... -> valanda
  // 2-4, 22-24, 32-34... (bet ne 12-14) -> valandos
  // 5-20, 25-30... -> valandų

  const lastDigit = hours % 10;
  const lastTwoDigits = hours % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return `${hours} valandų`;
  }

  if (lastDigit === 1) {
    return `${hours} valanda`;
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return `${hours} valandos`;
  }

  return `${hours} valandų`;
};

const CourseDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async (courseSlug: string) => {
      try {
        secureLogger.info("Fetching course with slug", { slug: courseSlug });
        // Fetch as an array, limit to 1 result
        const { data, error } = await supabase
          .from("courses")
          .select("*")
          .eq("slug", courseSlug)
          .eq("published", true)
          .limit(1);

        if (error) {
          secureLogger.error("Supabase error", { error });
          throw error;
        }

        secureLogger.info("Course data array received", { dataLength: data?.length });
        // Check if the array has data
        if (data && data.length > 0) {
          setCourse(data[0]); // Set the first element
        } else {
          secureLogger.warn("No course data found", { slug: courseSlug });
          setCourse(null); // Explicitly set to null if no data
        }
      } catch (error) {
        secureLogger.error("Error fetching course", { error, slug: courseSlug });
        toast({
          title: "Klaida",
          description: "Nepavyko gauti kurso informacijos. Bandykite vėliau.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCourse(slug);
    }

    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Kraunama...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Kursas nerastas</h1>
        <p className="mb-6">Atsiprašome, bet ieškomas kursas neegzistuoja.</p>
        <Link to="/kursai">
          <Button className="button-primary">Grįžti į kursų sąrašą</Button>
        </Link>
      </div>
    );
  }

  // Generate SEO data
  const seoData = generateCourseSEO({
    title: course.title,
    description: course.description,
    slug: slug || "",
    image: course.image_url || undefined,
    level: course.level,
  });

  const structuredData = [
    generateCourseStructuredData({
      title: course.title,
      description: course.description,
      slug: slug || "",
      image: course.image_url || undefined,
      level: course.level,
      duration: course.duration,
      price: course.price ? parseFloat(course.price) : undefined,
    }),
    generateBreadcrumbStructuredData([
      { name: "Pradžia", url: "https://ponasobuolys.lt" },
      { name: "AI Kursai", url: "https://ponasobuolys.lt/kursai" },
      { name: course.title, url: `https://ponasobuolys.lt/kursai/${slug}` },
    ]),
  ];

  return (
    <>
      <SEOHead {...seoData} structuredData={structuredData} />
      <div className="container mx-auto px-4 py-12">
        <Breadcrumbs
          items={[
            { label: "Kursai", href: "/kursai" },
            { label: course.level, href: "/kursai" },
            { label: course.title },
          ]}
        />

        <Link
          to="/kursai"
          className="inline-flex items-center text-primary hover:text-primary/80 mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span>Grįžti į kursų sąrašą</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="dark-card mb-8 text-left">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-foreground flex-1">{course.title}</h1>
                <ShareButton
                  title={course.title}
                  description={course.description}
                  url={`https://ponasobuolys.lt/kursai/${slug}`}
                  imageUrl={course.image_url || undefined}
                  variant="outline"
                  size="default"
                />
              </div>
              <p className="text-lg mb-6 text-foreground/80">{course.description}</p>

              <div className="flex flex-wrap gap-4 mb-6 text-foreground/70">
                <div className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-primary" />
                  <span>{formatDuration(course.duration)}</span>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-6 text-foreground text-left">Aprašymas</h2>
                <SafeRichText
                  content={slateToHtml(course.content)}
                  className="prose prose-slate dark:prose-invert max-w-none text-left [&>*]:text-left"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="dark-card sticky top-24">
              <div className="text-center mb-6">
                <p className="text-3xl font-bold text-primary mb-2">{course.price}€</p>
                <div className="text-sm mb-4 text-foreground/60">
                  Vienkartinis mokėjimas, prieiga neribotam laikui
                </div>
                <Button
                  className="w-full button-primary text-lg py-6"
                  onClick={() => (window.location.href = getPatreonLink(course.slug))}
                >
                  Įsigyti kursą
                </Button>
              </div>

              {course.highlights && course.highlights.length > 0 && (
                <div className="border-t border-border pt-6">
                  <h4 className="font-bold mb-4 text-left text-foreground">Kursas apima:</h4>
                  <ul className="space-y-3 text-left text-foreground/80">
                    {course.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseDetail;
