import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SocialShare } from "@/components/ui/social-share";
import { supabase } from "@/integrations/supabase/client";
import LazyImage from "@/components/ui/lazy-image";

const FeaturedArticles = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedArticles = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('published', true)
          .eq('featured', true)
          .order('date', { ascending: false })
          .limit(3);
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setArticles(data);
        }
      } catch (error) {
        console.error("Error fetching featured articles:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeaturedArticles();
  }, []);

  const getShareUrl = (slug: string) => {
    return `https://ponasobuolys.lt/publikacijos/${slug}`;
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="mb-4">Populiariausi <span className="gradient-text">straipsniai</span></h2>
          <p className="max-w-2xl mx-auto">
            Naujausi ir populiariausi straipsniai apie dirbtinį intelektą ir jo pritaikymą
          </p>
        </div>
        
        {loading ? (
          <div className="text-center">Kraunami straipsniai...</div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Card key={article.id} className="article-card">
                <CardHeader>
                  <div className="mb-2 text-sm text-gray-500">
                    {new Date(article.date).toLocaleDateString('lt-LT')} · {article.read_time} skaitymo
                  </div>
                  <CardTitle className="text-xl">{article.title}</CardTitle>
                  <CardDescription>{article.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {article.image_url ? (
                    <div className="h-40 overflow-hidden rounded-md">
                      <LazyImage 
                        src={article.image_url} 
                        alt={article.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-40 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                      Straipsnio nuotrauka
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <Link to={`/publikacijos/${article.slug}`}>
                    <Button className="button-primary">Skaityti daugiau</Button>
                  </Link>
                  <SocialShare 
                    url={getShareUrl(article.slug)}
                    title={article.title}
                    description={article.description}
                    showCopyLink={false}
                  />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <p>Šiuo metu nėra populiarių straipsnių</p>
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link to="/publikacijos">
            <Button className="button-outline">Visi straipsniai</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedArticles;
