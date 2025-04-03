import { useState, useEffect } from 'react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Facebook, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import LazyImage from "@/components/ui/lazy-image";
import { Badge } from "@/components/ui/badge";
import { Tables } from "@/integrations/supabase/types";

type Publication = Tables<"articles">;

const PublicationsPage = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
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
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Visos kategorijos" || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  const shareFacebook = (slug: string) => {
    const url = `https://ponasobuolys.lt/publikacijos/${slug}`;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  return (
    <>
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
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
                    onClick={() => setSelectedCategory(category)}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPublications.map((item) => (
                <Card key={item.id} className="article-card flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-sm text-gray-500">
                        {new Date(item.date).toLocaleDateString('lt-LT')} · {item.read_time}
                      </div>
                      {item.content_type && (
                        <Badge 
                          variant={item.content_type === 'Naujiena' ? "destructive" : "secondary"}
                          className="ml-auto"
                        >
                          {item.content_type}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    {item.image_url ? (
                      <div className="h-40 overflow-hidden rounded-md">
                        <LazyImage 
                          src={item.image_url} 
                          alt={item.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-40 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                        Publikacijos nuotrauka
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Link to={`/publikacijos/${item.slug}`}>
                      <Button className="button-primary">Skaityti daugiau</Button>
                    </Link>
                    <Button 
                      onClick={() => shareFacebook(item.slug)} 
                      className="bg-[#1877F2] text-white hover:bg-[#1877F2]/90"
                      size="icon"
                    >
                      <Facebook className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
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
