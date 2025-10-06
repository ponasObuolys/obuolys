import { Button } from "@/components/ui/button";
import LazyImage from "@/components/ui/lazy-image";
import type { Database } from "@/integrations/supabase/types";
import { ExternalLink, Eye, Star } from "lucide-react";
import { Link } from "react-router-dom";

type Tool = Database["public"]["Tables"]["tools"]["Row"] & {
  short_description?: string;
};

interface ToolCardProps {
  tool: Tool;
}

const ToolCard = ({ tool }: ToolCardProps) => {
  const truncatedDescription = tool.description
    ? tool.description.length > 100
      ? tool.description.substring(0, 100) + "..."
      : tool.description
    : tool.short_description;

  // Get category color - similar to article cards
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Produktyvumas": "bg-blue-600",
      "Kūrybinis": "bg-purple-600",
      "Verslas": "bg-orange-500",
      "Tyrimai": "bg-green-600",
      "Analitika": "bg-cyan-500",
      "default": "bg-primary"
    };
    return colors[category] || colors.default;
  };

  const categoryColor = tool.category ? getCategoryColor(tool.category) : "bg-primary";

  return (
    <Link to={`/irankiai/${tool.slug}`} className="block group">
      <div className={`project-card h-full flex flex-col ${tool.featured ? 'border-2 border-yellow-500/50 hover:border-yellow-500' : ''}`}>
        {/* Header with icon and title - fixed */}
        <div className="flex items-start gap-3 mb-4">
          <div className={`w-12 h-12 rounded-lg ${categoryColor} flex items-center justify-center flex-shrink-0`}>
            <span className="text-white font-bold text-lg">
              {tool.category ? tool.category.charAt(0) : "🔧"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold line-clamp-1 mb-1 text-left truncate" title={tool.name}>
              {tool.name}
            </h3>
            <p className="text-sm text-gray-200 text-left">
              {tool.category || "AI Įrankis"}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {tool.featured && (
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            )}
            <svg className="w-5 h-5 text-foreground/40 group-hover:text-foreground transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* Image section - fixed height */}
        {tool.image_url && (
          <div className="h-[180px] rounded-lg overflow-hidden bg-muted mb-4">
            <LazyImage
              src={tool.image_url}
              alt={tool.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}

        {/* Description - flexible, takes remaining space */}
        <div className="flex-1 mb-4">
          <p className="text-sm text-gray-200 line-clamp-3 text-left">
            {truncatedDescription}
          </p>
        </div>

        {/* Action buttons - fixed at bottom */}
        <div className="flex items-center gap-3 pt-4 border-t border-border">
          <div className="flex items-center text-xs text-gray-200">
            <Eye className="w-4 h-4 mr-1" />
            <span>Detaliau</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              window.open(tool.url, "_blank", "noopener,noreferrer");
            }}
            className="ml-auto flex items-center gap-1 text-xs"
          >
            <span>Išbandyti</span>
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ToolCard;
