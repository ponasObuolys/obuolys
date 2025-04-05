import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
// Importuojama detalės kortelė
import ToolDetailCard from '@/components/ui/tool-detail-card'; 
// Definuojame Tool tipą čia, kad atitiktų ToolDetailCard
interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string;
  url: string;
  image_url?: string;
  category: string;
  pros?: string[];
  cons?: string[];
  usage_examples?: string[];
}

const ToolDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [tool, setTool] = useState<Tool | null>(null); // Naudojamas Tool tipas
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTool = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('tools')
          .select('*') // Galima specifikuoti reikiamus stulpelius
          .eq('slug', slug)
          .single(); 
          
        if (error) {
          // Jei .single() grąžina klaidą (pvz., nerasta arba daugiau nei vienas)
          console.error("Error fetching tool (or not found):", error.message);
          throw new Error("Įrankis nerastas arba įvyko klaida.");
        }
        
        if (data) {
          // Čia galėtume validuoti duomenis pagal Tool tipą, jei reikia
          setTool(data as Tool);
        } else {
          // Šis blokas teoriškai neturėtų būti pasiektas, jei .single() veikia teisingai
          throw new Error("Įrankis nerastas.");
        }
      } catch (error: any) {
        toast({
          title: "Klaida",
          description: error.message || "Nepavyko gauti įrankio informacijos.",
          variant: "destructive"
        });
        setTool(null); // Nustatome į null klaidos atveju
        console.error("Error fetching tool details:", error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTool();
  }, [slug, toast]);

  if (loading) {
    return (
      <div className="full-width-container py-16 text-center">
        {/* Galima pridėti spinnerį */}
        <p className="text-xl text-muted-foreground">Kraunama įrankio informacija...</p>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="full-width-container py-16 text-center">
        <h1 className="text-3xl font-semibold mb-6">Įrankis nerastas</h1>
        <p className="text-muted-foreground mb-8">Atsiprašome, bet įrankis, kurio ieškote, neegzistuoja.</p>
        <Link to="/irankiai">
          <Button variant="default">
            <ArrowLeft className="mr-2 h-4 w-4" /> Grįžti į įrankių sąrašą
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <section className="py-12 md:py-16">
      <div className="full-width-container px-4 max-w-4xl"> {/* Sumažintas konteinerio plotis */} 
        <div className="mb-8">
          <Link to="/irankiai">
            <Button variant="outline" className="mb-8 group flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" /> 
              <span>Grįžti į įrankių sąrašą</span>
            </Button>
          </Link>
        </div>

        {/* Naudojamas ToolDetailCard komponentas */} 
        <ToolDetailCard tool={tool} />
        
      </div>
    </section>
  );
};

export default ToolDetailPage; 