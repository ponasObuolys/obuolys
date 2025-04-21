
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
        <title>Ponas Obuolys – Dirbtinio intelekto naujienos, AI įrankiai, kursai ir straipsniai lietuvių kalba</title>
        <meta name="description" content="Atraskite įdomiausias AI naujienas, dirbtinio intelekto įrankius, kursus ir straipsnius lietuvių kalba. Nemokamos rekomendacijos ir patarimai apie AI Lietuvoje." />
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
