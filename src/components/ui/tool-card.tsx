import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
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
    <Card className="tool-card flex flex-col h-full overflow-hidden">
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
        <CardTitle className="text-xl line-clamp-2 h-14">{tool.name}</CardTitle>
        <CardDescription className="line-clamp-3 h-18">{tool.short_description}</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow">
        {tool.description && (
          <p className="text-sm line-clamp-3">{tool.description}</p>
        )}
      </CardContent>
      
      <CardFooter className="mt-auto">
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
  );
};

export default ToolCard;
