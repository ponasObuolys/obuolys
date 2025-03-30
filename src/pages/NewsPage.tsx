
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Clock, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// Mock data
const news = [
  {
    id: 1,
    title: "OpenAI pristato GPT-5",
    description: "Naujos kartos kalbos modelis nustebino savo galimybėmis atlikti sudėtingas užduotis.",
    date: "2023-08-15",
    slug: "openai-gpt5"
  },
  {
    id: 2,
    title: "Google AI naujovės",
    description: "Google pristato savo naujus dirbtinio intelekto įrankius, skirtus verslui ir kūrėjams.",
    date: "2023-08-10",
    slug: "google-ai-naujienos"
  },
  {
    id: 3,
    title: "Microsoft investuoja į AI startuolius",
    description: "Microsoft planuoja investuoti 500 milijonų dolerių į AI startuolius visame pasaulyje.",
    date: "2023-08-05",
    slug: "microsoft-investicijos"
  },
  {
    id: 4,
    title: "AI reglamentavimo pokyčiai ES",
    description: "Europos Sąjunga keičia dirbtinio intelekto reglamentavimo taisykles.",
    date: "2023-07-28",
    slug: "ai-reglamentavimas-es"
  },
  {
    id: 5,
    title: "Meta pristato naują AI modelį",
    description: "Meta (buvęs Facebook) pristato naują didelio masto kalbos modelį, kuris konkuruos su GPT ir Claude.",
    date: "2023-07-25",
    slug: "meta-naujas-ai"
  },
  {
    id: 6,
    title: "AI olimpiada 2023",
    description: "Pirmoji pasaulinė AI olimpiada suburs geriausius dirbtinio intelekto specialistus iš viso pasaulio.",
    date: "2023-07-20",
    slug: "ai-olimpiada"
  },
  {
    id: 7,
    title: "Saugesnė AI: naujos gairės",
    description: "Tarptautinės organizacijos skelbia naujas gaires, skirtas užtikrinti saugesnį dirbtinio intelekto kūrimą.",
    date: "2023-07-18",
    slug: "saugesne-ai"
  },
  {
    id: 8,
    title: "AI ir klimato kaita",
    description: "Naujas tyrimas atskleidžia, kaip dirbtinis intelektas gali padėti kovoti su klimato kaita.",
    date: "2023-07-15",
    slug: "ai-klimato-kaita"
  }
];

const NewsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredNews = news.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="mb-4"><span className="gradient-text">Naujienos</span></h1>
            <p className="max-w-2xl mx-auto">
              Sekite naujausias tendencijas ir įvykius dirbtinio intelekto srityje
            </p>
          </div>
          
          <div className="mb-8">
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Ieškoti naujienų..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          {filteredNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredNews.map((item) => (
                <Card key={item.id} className="custom-card h-full flex flex-col">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2 flex-grow">
                    <CardDescription>{item.description}</CardDescription>
                  </CardContent>
                  <CardFooter className="pt-2 flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>{item.date}</span>
                    </div>
                    <Link to={`/naujienos/${item.slug}`}>
                      <Button className="button-accent text-sm px-3 py-1 h-auto">Daugiau</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">Pagal jūsų paiešką naujienų nerasta</p>
              <Button 
                className="mt-4 button-outline"
                onClick={() => setSearchQuery("")}
              >
                Išvalyti paiešką
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default NewsPage;
