import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LazyImage from "@/components/ui/lazy-image";
import { ExternalLink, CheckCircle, XCircle } from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string;
  url: string;
  image_url?: string;
  category: string;
  pros?: string[]; // Pridėta: privalumai
  cons?: string[]; // Pridėta: trūkumai
  usage_examples?: string[]; // Pridėta: naudojimo pavyzdžiai
}

interface ToolDetailCardProps {
  tool: Tool;
}

const ToolDetailCard: React.FC<ToolDetailCardProps> = ({ tool }) => {
  return (
    <Card className="overflow-hidden shadow-lg">
      <CardHeader className="p-0">
        {tool.image_url ? (
          <div className="aspect-video w-full overflow-hidden">
            <LazyImage 
              src={tool.image_url} 
              alt={tool.name} 
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="aspect-video w-full bg-muted flex items-center justify-center text-muted-foreground">
            Įrankio nuotrauka
          </div>
        )}
      </CardHeader>
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
          <CardTitle className="text-3xl font-bold mb-2 md:mb-0">{tool.name}</CardTitle>
          <Badge variant="secondary" className="text-sm py-1 px-3 w-fit">{tool.category}</Badge>
        </div>
        
        <CardDescription className="text-lg text-gray-200 mb-6">
          {tool.description}
        </CardDescription>

        {/* Privalumai ir trūkumai */}
        {(tool.pros || tool.cons) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {tool.pros && tool.pros.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xl font-semibold flex items-center text-green-600">
                  <CheckCircle className="mr-2 h-5 w-5" /> Privalumai
                </h3>
                <ul className="list-none space-y-1 text-gray-200">
                  {tool.pros.map((pro, index) => (
                    <li key={`pro-${index}`} className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-1 text-green-500 flex-shrink-0" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {tool.cons && tool.cons.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xl font-semibold flex items-center text-red-600">
                  <XCircle className="mr-2 h-5 w-5" /> Trūkumai
                </h3>
                <ul className="list-none space-y-1 text-gray-200">
                  {tool.cons.map((con, index) => (
                    <li key={`con-${index}`} className="flex items-start">
                      <XCircle className="w-4 h-4 mr-2 mt-1 text-red-500 flex-shrink-0" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Naudojimo pavyzdžiai */}
        {tool.usage_examples && tool.usage_examples.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3">Naudojimo pavyzdžiai</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-200">
              {tool.usage_examples.map((example, index) => (
                <li key={`example-${index}`}>{example}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="mt-8 flex justify-center">
          <a href={tool.url} target="_blank" rel="noopener noreferrer" className="inline-block">
            <Button size="lg" className="flex items-center gap-2">
              <span>Išbandyti įrankį</span>
              <ExternalLink className="h-5 w-5" />
            </Button>
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default ToolDetailCard; 