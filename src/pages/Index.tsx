
import Hero from '@/components/home/Hero';
import FeaturedArticles from '@/components/home/FeaturedArticles';
// import AINews from '@/components/home/AINews'; // Removed
import AITools from '@/components/home/AITools';
import Courses from '@/components/home/Courses';
import CallToAction from '@/components/home/CallToAction';
// Removed CoursesPreview, CtaSection, ToolsSection, FeaturesSection imports

import { Helmet } from 'react-helmet-async';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Ponas Obuolys – Dirbtinio intelekto naujienos, įrankiai ir kursai</title>
        <meta name="description" content="Naujausios AI naujienos, įrankiai, kursai ir straipsniai lietuvių kalba. Atraskite dirbtinio intelekto galimybes su Ponas Obuolys!" />
        <meta property="og:title" content="Ponas Obuolys – Dirbtinio intelekto naujienos, įrankiai ir kursai" />
        <meta property="og:description" content="Naujausios AI naujienos, įrankiai, kursai ir straipsniai lietuvių kalba. Atraskite dirbtinio intelekto galimybes su Ponas Obuolys!" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ponasobuolys.lt/" />
        <meta property="og:image" content="https://ponasobuolys.lt/og-cover.jpg" />
      </Helmet>
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
