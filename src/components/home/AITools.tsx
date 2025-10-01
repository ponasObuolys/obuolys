import { Button } from "@/components/ui/button";
import ToolCard from "@/components/ui/tool-card";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Tool = Database["public"]["Tables"]["tools"]["Row"];

const AITools = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Funkcija nustatyti kiek rodyti pagal lango dydį
    const getLimit = () => (window.matchMedia("(min-width: 1024px)").matches ? 3 : 4);

    const fetchTools = async () => {
      try {
        setLoading(true);
        const limit = getLimit();
        const { data, error } = await supabase
          .from("tools")
          .select("*")
          .eq("published", true)
          .eq("featured", true)
          .limit(limit);

        if (error) {
          throw error;
        }

        if (data) {
          setTools(data);
        }
      } catch {
        toast({
          title: "Klaida",
          description: "Nepavyko įkelti įrankių. Pabandykite dar kartą.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTools();

    // Reaguok į lango dydžio pokytį
    const handleResize = () => fetchTools();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section id="tools" className="py-12 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mb-8 md:mb-12 text-center">
          <h2 className="gradient-text">Rekomenduojami įrankiai</h2>
          <p className="mt-3 text-foreground/80">
            Šie dirbtinio intelekto įrankiai padės jums efektyviau dirbti ir kurti
          </p>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-xl text-gray-500">Kraunami įrankiai...</p>
          </div>
        ) : tools.length > 0 ? (
          <div className="tools-grid">
            {tools.map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-xl text-gray-500">Šiuo metu rekomenduojamų įrankių nėra</p>
          </div>
        )}

        <div className="mt-8 md:mt-12">
          <Link to="/irankiai" className="block w-full sm:w-auto">
            <Button className="button-outline w-full sm:w-auto">Daugiau įrankių</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AITools;
