import { useState, useEffect } from 'react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExternalLink, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import LazyImage from '@/components/ui/lazy-image';

const ToolsPage = () => {
  const [tools, setTools] = useState<any[]>([]);
  const [filteredTools, setFilteredTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchTools = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('tools')
          .select('*')
          .eq('published', true);
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setTools(data);
          setFilteredTools(data);
        }
      } catch (error: any) {
        toast({
          title: "Klaida",
          description: "Nepavyko gauti įrankių. Bandykite vėliau.",
          variant: "destructive"
        });
        console.error("Error fetching tools:", error.message);
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
      result = result.filter(tool => 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="mb-4"><span className="gradient-text">AI Įrankiai</span></h1>
            <p className="max-w-2xl mx-auto">
              Išbandykite šiuos dirbtinio intelekto įrankius ir padidinkite savo produktyvumą
            </p>
          </div>
          
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Ieškoti įrankių..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  onClick={() => setSelectedCategory(null)}
                  className="px-3 py-1 h-auto"
                >
                  Visi
                </Button>
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                    className="px-3 py-1 h-auto"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">Kraunami įrankiai...</p>
            </div>
          ) : filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTools.map((tool) => (
                <Card key={tool.id} className="flex flex-col h-full custom-card">
                  {tool.image_url && (
                    <div className="aspect-video w-full overflow-hidden">
                      <LazyImage
                        src={tool.image_url}
                        alt={tool.name}
                        className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="mb-2 text-xs font-medium py-1 px-2 rounded-full bg-primary/10 text-primary inline-block">
                      {tool.category}
                    </div>
                    <CardTitle className="text-xl">{tool.name}</CardTitle>
                    <CardDescription>{tool.short_description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm">{tool.description}</p>
                  </CardContent>
                  <CardFooter>
                    <a 
                      href={tool.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-full"
                    >
                      <Button className="w-full button-secondary flex items-center justify-center">
                        <span>Išbandyti</span>
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </a>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">Pagal paieškos kriterijus įrankių nerasta</p>
            </div>
          )}
          
          <div className="mt-16 bg-white rounded-lg p-8 shadow">
            <h2 className="text-2xl font-bold mb-4">Apie įrankių rekomendacijas</h2>
            <p className="mb-6">
              Visi rekomenduojami įrankiai yra asmeniškai išbandyti ir atrinkti pagal jų naudingumą, 
              kokybę ir vartotojo patirtį. Kai kurios nuorodos gali būti partnerinės, už kurias 
              gaunamas komisinis mokestis, jei nuspręsite įsigyti įrankį ar paslaugą. Tačiau tai 
              neturi įtakos mūsų rekomendacijoms ir nuomonei apie įrankius.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default ToolsPage;
