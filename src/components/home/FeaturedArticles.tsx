import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ArticleCard from "@/components/ui/article-card";

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



  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="mb-4">Populiariausios <span className="gradient-text">publikacijos</span></h2>
          <p className="max-w-2xl mx-auto">
            Naujausios ir populiariausios publikacijos apie dirbtinį intelektą ir jo pritaikymą
          </p>
        </div>
        
        {loading ? (
          <div className="text-center">Kraunami straipsniai...</div>
        ) : articles.length > 0 ? (
          <div className="articles-grid">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center">
            <p>Šiuo metu nėra populiarių straipsnių</p>
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link to="/publikacijos">
            <Button className="button-outline">Visos publikacijos</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedArticles;
