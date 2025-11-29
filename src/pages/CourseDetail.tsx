import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShinyButton } from "@/components/ui/shiny-button";
import { ArrowLeft, CheckCircle, RefreshCw, AlertCircle } from "lucide-react";
import { SafeRichText } from "@/components/ui/SafeHtml";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { slateToHtml } from "@/utils/slateToHtml";
import { formatDuration } from "@/utils/formatDuration";
import { CoursePurchaseCard } from "@/components/course/CoursePurchaseCard";
import { CourseHero } from "@/components/course/CourseHero";
import { CoursePurchasePopup } from "@/components/course/CoursePurchasePopup";
import { ContentWithPurchaseHints } from "@/components/course/ContentWithPurchaseHints";
import { CourseTestimonials } from "@/components/course/course-testimonials";
import { CourseFaq } from "@/components/course/course-faq";
import { CoursePdfGuides } from "@/components/course/course-pdf-guides";
import { useCoursePurchase } from "@/hooks/useCoursePurchase";
import { useCoursePurchasePopup } from "@/hooks/useCoursePurchasePopup";
import { useCourse } from "@/hooks/use-course";
import LoadingSpinner from "@/components/ui/loading-spinner";

import SEOHead from "@/components/SEO";
import {
  generateCourseSEO,
  generateCourseStructuredData,
  generateBreadcrumbStructuredData,
} from "@/utils/seo";

// Funkcija Patreon nuorodai gauti pagal kurso slug
const getPatreonLink = (slug: string): string => {
  const patreonLinks: { [key: string]: string } = {
    "vibe-coding-masterclass": "https://www.patreon.com/posts/vibe-coding-su-125505176",
    "vibe-coding-class": "https://www.patreon.com/posts/vibe-coding-su-125505176",
    "lovable-workshop": "https://www.patreon.com/posts/lovable-workshop-120266952",
  };
  return patreonLinks[slug] || "#";
};

const CourseDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // Use the reliable useCourse hook with timeout, retry, and error handling
  const { 
    data: course, 
    isLoading, 
    isError, 
    error, 
    refetch,
    isFetching 
  } = useCourse(slug);

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
    description: 'Vienkartinis mokėjimas, prieiga neribotam laikui'
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

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Loading state with spinner
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <LoadingSpinner 
          size="lg" 
          text="Kraunama kurso informacija..." 
        />
      </div>
    );
  }

  // Error state with retry button
  if (isError) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Nepavyko užkrauti kurso</h1>
          <p className="mb-6 text-muted-foreground">
            {error instanceof Error 
              ? error.message 
              : "Įvyko klaida kraunant kurso informaciją. Patikrinkite interneto ryšį ir bandykite dar kartą."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={() => refetch()} 
              disabled={isFetching}
              className="button-primary"
            >
              {isFetching ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Kraunama...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Bandyti dar kartą
                </>
              )}
            </Button>
            <Link to="/kursai">
              <Button variant="outline">Grįžti į kursų sąrašą</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Course not found state
  if (!course) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Kursas nerastas</h1>
        <p className="mb-6">Atsiprašome, bet ieškomas kursas neegzistuoja.</p>
        <Link to="/kursai">
          <ShinyButton>Grįžti į kursų sąrašą</ShinyButton>
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
                    className="prose prose-slate dark:prose-invert max-w-none text-left [&>*]:text-left prose-p:my-2 prose-p:leading-relaxed"
                  />
                ) : (
                  <SafeRichText
                    content={slateToHtml(course.content)}
                    className="prose prose-slate dark:prose-invert max-w-none text-left [&>*]:text-left prose-p:my-2 prose-p:leading-relaxed"
                  />
                )}
              </div>
            </div>

            {/* Testimonials Section - aukščiau, nes svarbu konversijai */}
            <CourseTestimonials 
              courseId={course.id} 
              className="mb-8"
            />

            {/* PDF Guides Section */}
            {course.pdf_guides && course.pdf_guides.length > 0 && (
              <CoursePdfGuides 
                guides={course.pdf_guides} 
                className="dark-card mb-8"
              />
            )}

            {/* FAQ Section */}
            <CourseFaq 
              courseId={course.id} 
              className="mb-8"
            />
          </div>

          <div className="lg:col-span-1">
            {/* Sidebar Purchase Card - visible on all screens */}
            <div>
              {isStripeCourse ? (
                <CoursePurchaseCard 
                  courseId={course.id} 
                  courseTitle={course.title}
                  maxSpots={course.max_spots}
                  courseStartDate={course.course_start_date}
                  ctaButtonText={course.cta_button_text}
                />
              ) : (
                <div className="dark-card sticky top-24">
                  <div className="text-center mb-6">
                    <p className="text-3xl font-bold text-primary mb-2">{course.price}€</p>
                    <div className="text-sm mb-4 text-foreground/60">
                      Vienkartinis mokėjimas, prieiga neribotam laikui
                    </div>
                    <ShinyButton
                      className="w-full text-lg py-6"
                      onClick={() => (window.location.href = getPatreonLink(course.slug))}
                    >
                      Įsigyti kursą
                    </ShinyButton>
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
          />
        )}
      </div>
    </>
  );
};

export default CourseDetail;
