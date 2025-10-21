import ArticleCard from "@/components/ui/article-card";
import { ArticleCardSkeleton } from "@/components/ui/article-card-skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

type Article = Database["public"]["Tables"]["articles"]["Row"];

import { useSupabaseErrorHandler } from "@/hooks/useErrorHandler";
import { Helmet } from "react-helmet-async";

const PublicationsPage = () => {
  const [publications, setPublications] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Visos kategorijos");
  const { toast } = useToast();
  const { handleError } = useSupabaseErrorHandler({
    componentName: "ArticlesPage",
    showToast: false,
  });

  // Get unique categories from publications (flatten arrays)
  const categories = [
    "Visos kategorijos",
    ...Array.from(new Set(publications.flatMap(item => item.category || []))),
  ];

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .eq("published", true)
          .order("date", { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          setPublications(data);
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Nepavyko gauti publikacijų";
        const err = error instanceof Error ? error : new Error(errorMessage);
        handleError(err);
        toast({
          title: "Klaida",
          description: "Nepavyko gauti publikacijų. Bandykite vėliau.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPublications();
  }, [handleError, toast]);

  const filteredPublications = publications.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Visos kategorijos" || 
      (item.category && item.category.includes(selectedCategory));

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Helmet>
        <title>Straipsniai | Ponas Obuolys</title>
        <meta
          name="description"
          content="Visi dirbtinio intelekto straipsniai, AI naujienos ir publikacijos lietuvių kalba. Skaitykite naujausius Ponas Obuolys straipsnius!"
        />
        <meta property="og:title" content="Straipsniai | Ponas Obuolys" />
        <meta
          property="og:description"
          content="Visi dirbtinio intelekto straipsniai, AI naujienos ir publikacijos lietuvių kalba. Skaitykite naujausius Ponas Obuolys straipsnius!"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ponasobuolys.lt/straipsniai" />
        <meta property="og:image" content="https://ponasobuolys.lt/og-cover.jpg" />
      </Helmet>
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="mb-4">
                <span className="gradient-text">Publikacijos</span>
              </h1>
              <p className="max-w-2xl mx-auto">
                Visi naujausi AI straipsniai ir publikacijos iš Ponas Obuolys komandos.
              </p>
            </div>
          <div className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Ieškoti publikacijų..."
                className="pl-10"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="inline-flex flex-wrap gap-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant="outline"
                  className={`${
                    selectedCategory === category
                      ? "bg-primary text-white hover:bg-primary/90"
                      : "bg-card text-foreground hover:bg-muted"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <ArticleCardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPublications.length === 0 ? (
                <div className="col-span-full text-center text-foreground/90">
                  Nerasta publikacijų pagal pasirinktus filtrus.
                </div>
              ) : (
                filteredPublications.map(item => <ArticleCard key={item.id} article={item} />)
              )}
            </div>
          )}
          </div>
        </div>
      </section>
    </>
  );
};

export default PublicationsPage;
