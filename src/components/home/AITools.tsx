import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import LazyImage from '@/components/ui/lazy-image';

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
    <section id="tools" className="py-16 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="gradient-text">Rekomenduojami įrankiai</h2>
          <p className="max-w-2xl mx-auto mt-4">
            Šie dirbtinio intelekto įrankiai padės jums efektyviau dirbti ir kurti
          </p>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <p className="text-xl text-gray-500">Kraunami įrankiai...</p>
          </div>
        ) : tools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool) => (
              <Card key={tool.id} className="flex flex-col h-full custom-card" style={{ minHeight: '400px', maxHeight: '400px' }}>
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
                  <CardTitle className="text-xl h-14 overflow-hidden">{tool.name}</CardTitle>
                  <CardDescription className="h-20 overflow-hidden">{tool.short_description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="text-sm">{tool.category}</div>
                </CardContent>
                <CardFooter>
                  <a 
                    href={tool.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-full"
                  >
                    <Button className="w-full">Išbandyti</Button>
                  </a>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-xl text-gray-500">Šiuo metu rekomenduojamų įrankių nėra</p>
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link to="/irankiai">
            <Button className="button-outline">Daugiau įrankių</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AITools;
