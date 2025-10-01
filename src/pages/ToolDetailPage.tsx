import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
// Importuojama detalės kortelė
import ToolDetailCard from '@/components/ui/tool-detail-card';
import { log } from '@/utils/browserLogger'; 

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

import { Helmet } from 'react-helmet-async';

const ToolDetailPage = () => {
  // Helmet žymoms
  const getMetaTitle = () => tool?.name ? `${tool.name} | AI Įrankis | Ponas Obuolys` : 'AI Įrankis | Ponas Obuolys';
  const getMetaDescription = () => tool?.description || 'Rekomenduojamas AI įrankis lietuvių kalba. Sužinokite, kaip šis dirbtinio intelekto sprendimas gali padėti jūsų veikloje.';
  const getMetaImage = () => tool?.image_url || 'https://ponasobuolys.lt/og-cover.jpg';
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
          log.error("Error fetching tool (or not found):", error.message);
          throw new Error("Įrankis nerastas arba įvyko klaida.");
        }
        
        if (data) {
          // Čia galėtume validuoti duomenis pagal Tool tipą, jei reikia
          setTool(data as Tool);
        } else {
          // Šis blokas teoriškai neturėtų būti pasiektas, jei .single() veikia teisingai
          throw new Error("Įrankis nerastas.");
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Nepavyko gauti įrankio informacijos.";
        toast({
          title: "Klaida",
          description: errorMessage,
          variant: "destructive"
        });
        setTool(null); // Nustatome į null klaidos atveju
        log.error("Error fetching tool details:", errorMessage);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTool();
  }, [slug, toast]);

  if (loading) {
    return (
      <div className="container mx-auto py-16 text-center">
        {/* Galima pridėti spinnerį */}
        <p className="text-xl text-muted-foreground">Kraunama įrankio informacija...</p>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="container mx-auto py-16 text-center">
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
    <>
      <Helmet>
        <title>{getMetaTitle()}</title>
        <meta name="description" content={getMetaDescription()} />
        <meta property="og:title" content={getMetaTitle()} />
        <meta property="og:description" content={getMetaDescription()} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://ponasobuolys.lt/irankiai/${tool?.slug || ''}`} />
        <meta property="og:image" content={getMetaImage()} />

        {/* Schema.org SoftwareApplication struktūrizuoti duomenys */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            'name': tool.name,
            'description': tool.description,
            'applicationCategory': tool.category,
            'operatingSystem': 'All',
            'image': tool.image_url || 'https://ponasobuolys.lt/og-cover.jpg',
            'url': `https://ponasobuolys.lt/irankiai/${tool?.slug || ''}`,
            'offers': {
              '@type': 'Offer',
              'price': '0',
              'priceCurrency': 'EUR',
              'availability': 'https://schema.org/InStock',
              'url': tool.url
            },
            'publisher': {
              '@type': 'Organization',
              'name': 'Ponas Obuolys',
              'logo': {
                '@type': 'ImageObject',
                'url': 'https://ponasobuolys.lt/apple-logo.png'
              }
            },
            'inLanguage': 'lt'
          })}
        </script>
      </Helmet>
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 py-8 max-w-3xl"> 
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
    </>
  );
};

export default ToolDetailPage; 