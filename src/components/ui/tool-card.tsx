import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Tag, Star } from "lucide-react";
import LazyImage from "@/components/ui/lazy-image";

interface ToolCardProps {
  tool: {
    id: string;
    name: string;
    short_description: string;
    description?: string;
    image_url?: string;
    category: string;
    url: string;
  };
}

const ToolCard = ({ tool }: ToolCardProps) => {
  return (
    <Card className="tool-card flex flex-col overflow-hidden">
      <div className="card-image-container">
        {tool.category && (
          <div className="category-tag">{tool.category}</div>
        )}
        {tool.image_url ? (
          <LazyImage 
            src={tool.image_url} 
            alt={tool.name} 
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
            Įrankio nuotrauka
          </div>
        )}
      </div>
      
      <div className="card-content">
        <h3 className="card-title">{tool.name}</h3>
        <p className="card-description">{tool.short_description}</p>
        
        <div className="card-metadata">
          <div>
            <Tag size={14} />
            <span>{tool.category}</span>
          </div>
          <div>
            <Star size={14} />
            <span>Rekomenduojama</span>
          </div>
        </div>
        
        {tool.description && (
          <p className="text-sm text-gray-600 mt-2 mb-4">{tool.description.substring(0, 100)}...</p>
        )}
        
        <div className="flex justify-between items-center mt-auto">
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
        </div>
      </div>
    </Card>
  );
};

export default ToolCard;
