import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { SafeRichText } from "@/components/ui/SafeHtml";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { secureLogger } from "@/utils/browserLogger";
import { slateToHtml } from "@/utils/slateToHtml";
import { formatDuration } from "@/utils/formatDuration";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { CoursePurchaseCard } from "@/components/course/CoursePurchaseCard";
import { CourseHero } from "@/components/course/CourseHero";
import { CoursePurchasePopup } from "@/components/course/CoursePurchasePopup";
import { ContentWithPurchaseHints } from "@/components/course/ContentWithPurchaseHints";
import { useCoursePurchase } from "@/hooks/useCoursePurchase";
import { useCoursePurchasePopup } from "@/hooks/useCoursePurchasePopup";

import SEOHead from "@/components/SEO";
import {
  generateCourseSEO,
  generateCourseStructuredData,
  generateBreadcrumbStructuredData,
} from "@/utils/seo";

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

const CourseDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  // Purchase functionality - only for Stripe course
  const isStripeCourse = course?.id === '3a107f1a-9c87-4291-bf90-6adf854b2116';

  const { purchaseCourse, isLoading: isPurchaseLoading, currentPrice } = useCoursePurchase({
    courseId: course?.id || '',
    courseTitle: course?.title || '',
  });

  // Fallback pricing for non-Stripe courses
  const fallbackPrice = {
    amount: course ? parseFloat(course.price) * 100 : 0,
    label: 'Vienkartinis mokėjimas',
    savings: 0
  };

  const displayPrice = isStripeCourse ? currentPrice : fallbackPrice;

  // Smart popup for mobile
  const {
    isVisible: isPopupVisible,
    hidePopup
  } = useCoursePurchasePopup({
    delaySeconds: 120,
    // Set scrollThreshold above 1 so scroll will never trigger it, only time-based delay
    scrollThreshold: 2,
    sessionKey: `course-popup-${slug}`
  });

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

        {/* Clean Hero Section - with mobile purchase button */}
        <CourseHero
          course={course}
          currentPrice={isStripeCourse ? currentPrice : undefined}
          onPurchase={isStripeCourse ? purchaseCourse : () => (window.location.href = getPatreonLink(course.slug))}
          isLoading={isPurchaseLoading}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="dark-card mb-8 text-left">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-6 text-foreground text-left">Aprašymas</h2>

                {/* Course content with strategic purchase hints */}
                {isStripeCourse ? (
                  <ContentWithPurchaseHints
                    content={slateToHtml(course.content)}
                    currentPrice={displayPrice}
                    onPurchase={purchaseCourse}
                    className=""
                  />
                ) : (
                  <SafeRichText
                    content={slateToHtml(course.content)}
                    className="prose prose-slate dark:prose-invert max-w-none text-left [&>*]:text-left"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            {/* Sidebar Purchase Card - visible on all screens */}
            <div>
              {isStripeCourse ? (
                <CoursePurchaseCard courseId={course.id} courseTitle={course.title} />
              ) : (
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
              )}
            </div>

            {/* Highlights rodomi už kortelės */}
            {course.id === '3a107f1a-9c87-4291-bf90-6adf854b2116' && course.highlights && course.highlights.length > 0 && (
              <div className="dark-card mt-6">
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

        {/* Smart Purchase Popup for Mobile - only for Stripe course */}
        {isStripeCourse && (
          <CoursePurchasePopup
            course={{
              title: course.title,
              highlights: course.highlights,
              duration: formatDuration(course.duration)
            }}
            currentPrice={displayPrice}
            onPurchase={purchaseCourse}
            onClose={hidePopup}
            isVisible={isPopupVisible}
            isLoading={isPurchaseLoading}
            nextPrice={{
              amount: 14700, // 147 EUR final price
              label: 'Nuo lapkričio 22 d.'
            }}
          />
        )}
      </div>
    </>
  );
};

export default CourseDetail;
