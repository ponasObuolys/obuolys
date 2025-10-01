import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button"; // Komentuojama, nes bus perkelta
// import { Input } from "@/components/ui/input"; // Komentuojama, nes bus perkelta
// import { Search } from "lucide-react"; // Komentuojama, nes bus perkelta
import ToolCard from "@/components/ui/tool-card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

import SEOHead from "@/components/SEO";
import { SITE_CONFIG } from "@/utils/seo";

type Tool = Database["public"]["Tables"]["tools"]["Row"];
// Importuojame naujus komponentus
import ToolCategories from "@/components/tools/ToolCategories";
import ToolSearch from "@/components/tools/ToolSearch";

import { createErrorReport, reportError } from "@/utils/errorReporting";

const ToolsPage = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTools = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.from("tools").select("*").eq("published", true);

        if (error) {
          throw error;
        }

        if (data) {
          setTools(data);
          setFilteredTools(data); // Iš pradžių rodomi visi įrankiai
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Nepavyko gauti įrankių";
        toast({
          title: "Klaida",
          description: "Nepavyko gauti įrankių. Bandykite vėliau.",
          variant: "destructive",
        });
        const normalizedError = error instanceof Error ? error : new Error(errorMessage);
        const errorReport = createErrorReport(normalizedError, {
          errorBoundary: "ToolsPage",
          additionalData: { operation: "fetchTools" },
        });
        reportError(errorReport);
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, [toast]);

  useEffect(() => {
    let result = tools;

    // Filter by search query
    if (searchQuery) {
      result = result.filter(
        tool =>
          tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (tool.description &&
            tool.description.toLowerCase().includes(searchQuery.toLowerCase())) || // Pridėtas description tikrinimas
          tool.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
      result = result.filter(tool => tool.category === selectedCategory);
    }

    setFilteredTools(result);
  }, [searchQuery, selectedCategory, tools]);

  // Get unique categories
  const categories = [...new Set(tools.map(tool => tool.category))];

  return (
    <>
      <SEOHead
        title="AI Įrankiai"
        description="Atrinkti ir išbandyti dirbtinio intelekto įrankiai produktyvumui, kūrybai ir verslui. Praktinės rekomendacijos ir apžvalgos - ponas Obuolys"
        canonical={`${SITE_CONFIG.domain}/irankiai`}
        keywords={['AI įrankiai', 'dirbtinio intelekto įrankiai', 'ChatGPT įrankiai', 'AI produktyvumui', 'AI verslui']}
        type="website"
      />
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="dark-card mb-8">
              <div className="text-center">
                <div className="flex items-center gap-3 mb-8 justify-center">
                  <span className="w-2 h-2 rounded-full bg-foreground/40"></span>
                  <span className="text-sm text-foreground/60">AI Įrankiai</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  Atrinkti AI sprendimai
                </h1>

                <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
                  Asmeniškai išbandyti ir atrinkti dirbtinio intelekto įrankiai,
                  kurie padės padidinti produktyvumą ir efektyvumą jūsų veikloje.
                </p>
              </div>
            </div>

            {/* Paieškos ir kategorijų sekcija */}
            <div className="mb-12 max-w-3xl mx-auto space-y-6">
              {/* Paieškos komponentas */}
              <ToolSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

              {/* Kategorijų komponentas */}
              <ToolCategories
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
            </div>

            {/* Įrankių sąrašas */}
            {loading ? (
              <div className="text-center py-12">
                <div className="dark-card">
                  <p className="text-xl text-foreground/60">Kraunami įrankiai...</p>
                </div>
              </div>
            ) : filteredTools.length > 0 ? (
              <div className="tools-grid">
                {filteredTools.map(tool => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="dark-card">
                  <p className="text-xl text-foreground/60 mb-4">Pagal paieškos kriterijus įrankių nerasta</p>
                  <p className="text-foreground/50">Pabandykite pakeisti paieškos žodžius arba kategoriją</p>
                </div>
              </div>
            )}

            {/* Apie rekomendacijas sekcija */}
            <div className="mt-16">
              <div className="dark-card">
                <h2 className="text-3xl font-bold text-foreground mb-4">Apie įrankių rekomendacijas</h2>
                <p className="text-foreground/80 mb-6 leading-relaxed">
                  Visi rekomenduojami įrankiai yra asmeniškai išbandyti ir atrinkti pagal jų naudingumą,
                  kokybę ir vartotojo patirtį. Kai kurios nuorodos gali būti partnerinės, už kurias
                  gaunamas komisinis mokestis, jei nuspręsite įsigyti įrankį ar paslaugą.
                </p>
                <p className="text-foreground/70">
                  Tačiau tai neturi įtakos mūsų rekomendacijoms ir nuomonei apie įrankius.
                  Visada stengiuosi pateikti objektyvią ir naudingą informaciją apie AI sprendimus.
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
