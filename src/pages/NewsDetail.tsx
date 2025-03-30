import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { addLazyLoadingToImages } from '@/utils/lazyLoadImages';
import useLazyImages from '@/hooks/useLazyImages';
import { extractImagesFromHTML, preloadImagesWhenIdle } from '@/utils/imagePreloader';
import LazyImage from '@/components/ui/lazy-image';

const NewsDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [news, setNews] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Apply lazy loading to images in the news content
  useLazyImages(contentRef);
  
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        
        if (!slug) return;
        
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .single();
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setNews(data);
          
          // Preload images from news content when browser is idle
          if (data.content) {
            const imageUrls = extractImagesFromHTML(data.content);
            preloadImagesWhenIdle(imageUrls);
          }
        }
      } catch (error: any) {
        toast({
          title: "Klaida",
          description: "Nepavyko gauti naujienos informacijos. Bandykite vėliau.",
          variant: "destructive"
        });
        console.error("Error fetching news:", error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNews();
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [slug, toast]);
  
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <p>Kraunama...</p>
        </div>
      </Layout>
    );
  }
  
  if (!news) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Naujiena nerasta</h1>
          <p className="mb-6">Atsiprašome, bet ieškoma naujiena neegzistuoja.</p>
          <Link to="/naujienos">
            <Button className="button-primary">Grįžti į naujienų sąrašą</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="container mx-auto px-4 py-12">
        <Link to="/naujienos" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span>Grįžti į naujienų sąrašą</span>
        </Link>
        
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{news.title}</h1>
            
            <div className="flex flex-wrap gap-4 mb-8 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                <span>{new Date(news.date).toLocaleDateString('lt-LT')}</span>
              </div>
              <div>
                Autorius: <span className="font-medium">{news.author}</span>
              </div>
            </div>
            
            {news.image_url ? (
              <div className="mb-8 rounded-md overflow-hidden">
                <LazyImage 
                  src={news.image_url} 
                  alt={news.title} 
                  className="w-full h-auto"
                />
              </div>
            ) : (
              <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 mb-8">
                Naujienos nuotrauka
              </div>
            )}
            
            <div 
              ref={contentRef}
              className="prose max-w-none mb-8" 
              dangerouslySetInnerHTML={{ __html: addLazyLoadingToImages(news.content) }} 
            />
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default NewsDetail;
