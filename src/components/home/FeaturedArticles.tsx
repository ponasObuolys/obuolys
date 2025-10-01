import ArticleCard from "@/components/ui/article-card";
import { Button } from "@/components/ui/button";
import { useSupabaseErrorHandler } from "@/hooks/useErrorHandler";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Article = Database["public"]["Tables"]["articles"]["Row"];

const FeaturedArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const { handleError } = useSupabaseErrorHandler({
    componentName: "FeaturedArticles",
    showToast: true,
  });

  useEffect(() => {
    // Funkcija nustatyti kiek rodyti pagal lango dydį
    const getLimit = () => (window.matchMedia("(min-width: 1024px)").matches ? 3 : 4);

    const fetchFeaturedArticles = async () => {
      try {
        setLoading(true);
        const limit = getLimit();
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .eq("published", true)
          .eq("featured", true)
          .order("date", { ascending: false })
          .limit(limit);

        if (error) {
          throw error;
        }

        if (data) {
          setArticles(data);
        }
      } catch (error) {
        handleError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedArticles();

    // Reaguok į lango dydžio pokytį
    const handleResize = () => fetchFeaturedArticles();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleError]);

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="mb-4">
            Populiariausios <span className="gradient-text">AI naujienos</span>
          </h2>
          <p className="max-w-2xl mx-auto text-foreground/80">
            Naujausios ir populiariausios publikacijos apie dirbtinį intelektą ir jo pritaikymą
          </p>
        </div>

        {loading ? (
          <div className="text-center">Kraunami straipsniai...</div>
        ) : articles.length > 0 ? (
          <div className="articles-grid">
            {articles.map(article => (
              <ArticleCard 
                key={article.id} 
                article={{
                  ...article,
                  image_url: article.image_url ?? undefined
                }} 
              />
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
