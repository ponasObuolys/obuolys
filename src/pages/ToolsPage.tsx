
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ToolsPage = () => {
  const [tools, setTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Visos kategorijos");
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchTools = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('tools')
          .select('*')
          .eq('published', true)
          .order('name', { ascending: true });
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setTools(data);
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
  
  // Get unique categories from tools
  const categories = ['Visos kategorijos', 
    ...Array.from(new Set(tools.map(tool => tool.category)))
  ];
  
  const filteredTools = tools.filter(tool => {
    const matchesSearch = 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "Visos kategorijos" || tool.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="mb-4"><span className="gradient-text">AI įrankiai</span></h1>
            <p className="max-w-2xl mx-auto">
              Išbandykite šiuos dirbtinio intelekto įrankius ir padidinkite savo produktyvumą
            </p>
          </div>
          
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Ieškoti įrankių..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="inline-flex flex-wrap gap-2">
                <Filter className="h-5 w-5 text-gray-500" />
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
              <p className="text-xl text-gray-500">Kraunami įrankiai...</p>
            </div>
          ) : filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTools.map((tool) => (
                <Card key={tool.id} className="custom-card h-full flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="mb-2 text-xs font-medium py-1 px-2 rounded-full bg-primary/10 text-primary inline-block">
                      {tool.category}
                    </div>
                    <CardTitle className="text-lg">{tool.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2 flex-grow">
                    <CardDescription className="mb-4">{tool.description}</CardDescription>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <a href={tool.url} target="_blank" rel="noopener noreferrer" className="w-full">
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
              <p className="text-xl text-gray-500">
                {searchQuery || selectedCategory !== "Visos kategorijos" ? 
                  "Pagal jūsų paiešką įrankių nerasta" : 
                  "Šiuo metu įrankių nėra"}
              </p>
              {(searchQuery || selectedCategory !== "Visos kategorijos") && (
                <Button 
                  className="mt-4 button-outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("Visos kategorijos");
                  }}
                >
                  Išvalyti paiešką
                </Button>
              )}
            </div>
          )}
          
          <div className="mt-12 bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-bold mb-4">Apie įrankių rekomendacijas</h2>
            <p className="mb-4">
              Visi šiame puslapyje pristatomi įrankiai yra asmeniškai išbandyti ir rekomenduojami. 
              Kai kurios nuorodos gali būti partnerių nuorodos, o tai reiškia, kad galiu gauti komisinius, 
              jei nuspręsite įsigyti įrankį per mano nuorodą (jums tai nekainuoja papildomai).
            </p>
            <p>
              Tai padeda išlaikyti šią svetainę ir toliau teikti naudingą informaciją apie dirbtinį intelektą.
              Visada rekomenduoju tik tuos įrankius, kuriais pats naudojuosi ir vertinu.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ToolsPage;
