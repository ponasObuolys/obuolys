import { lazy, Suspense } from "react";
import Hero from "@/components/home/Hero";
import FeaturedArticles from "@/components/home/FeaturedArticles";
// import AINews from '@/components/home/AINews'; // Removed
import AITools from "@/components/home/AITools"; // YouTube video feed sekcija
import Courses from "@/components/home/Courses";
import CallToAction from "@/components/home/CallToAction";
// Removed CoursesPreview, CtaSection, ToolsSection, FeaturesSection imports

import SEOHead from "@/components/SEO";
import {
  generateOrganizationStructuredData,
  generateWebSiteStructuredData,
  SITE_CONFIG,
} from "@/utils/seo";
import { CoursePromoPopup } from "@/components/home/CoursePromoPopup";

const BusinessSolutionsCTA = lazy(() =>
  import("@/components/cta/business-solutions-cta").then((module) => ({
    default: module.BusinessSolutionsCTA,
  }))
);
const CalculatorCTA = lazy(() =>
  import("@/components/cta/calculator-cta").then((module) => ({ default: module.CalculatorCTA }))
);

const Index = () => {
  const structuredData = [generateOrganizationStructuredData(), generateWebSiteStructuredData()];

  return (
    <>
      <SEOHead
        title="React & TypeScript Aplikacijos Lietuvos Verslui | Ponas Obuolys"
        description="Profesionalus React ir TypeScript aplikacijų kūrimas Lietuvos verslui. Specializacija logistikos sistemose - CRM, krovinių valdymas, automatizacija. Supabase + Vercel stack. 5+ sėkmingi projektai. Greitas pristatymas, patikimas kodas. Portfolio + nemokama konsultacija."
        canonical={SITE_CONFIG.domain}
        keywords={[
          "React programuotojas Lietuva",
          "TypeScript kūrėjas",
          "React aplikacijų kūrimas",
          "Supabase kūrimas",
          "logistikos programinė įranga",
          "CRM sistema React",
          "web aplikacijų kūrimas Lietuvoje",
          "React freelancer",
          "TypeScript aplikacijos",
          "Vercel deployment",
          "MVP kūrimas",
          "verslo automatizacija",
        ]}
        type="website"
        structuredData={structuredData}
      />

      {/* Kurso reklaminis popup - automatiškai rodo kursą su promote_in_popup = true */}
      <CoursePromoPopup delaySeconds={5} />

      <Hero />
      <FeaturedArticles />
      {/* <AINews /> */}
      <AITools />
      <Courses />

      {/* Calculator CTA - Lead Magnet */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <Suspense fallback={<div className="h-64 bg-muted/20 rounded-lg animate-pulse" />}>
            <CalculatorCTA />
          </Suspense>
        </div>
      </section>

      {/* Business Solutions CTA */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <Suspense fallback={<div className="h-64 bg-muted/20 rounded-lg animate-pulse" />}>
            <BusinessSolutionsCTA context="publications" centered />
          </Suspense>
        </div>
      </section>

      <CallToAction />
      {/* Removed FeaturesSection, CoursesPreview, ToolsSection, CtaSection components */}
    </>
  );
};

export default Index;
