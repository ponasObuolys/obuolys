import { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import ArticleCard from "@/components/ui/article-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Search, Plus } from "lucide-react";

import SEOHead from "@/components/SEO";
import { SITE_CONFIG } from "@/utils/seo";
import { BusinessSolutionsCTA } from "@/components/cta/business-solutions-cta";
import { ListSkeleton } from "@/components/ui/content-skeleton";

type Publication = Tables<"articles">;

const PublicationsPage = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Visos kategorijos");
  const { toast } = useToast();

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
        toast({
          title: "Klaida",
          description: `Nepavyko gauti publikacijų. Bandykite vėliau. (klaida: ${errorMessage})`,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPublications();
  }, [toast]);

  const filteredPublications = publications.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory =
      selectedCategory === "Visos kategorijos" || 
      (item.category && item.category.includes(selectedCategory));

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <SEOHead
        title="AI Naujienos ir Publikacijos"
        description="Naujausios dirbtinio intelekto naujienos ir straipsniai lietuvių kalba. Sužinokite paskutines AI tendencijas, naujoves ir analizę - ponas Obuolys"
        canonical={`${SITE_CONFIG.domain}/publikacijos`}
        keywords={['AI naujienos Lietuva', 'dirbtinio intelekto naujienos', 'AI straipsniai lietuviškai', 'ChatGPT naujienos', 'machine learning naujienos']}
        type="website"
      />
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="dark-card mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-2 h-2 rounded-full bg-foreground/40"></span>
                    <span className="text-sm text-foreground/60">AI Naujienos</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-left">
                    AI Naujienos ir Publikacijos
                  </h1>
                  <p className="text-xl text-foreground/80 max-w-2xl text-left">
                    Svarbiausios AI naujienos, analizės ir straipsniai apie dirbtinio intelekto tendencijas Lietuvoje ir pasaulyje.
                  </p>
                </div>
                <Link to="/kontaktai?type=AI_NAUJIENA" className="w-full sm:w-auto">
                  <Button className="button-primary flex items-center justify-center gap-2 w-full sm:w-auto">
                    <Plus className="w-4 h-4" />
                    Pasiūlyti naujieną
                  </Button>
                </Link>
              </div>
            </div>

            {/* Search and filters */}
            <div className="mb-8">
              {/* Paieškos laukelis */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/60 h-4 w-4 pointer-events-none z-10" />
                <Input
                  placeholder="Ieškoti AI naujienų..."
                  className="pl-10 bg-card border-border text-foreground placeholder:text-foreground/50 h-10"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Inline CTA viršuje */}
              <div className="mb-4">
                <BusinessSolutionsCTA variant="inline" context="publications" />
              </div>
              
              {/* Kategorijų filtrai */}
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant="outline"
                    size="sm"
                    className={`${
                      selectedCategory === category
                        ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                        : "button-outline"
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {loading ? (
              <ListSkeleton count={6} />
            ) : filteredPublications.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPublications.map((item, index) => (
                  <Fragment key={item.id}>
                    <ArticleCard article={item} />
                    {/* CTA kas 6 straipsniai */}
                    {(index + 1) % 6 === 0 && index !== filteredPublications.length - 1 && (
                      <div className="md:col-span-2 lg:col-span-3">
                        <BusinessSolutionsCTA variant="inline" context="publications" />
                      </div>
                    )}
                  </Fragment>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="dark-card">
                  <p className="text-xl text-foreground/60 mb-4">Pagal jūsų paiešką AI naujienų nerasta</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      className="button-outline"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("Visos kategorijos");
                      }}
                    >
                      Išvalyti paiešką
                    </Button>
                    <Link to="/kontaktai">
                      <Button className="button-primary flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Pasiūlyti naujieną
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Business Solutions CTA */}
            <div className="mt-16">
              <BusinessSolutionsCTA context="publications" centered />
            </div>

            {/* Call to action section */}
            <div className="mt-12">
              <div className="dark-card text-center">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Turite įdomią AI naujieną?
                </h2>
                <p className="text-xl text-foreground/80 mb-8 max-w-2xl mx-auto">
                  Pasidalinkite su lietuvių AI bendruomene! Siųskite savo pasiūlymus ir padėkite formuoti AI diskursą Lietuvoje.
                </p>
                <Link to="/kontaktai?type=AI_NAUJIENA" className="w-full sm:w-auto">
                  <Button className="button-primary flex items-center justify-center gap-2 w-full sm:w-auto mx-auto">
                    <Plus className="w-5 h-5" />
                    Pasiūlyti AI naujieną
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PublicationsPage;
