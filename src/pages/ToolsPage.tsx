import { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import ToolCard from "@/components/ui/tool-card";
import { ToolCardSkeleton } from "@/components/ui/tool-card-skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";

import SEOHead from "@/components/SEO";
import { SITE_CONFIG } from "@/utils/seo";

// Importuojame naujus komponentus
import ToolCategories from "@/components/tools/ToolCategories";
import ToolSearch from "@/components/tools/ToolSearch";

import { BusinessSolutionsCTA } from "@/components/cta/business-solutions-cta";
import { useTools } from "@/hooks/useSupabaseData";

const ToolsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { toast } = useToast();

  // Naudojame React Query hook vietoj useState + useEffect
  const { data: tools = [], isLoading: loading, error } = useTools();

  // Rodome klaidos pranešimą jei įvyko klaida (useEffect išvengia infinite loop)
  useEffect(() => {
    if (error) {
      toast({
        title: "Klaida",
        description: "Nepavyko gauti įrankių. Bandykite vėliau.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Filtruojame įrankius pagal paiešką ir kategoriją (computed value)
  const filteredTools = tools.filter((tool) => {
    // Filter by search query
    if (searchQuery) {
      const matchesSearch =
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tool.description && tool.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        tool.category.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;
    }

    // Filter by category
    if (selectedCategory && tool.category !== selectedCategory) {
      return false;
    }

    return true;
  });

  // Get unique categories
  const categories = [...new Set(tools.map(tool => tool.category))];

  return (
    <>
      <SEOHead
        title="AI Įrankiai"
        description="Atrinkti ir išbandyti dirbtinio intelekto įrankiai produktyvumui, kūrybai ir verslui. Praktinės rekomendacijos ir apžvalgos - ponas Obuolys"
        canonical={`${SITE_CONFIG.domain}/irankiai`}
        keywords={[
          "AI įrankiai",
          "dirbtinio intelekto įrankiai",
          "ChatGPT įrankiai",
          "AI produktyvumui",
          "AI verslui",
        ]}
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
                    <span className="text-sm text-foreground/60">AI Įrankiai</span>
                  </div>

                  <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-left">
                    Atrinkti AI sprendimai
                  </h1>

                  <p className="text-xl text-foreground/80 max-w-2xl text-left">
                    Asmeniškai išbandyti ir atrinkti dirbtinio intelekto įrankiai, kurie padės
                    padidinti produktyvumą ir efektyvumą jūsų veikloje.
                  </p>
                </div>
                <Link to="/kontaktai?type=AI_IRANKIS" className="w-full sm:w-auto">
                  <Button className="button-primary flex items-center justify-center gap-2 w-full sm:w-auto">
                    <Plus className="w-4 h-4" />
                    Pasiūlyti įrankį
                  </Button>
                </Link>
              </div>
            </div>

            {/* Paieškos ir kategorijų sekcija */}
            <div className="mb-12">
              {/* Paieška ir kategorijos */}
              <div className="mb-8">
                <ToolSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

                {/* Inline CTA viršuje */}
                <div className="mt-4">
                  <BusinessSolutionsCTA variant="inline" context="tools" />
                </div>

                <div className="mt-4">
                  <ToolCategories
                    categories={categories}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                  />
                </div>
              </div>
            </div>

            {/* Įrankių sąrašas */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <ToolCardSkeleton key={index} />
                ))}
              </div>
            ) : filteredTools.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTools.map((tool, index) => (
                  <Fragment key={tool.id}>
                    <ToolCard tool={tool} />
                    {/* CTA kas 6 įrankiai */}
                    {(index + 1) % 6 === 0 && index !== filteredTools.length - 1 && (
                      <div className="md:col-span-2 lg:col-span-3">
                        <BusinessSolutionsCTA variant="inline" context="tools" />
                      </div>
                    )}
                  </Fragment>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="dark-card">
                  <p className="text-xl text-foreground/60 mb-4">
                    Pagal paieškos kriterijus įrankių nerasta
                  </p>
                  <p className="text-foreground/50">
                    Pabandykite pakeisti paieškos žodžius arba kategoriją
                  </p>
                </div>
              </div>
            )}

            {/* Business Solutions CTA */}
            <div className="mt-16">
              <BusinessSolutionsCTA context="tools" centered />
            </div>

            {/* Apie rekomendacijas sekcija */}
            <div className="mt-12">
              <div className="dark-card">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Apie įrankių rekomendacijas
                </h2>
                <p className="text-foreground/80 mb-6 leading-relaxed">
                  Visi rekomenduojami įrankiai yra asmeniškai išbandyti ir atrinkti pagal jų
                  naudingumą, kokybę ir vartotojo patirtį. Kai kurios nuorodos gali būti
                  partnerinės, už kurias gaunamas komisinis mokestis, jei nuspręsite įsigyti įrankį
                  ar paslaugą.
                </p>
                <p className="text-foreground/70">
                  Tačiau tai neturi įtakos mūsų rekomendacijoms ir nuomonei apie įrankius. Visada
                  stengiuosi pateikti objektyvią ir naudingą informaciją apie AI sprendimus.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ToolsPage;
