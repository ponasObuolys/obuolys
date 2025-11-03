import Hero from "@/components/home/Hero";
import FeaturedArticles from "@/components/home/FeaturedArticles";
// import AINews from '@/components/home/AINews'; // Removed
// import AITools from "@/components/home/AITools"; // Removed - recommended tools
import Courses from "@/components/home/Courses";
import CallToAction from "@/components/home/CallToAction";
// Removed CoursesPreview, CtaSection, ToolsSection, FeaturesSection imports

import SEOHead from "@/components/SEO";
import {
  generateOrganizationStructuredData,
  generateWebSiteStructuredData,
  SITE_CONFIG,
} from "@/utils/seo";
import { BusinessSolutionsCTA } from "@/components/cta/business-solutions-cta";
import { TrendingArticles } from "@/components/widgets/trending-articles";
import { CalculatorCTA } from "@/components/cta/calculator-cta";

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
      <Hero />
      <FeaturedArticles />
      {/* <AINews /> */}

      {/* Trending Articles Widget */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <TrendingArticles days={7} limit={3} />
        </div>
      </section>

      {/* <AITools /> */}
      <Courses />

      {/* Calculator CTA - Lead Magnet */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <CalculatorCTA />
        </div>
      </section>

      {/* Business Solutions CTA */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <BusinessSolutionsCTA context="publications" centered />
        </div>
      </section>

      <CallToAction />
      {/* Removed FeaturesSection, CoursesPreview, ToolsSection, CtaSection components */}
    </>
  );
};

export default Index;
