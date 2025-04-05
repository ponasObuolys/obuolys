import { useState, useEffect } from 'react';

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Facebook, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Tables } from "@/integrations/supabase/types";
import ArticleCard from "@/components/ui/article-card";

type Publication = Tables<"articles">;

const PublicationsPage = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Visos kategorijos");
  const { toast } = useToast();
  
  // Get unique categories from publications
  const categories = ['Visos kategorijos', 
    ...Array.from(new Set(publications.map(item => item.category).filter(Boolean)))
  ];
  
  useEffect(() => {
    const fetchPublications = async () => {
      try {
        setLoading(true);
        console.log("Fetching publications from Supabase...");
        
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('published', true)
          .order('date', { ascending: false });
          
        console.log("Published articles fetched:", data ? data.length : 0);
        
        if (error) {
          console.error("Error fetching published articles:", error);
          throw error;
        }
        
        if (data) {
          setPublications(data);
        }
      } catch (error: any) {
        toast({
          title: "Klaida",
          description: "Nepavyko gauti publikacijų. Bandykite vėliau.",
          variant: "destructive"
        });
        console.error("Error fetching publications:", error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPublications();
  }, [toast]);
  
  const filteredPublications = publications.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "Visos kategorijos" || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <>
      <section className="py-12 md:py-16">
        <div className="full-width-container px-4">
          <div className="text-center mb-12">
            <h1 className="mb-4"><span className="gradient-text">Publikacijos</span></h1>
            <p className="max-w-2xl mx-auto">
              Išsamūs straipsniai ir naujienos apie dirbtinį intelektą, jo pritaikymą ir naujas technologijas
            </p>
          </div>
          
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
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
                    onClick={() => setSelectedCategory(category!)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">Kraunamos publikacijos...</p>
            </div>
          ) : filteredPublications.length > 0 ? (
            <div className="articles-grid">
              {filteredPublications.map((item) => (
                <ArticleCard key={item.id} article={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">Pagal jūsų paiešką publikacijų nerasta</p>
              <Button 
                className="mt-4 button-outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("Visos kategorijos");
                }}
              >
                Išvalyti paiešką
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default PublicationsPage;
