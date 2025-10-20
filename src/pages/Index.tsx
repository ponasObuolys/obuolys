
import Hero from '@/components/home/Hero';
import FeaturedArticles from '@/components/home/FeaturedArticles';
// import AINews from '@/components/home/AINews'; // Removed
import AITools from '@/components/home/AITools';
import Courses from '@/components/home/Courses';
import CallToAction from '@/components/home/CallToAction';
// Removed CoursesPreview, CtaSection, ToolsSection, FeaturesSection imports

import SEOHead from '@/components/SEO';
import {
  generateOrganizationStructuredData,
  generateWebSiteStructuredData,
  SITE_CONFIG,
} from '@/utils/seo';
import { BusinessSolutionsCTA } from '@/components/cta/business-solutions-cta';
import { TrendingArticles } from '@/components/widgets/trending-articles';

const Index = () => {
  const structuredData = [
    generateOrganizationStructuredData(),
    generateWebSiteStructuredData(),
  ];

  return (
    <>
      <SEOHead
        title="AI naujienos, įrankiai ir kursai Lietuvoje"
        description="Atraskite naujausias dirbtinio intelekto naujienas, AI įrankius, kursus ir straipsnius lietuvių kalba. Nemokamos rekomendacijos ir patarimai apie AI Lietuvoje - ponas Obuolys"
        canonical={SITE_CONFIG.domain}
        keywords={[
          'AI naujienos Lietuva',
          'dirbtinis intelektas',
          'AI įrankiai',
          'AI kursai lietuviškai',
          'ChatGPT Lietuva',
          'machine learning',
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
      
      <AITools />
      <Courses />
      
      {/* Business Solutions CTA */}
      <section className="py-16 bg-background">
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
