
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AITools = () => {
  const [tools, setTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('tools')
          .select('*')
          .eq('published', true)
          .eq('featured', true)
          .limit(4);
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setTools(data);
        }
      } catch (error) {
        console.error("Error fetching tools:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTools();
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="mb-4">Rekomenduojami <span className="gradient-text">AI įrankiai</span></h2>
          <p className="max-w-2xl mx-auto">
            Išbandykite šiuos dirbtinio intelekto įrankius ir padidinkite savo produktyvumą
          </p>
        </div>
        
        {loading ? (
          <div className="text-center">Kraunami įrankiai...</div>
        ) : tools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool) => (
              <Card key={tool.id} className="custom-card h-full flex flex-col">
                <CardHeader className="pb-2">
                  <div className="mb-2 text-xs font-medium py-1 px-2 rounded-full bg-primary/10 text-primary inline-block">
                    {tool.category}
                  </div>
                  <CardTitle className="text-lg">{tool.name}</CardTitle>
                </CardHeader>
                <CardContent className="py-2 flex-grow">
                  <CardDescription>{tool.description}</CardDescription>
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
          <div className="text-center">
            <p>Šiuo metu nėra rekomenduojamų įrankių</p>
          </div>
        )}
        
        <div className="text-center mt-10">
          <Link to="/irankiai">
            <Button className="button-outline">Daugiau įrankių</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AITools;
