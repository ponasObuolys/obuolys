import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import LazyImage from "@/components/ui/lazy-image";

const AINews = () => {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .eq('published', true)
          .order('date', { ascending: false })
          .limit(4);
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setNews(data);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNews();
  }, []);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="mb-4"><span className="gradient-text">Naujienos</span> iš AI pasaulio</h2>
          <p className="max-w-2xl mx-auto">
            Sekite naujausias tendencijas ir įvykius dirbtinio intelekto srityje
          </p>
        </div>
        
        {loading ? (
          <div className="text-center">Kraunamos naujienos...</div>
        ) : news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {news.map((item) => (
              <Card key={item.id} className="custom-card h-full flex flex-col">
                <div className="aspect-video w-full overflow-hidden">
                  {item.image_url ? (
                    <LazyImage
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                      Nėra nuotraukos
                    </div>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="py-2 flex-grow">
                  <CardDescription>{item.description}</CardDescription>
                </CardContent>
                <CardFooter className="pt-2 flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>{new Date(item.date).toLocaleDateString('lt-LT')}</span>
                  </div>
                  <Link to={`/naujienos/${item.slug}`}>
                    <Button className="button-accent text-sm px-3 py-1 h-auto">Daugiau</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <p>Šiuo metu nėra naujų pranešimų</p>
          </div>
        )}
        
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
