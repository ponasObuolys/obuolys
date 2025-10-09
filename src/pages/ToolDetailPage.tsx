import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
// Importuojama detalės kortelė
import ToolDetailCard from '@/components/ui/tool-detail-card';
import { log } from '@/utils/browserLogger';

import SEOHead from '@/components/SEO';
import { generateToolSEO, generateBreadcrumbStructuredData } from '@/utils/seo';
import { ShareButton } from '@/components/ui/share-button';

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
  const [tool, setTool] = useState<Tool | null>(null);
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
        <p className="text-xl text-gray-200">Kraunama įrankio informacija...</p>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h1 className="text-3xl font-semibold mb-6">Įrankis nerastas</h1>
        <p className="text-gray-200 mb-8">Atsiprašome, bet įrankis, kurio ieškote, neegzistuoja.</p>
        <Link to="/irankiai">
          <Button variant="default">
            <ArrowLeft className="mr-2 h-4 w-4" /> Grįžti į įrankių sąrašą
          </Button>
        </Link>
      </div>
    );
  }

  // Generate SEO data
  const seoData = tool
    ? generateToolSEO({
        title: tool.name,
        description: tool.description,
        slug: slug || '',
        image: tool.image_url,
        category: tool.category,
      })
    : null;

  const structuredData = tool
    ? [
        {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: tool.name,
          description: tool.description,
          applicationCategory: tool.category,
          operatingSystem: 'All',
          image: tool.image_url || 'https://ponasobuolys.lt/og-cover.jpg',
          url: `https://ponasobuolys.lt/irankiai/${tool.slug}`,
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock',
            url: tool.url,
          },
          publisher: {
            '@type': 'Organization',
            name: 'Ponas Obuolys',
            logo: {
              '@type': 'ImageObject',
              url: 'https://ponasobuolys.lt/logo.png',
            },
          },
          inLanguage: 'lt',
        },
        generateBreadcrumbStructuredData([
          { name: 'Pradžia', url: 'https://ponasobuolys.lt' },
          { name: 'AI Įrankiai', url: 'https://ponasobuolys.lt/irankiai' },
          { name: tool.name, url: `https://ponasobuolys.lt/irankiai/${slug}` },
        ]),
      ]
    : null;

  return (
    <>
      {seoData && <SEOHead {...seoData} structuredData={structuredData || undefined} />}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <div className="mb-8 flex items-center justify-between">
            <Link to="/irankiai">
              <Button variant="outline" className="group flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
                <span>Grįžti į įrankių sąrašą</span>
              </Button>
            </Link>

            <ShareButton
              title={tool.name}
              description={tool.description}
              url={`https://ponasobuolys.lt/irankiai/${slug}`}
              imageUrl={tool.image_url}
              variant="outline"
              size="default"
            />
          </div>

          {/* Naudojamas ToolDetailCard komponentas */}
          <ToolDetailCard tool={tool} />
        </div>
      </section>
    </>
  );
};

export default ToolDetailPage; 