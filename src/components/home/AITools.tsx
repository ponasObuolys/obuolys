
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";

const tools = [
  {
    id: 1,
    name: "ChatGPT",
    description: "Galingas kalbos modelis, padedantis rašyti, kurti turinį ir atsakyti į klausimus.",
    category: "Tekstas",
    url: "https://chat.openai.com",
    affiliate: true
  },
  {
    id: 2,
    name: "Midjourney",
    description: "Pažangus vaizdų generavimo įrankis, leidžiantis kurti aukštos kokybės iliustracijas.",
    category: "Vaizdas",
    url: "https://www.midjourney.com",
    affiliate: true
  },
  {
    id: 3,
    name: "Synthesia",
    description: "Vaizdo įrašų kūrimo platforma su dirbtinio intelekto avataramis.",
    category: "Vaizdo įrašai",
    url: "https://www.synthesia.io",
    affiliate: false
  },
  {
    id: 4,
    name: "Claude",
    description: "Anthropic kalbos modelis, specializuojasi ilguose pokalbių kontekstuose.",
    category: "Tekstas",
    url: "https://claude.ai",
    affiliate: true
  }
];

const AITools = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="mb-4">Rekomenduojami <span className="gradient-text">AI įrankiai</span></h2>
          <p className="max-w-2xl mx-auto">
            Išbandykite šiuos dirbtinio intelekto įrankius ir padidinkite savo produktyvumą
          </p>
        </div>
        
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
