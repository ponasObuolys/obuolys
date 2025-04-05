import { useState, useEffect } from 'react';
// import { Button } from "@/components/ui/button"; // Komentuojama, nes bus perkelta
// import { Input } from "@/components/ui/input"; // Komentuojama, nes bus perkelta
// import { Search } from "lucide-react"; // Komentuojama, nes bus perkelta
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ToolCard from '@/components/ui/tool-card';
// Importuojame naujus komponentus
import ToolSearch from '@/components/tools/ToolSearch';
import ToolCategories from '@/components/tools/ToolCategories';

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
          setFilteredTools(data); // Iš pradžių rodomi visi įrankiai
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
        (tool.description && tool.description.toLowerCase().includes(searchQuery.toLowerCase())) || // Pridėtas description tikrinimas
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
        <div className="full-width-container px-4">
          <div className="text-center mb-12">
            <h1 className="mb-4"><span className="gradient-text">AI Įrankiai</span></h1>
            <p className="max-w-2xl mx-auto">
              Išbandykite šiuos dirbtinio intelekto įrankius ir padidinkite savo produktyvumą
            </p>
          </div>
          
          {/* Paieškos ir kategorijų sekcija */}
          <div className="mb-12 max-w-3xl mx-auto space-y-6">
            {/* Paieškos komponentas */}
            <ToolSearch 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery} 
            />
            
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
              <p className="text-xl text-gray-500">Kraunami įrankiai...</p>
            </div>
          ) : filteredTools.length > 0 ? (
            <div className="tools-grid">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">Pagal paieškos kriterijus įrankių nerasta</p>
            </div>
          )}
          
          {/* Apie rekomendacijas sekcija */}
          <div className="mt-16 bg-slate-50 dark:bg-slate-900 rounded-lg p-8 shadow">
            <h2 className="text-2xl font-bold mb-4">Apie įrankių rekomendacijas</h2>
            <p className="mb-6 text-muted-foreground">
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
