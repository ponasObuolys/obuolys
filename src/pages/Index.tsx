
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
      <AITools />
      <Courses />
      <CallToAction />
      {/* Removed FeaturesSection, CoursesPreview, ToolsSection, CtaSection components */}
    </>
  );
};

export default Index;
