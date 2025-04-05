import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ToolCard from '@/components/ui/tool-card';

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
      <div className="px-6">
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
          <div className="tools-grid">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
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
