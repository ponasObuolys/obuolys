
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Facebook, ArrowLeft, Clock, Calendar } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        
        if (!slug) return;
        
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .single();
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setArticle(data);
        }
      } catch (error: any) {
        toast({
          title: "Klaida",
          description: "Nepavyko gauti straipsnio informacijos. Bandykite vėliau.",
          variant: "destructive"
        });
        console.error("Error fetching article:", error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticle();
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
  
  if (!article) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Straipsnis nerastas</h1>
          <p className="mb-6">Atsiprašome, bet ieškomas straipsnis neegzistuoja.</p>
          <Link to="/straipsniai">
            <Button className="button-primary">Grįžti į straipsnių sąrašą</Button>
          </Link>
        </div>
      </Layout>
    );
  }
  
  const shareFacebook = () => {
    const url = `https://ponasobuolys.lt/straipsniai/${slug}`;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  return (
    <Layout>
      <article className="container mx-auto px-4 py-12">
        <Link to="/straipsniai" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span>Grįžti į straipsnių sąrašą</span>
        </Link>
        
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs font-medium py-1 px-2 rounded-full bg-primary/10 text-primary">
                {article.category}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>
            
            <div className="flex flex-wrap gap-4 mb-8 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                <span>{new Date(article.date).toLocaleDateString('lt-LT')}</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                <span>{article.read_time} skaitymo</span>
              </div>
              <div>
                Autorius: <span className="font-medium">{article.author}</span>
              </div>
            </div>
            
            <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 mb-8">
              Straipsnio nuotrauka
            </div>
            
            <div className="prose max-w-none mb-8" dangerouslySetInnerHTML={{ __html: article.content }} />
            
            <div className="border-t border-gray-200 pt-6 mt-8">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="font-medium">Dalintis straipsniu:</p>
                <Button 
                  onClick={shareFacebook} 
                  className="bg-[#1877F2] text-white hover:bg-[#1877F2]/90"
                >
                  <Facebook className="mr-2 h-4 w-4" />
                  <span>Dalintis Facebook</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default ArticleDetail;
