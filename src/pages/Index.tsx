
import Layout from '@/components/layout/Layout';
import Hero from '@/components/home/Hero';
import FeaturedArticles from '@/components/home/FeaturedArticles';
import AINews from '@/components/home/AINews';
import AITools from '@/components/home/AITools';
import Courses from '@/components/home/Courses';
import CallToAction from '@/components/home/CallToAction';

const Index = () => {
  return (
    <Layout>
      <Hero />
      <FeaturedArticles />
      <AINews />
      <AITools />
      <Courses />
      <CallToAction />
    </Layout>
  );
};

export default Index;
