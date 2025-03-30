
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";

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
  }
];

const AINews = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="mb-4"><span className="gradient-text">Naujienos</span> iš AI pasaulio</h2>
          <p className="max-w-2xl mx-auto">
            Sekite naujausias tendencijas ir įvykius dirbtinio intelekto srityje
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {news.map((item) => (
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
        
        <div className="text-center mt-10">
          <Link to="/naujienos">
            <Button className="button-outline">Visos naujienos</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AINews;
