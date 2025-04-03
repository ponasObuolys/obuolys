
import Hero from '@/components/home/Hero';
import FeaturedArticles from '@/components/home/FeaturedArticles';
// import AINews from '@/components/home/AINews'; // Removed
import AITools from '@/components/home/AITools';
import Courses from '@/components/home/Courses';
import CallToAction from '@/components/home/CallToAction';
// Removed CoursesPreview, CtaSection, ToolsSection, FeaturesSection imports

const Index = () => {
  return (
    <>
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
