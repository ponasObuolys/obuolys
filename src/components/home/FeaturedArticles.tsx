import ArticleCard from "@/components/ui/article-card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { useFeaturedArticles } from "@/hooks/useSupabaseData";
import { useEffect } from "react";

const FeaturedArticles = () => {
  const { toast } = useToast();

  // Naudojame React Query hook vietoj useState + useEffect
  const { data: articles = [], isLoading: loading, error } = useFeaturedArticles();

  // Rodome klaidos pranešimą jei įvyko klaida (useEffect išvengia infinite loop)
  useEffect(() => {
    if (error) {
      toast({
        title: "Klaida",
        description: "Nepavyko gauti naujausių publikacijų. Bandykite vėliau.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

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
              <ArticleCard key={article.id} article={article} />
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
