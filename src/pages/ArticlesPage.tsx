import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import ArticleCard from "@/components/ui/article-card";

type Article = Database['public']['Tables']['articles']['Row'];

import { Helmet } from 'react-helmet-async';

const PublicationsPage = () => {
  const [publications, setPublications] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Visos kategorijos");
  const { toast } = useToast();
  
  // Get unique categories from publications
  const categories = ['Visos kategorijos', 
    ...Array.from(new Set(publications.map(item => item.category)))
  ];
  
  useEffect(() => {
    const fetchPublications = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('published', true)
          .order('date', { ascending: false });
          
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
          description: "Nepavyko gauti publikacijų. Bandykite vėliau.",
          variant: "destructive"
        });
        console.error("Error fetching publications:", errorMessage);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPublications();
  }, [toast]);
  
  const filteredPublications = publications.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Visos kategorijos" || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  


  return (
    <>
      <Helmet>
        <title>Straipsniai | Ponas Obuolys</title>
        <meta name="description" content="Visi dirbtinio intelekto straipsniai, AI naujienos ir publikacijos lietuvių kalba. Skaitykite naujausius Ponas Obuolys straipsnius!" />
        <meta property="og:title" content="Straipsniai | Ponas Obuolys" />
        <meta property="og:description" content="Visi dirbtinio intelekto straipsniai, AI naujienos ir publikacijos lietuvių kalba. Skaitykite naujausius Ponas Obuolys straipsnius!" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ponasobuolys.lt/straipsniai" />
        <meta property="og:image" content="https://ponasobuolys.lt/og-cover.jpg" />
      </Helmet>
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="mb-4"><span className="gradient-text">Publikacijos</span></h1>
            <p className="max-w-2xl mx-auto">
              Visi naujausi AI straipsniai ir publikacijos iš Ponas Obuolys komandos.
            </p>
          </div>
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Ieškoti publikacijų..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="inline-flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  className={`${
                    selectedCategory === category 
                      ? 'bg-primary text-white hover:bg-primary/90' 
                      : 'bg-white text-secondary hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">Kraunamos publikacijos...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPublications.length === 0 ? (
                <div className="col-span-full text-center text-gray-500">Nerasta publikacijų pagal pasirinktus filtrus.</div>
              ) : (
                filteredPublications.map((item) => (
                  <ArticleCard key={item.id} article={item} />
                ))
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default PublicationsPage;
