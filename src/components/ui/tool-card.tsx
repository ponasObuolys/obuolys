import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import LazyImage from "@/components/ui/lazy-image";
import type { Database } from "@/integrations/supabase/types";
import { cn } from "@/lib/utils";
import { ExternalLink, Eye, Star } from "lucide-react";
import { Link } from "react-router-dom";

type Tool = Database["public"]["Tables"]["tools"]["Row"] & {
  short_description?: string;
};

interface ToolCardProps {
  tool: Tool;
  className?: string;
}

const ToolCard = ({ tool, className }: ToolCardProps) => {
  const truncatedDescription = tool.description
    ? tool.description.length > 100
      ? tool.description.substring(0, 100) + "..."
      : tool.description
    : tool.short_description;

  return (
    <Card
      className={cn(
        "tool-card flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-lg",
        className
      )}
    >
      <Link to={`/irankiai/${tool.slug}`} className="flex flex-col h-full">
        <div className="card-image-container relative">
          {tool.category && (
            <div className="category-tag absolute top-2 left-2 bg-primary/80 text-primary-foreground text-xs font-semibold px-2 py-1 rounded">
              {tool.category}
            </div>
          )}
          {tool.featured && (
            <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-semibold px-2 py-1 rounded flex items-center">
              <Star className="w-3 h-3 mr-1" /> Rekomenduojama
            </div>
          )}
          <div className="aspect-video overflow-hidden">
            {tool.image_url ? (
              <LazyImage
                src={tool.image_url}
                alt={tool.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                Įrankio nuotrauka
              </div>
            )}
          </div>
        </div>

        <div className="card-content flex flex-col flex-grow p-4">
          <h3 className="card-title text-lg font-semibold mb-2 line-clamp-2">{tool.name}</h3>
          <p className="card-description text-sm text-muted-foreground mb-4 flex-grow line-clamp-3">
            {truncatedDescription}
          </p>

          <div className="flex justify-between items-center mt-auto pt-4 border-t border-border">
            <div className="flex items-center text-sm text-primary hover:underline">
              <Eye className="w-4 h-4 mr-1" /> Peržiūrėti detales
            </div>

            <Button
              size="sm"
              variant="secondary"
              onClick={e => {
                e.stopPropagation();
                window.open(tool.url, "_blank", "noopener,noreferrer");
              }}
              className="flex items-center gap-1"
            >
              <span>Išbandyti</span>
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default ToolCard;
