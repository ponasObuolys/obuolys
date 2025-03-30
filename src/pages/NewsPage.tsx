
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Clock, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const NewsPage = () => {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .eq('published', true)
          .order('date', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setNews(data);
        }
      } catch (error: any) {
        toast({
          title: "Klaida",
          description: "Nepavyko gauti naujienų. Bandykite vėliau.",
          variant: "destructive"
        });
        console.error("Error fetching news:", error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNews();
  }, [toast]);
  
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
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">Kraunamos naujienos...</p>
            </div>
          ) : filteredNews.length > 0 ? (
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
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">
                {searchQuery ? "Pagal jūsų paiešką naujienų nerasta" : "Šiuo metu naujienų nėra"}
              </p>
              {searchQuery && (
                <Button 
                  className="mt-4 button-outline"
                  onClick={() => setSearchQuery("")}
                >
                  Išvalyti paiešką
                </Button>
              )}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default NewsPage;
