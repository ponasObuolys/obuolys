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
    const fetchLatestArticles = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .eq("published", true)
          .order("date", { ascending: false })
          .limit(3);

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

    fetchLatestArticles();
  }, [handleError]);

  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mb-8 md:mb-12 text-center">
          <h2 className="mb-3">
            Naujausios <span className="gradient-text">AI naujienos</span>
          </h2>
          <p className="text-foreground/90">
            Šviežiausios publikacijos apie dirbtinį intelektą ir jo pritaikymą
          </p>
        </div>

        {loading ? (
          <div className="text-center">Kraunami straipsniai...</div>
        ) : articles.length > 0 ? (
          <div className="articles-grid">
            {articles.map(article => (
              <ArticleCard 
                key={article.id} 
                article={article} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center">
            <p>Šiuo metu nėra publikuotų straipsnių</p>
          </div>
        )}

        <div className="mt-8 md:mt-12">
          <Link to="/publikacijos" className="block w-full sm:w-auto">
            <Button className="button-outline w-full sm:w-auto">Visos publikacijos</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedArticles;
