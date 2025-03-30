
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

// Mock data
const tools = [
  {
    id: 1,
    name: "ChatGPT",
    description: "Galingas kalbos modelis, padedantis rašyti, kurti turinį ir atsakyti į klausimus.",
    category: "Tekstas",
    tags: ["Turinys", "Pokalbis", "Pagalba"],
    url: "https://chat.openai.com",
    affiliate: true
  },
  {
    id: 2,
    name: "Midjourney",
    description: "Pažangus vaizdų generavimo įrankis, leidžiantis kurti aukštos kokybės iliustracijas.",
    category: "Vaizdas",
    tags: ["Dizainas", "Menas", "Iliustracijos"],
    url: "https://www.midjourney.com",
    affiliate: true
  },
  {
    id: 3,
    name: "Synthesia",
    description: "Vaizdo įrašų kūrimo platforma su dirbtinio intelekto avataramis.",
    category: "Vaizdo įrašai",
    tags: ["Video", "Prezentacijos", "Mokymai"],
    url: "https://www.synthesia.io",
    affiliate: false
  },
  {
    id: 4,
    name: "Claude",
    description: "Anthropic kalbos modelis, specializuojasi ilguose pokalbių kontekstuose.",
    category: "Tekstas",
    tags: ["Turinys", "Pokalbis", "Pagalba"],
    url: "https://claude.ai",
    affiliate: true
  },
  {
    id: 5,
    name: "Dall-E",
    description: "OpenAI vaizdų kūrimo įrankis, generuojantis vaizdus pagal tekstą.",
    category: "Vaizdas",
    tags: ["Dizainas", "Menas", "Iliustracijos"],
    url: "https://openai.com/dall-e-3",
    affiliate: false
  },
  {
    id: 6,
    name: "Murf",
    description: "AI įgarsintojo įrankis, leidžiantis generuoti realistišką balsą įvairiomis kalbomis.",
    category: "Garsas",
    tags: ["Balso įrašai", "Podkastai", "Įgarsinimas"],
    url: "https://murf.ai",
    affiliate: true
  },
  {
    id: 7,
    name: "Copy.ai",
    description: "Rinkodaros teksto generavimo įrankis įvairiems kanalams ir formatams.",
    category: "Tekstas",
    tags: ["Rinkodara", "Turinys", "Kopirašymas"],
    url: "https://www.copy.ai",
    affiliate: true
  },
  {
    id: 8,
    name: "Runway",
    description: "Vaizdo redagavimo ir generavimo platforma su pažangiomis AI galimybėmis.",
    category: "Vaizdo įrašai",
    tags: ["Video", "Redagavimas", "Efektai"],
    url: "https://runway.ml",
    affiliate: false
  }
];

const categories = ["Visos kategorijos", "Tekstas", "Vaizdas", "Vaizdo įrašai", "Garsas"];

const ToolsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Visos kategorijos");
  
  const filteredTools = tools.filter(tool => {
    const matchesSearch = 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "Visos kategorijos" || tool.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="mb-4"><span className="gradient-text">AI įrankiai</span></h1>
            <p className="max-w-2xl mx-auto">
              Išbandykite šiuos dirbtinio intelekto įrankius ir padidinkite savo produktyvumą
            </p>
          </div>
          
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Ieškoti įrankių..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="inline-flex items-center flex-wrap gap-2">
                <Filter className="h-5 w-5 text-gray-500" />
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant="outline"
                    className={`${
                      selectedCategory === category 
                        ? 'bg-primary text-white hover:bg-primary/90' 
                        : 'bg-white text-secondary hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTools.map((tool) => (
                <Card key={tool.id} className="custom-card h-full flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="mb-2 text-xs font-medium py-1 px-2 rounded-full bg-primary/10 text-primary inline-block">
                      {tool.category}
                    </div>
                    <CardTitle className="text-lg">{tool.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2 flex-grow">
                    <CardDescription className="mb-4">{tool.description}</CardDescription>
                    <div className="flex flex-wrap gap-2">
                      {tool.tags.map((tag, index) => (
                        <span 
                          key={index} 
                          className="text-xs py-1 px-2 bg-gray-100 text-gray-600 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
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
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">Pagal jūsų paiešką įrankių nerasta</p>
              <Button 
                className="mt-4 button-outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("Visos kategorijos");
                }}
              >
                Išvalyti paiešką
              </Button>
            </div>
          )}
          
          <div className="mt-12 bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-bold mb-4">Apie įrankių rekomendacijas</h2>
            <p className="mb-4">
              Visi šiame puslapyje pristatomi įrankiai yra asmeniškai išbandyti ir rekomenduojami. 
              Kai kurios nuorodos gali būti partnerių nuorodos, o tai reiškia, kad galiu gauti komisinius, 
              jei nuspręsite įsigyti įrankį per mano nuorodą (jums tai nekainuoja papildomai).
            </p>
            <p>
              Tai padeda išlaikyti šią svetainę ir toliau teikti naudingą informaciją apie dirbtinį intelektą.
              Visada rekomenduoju tik tuos įrankius, kuriais pats naudojuosi ir vertinu.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ToolsPage;
