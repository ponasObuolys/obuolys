import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Facebook, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import LazyImage from "@/components/ui/lazy-image";

const ArticlesPage = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Visos kategorijos");
  const { toast } = useToast();
  
  // Get unique categories from articles
  const categories = ['Visos kategorijos', 
    ...Array.from(new Set(articles.map(article => article.category)))
  ];
  
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('published', true)
          .order('date', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setArticles(data);
        }
      } catch (error: any) {
        toast({
          title: "Klaida",
          description: "Nepavyko gauti straipsnių. Bandykite vėliau.",
          variant: "destructive"
        });
        console.error("Error fetching articles:", error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticles();
  }, [toast]);
  
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Visos kategorijos" || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  const shareFacebook = (slug: string) => {
    const url = `https://ponasobuolys.lt/straipsniai/${slug}`;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  return (
    <Layout>
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="mb-4"><span className="gradient-text">Straipsniai</span></h1>
            <p className="max-w-2xl mx-auto">
              Išsamūs straipsniai apie dirbtinį intelektą, jo pritaikymą ir naujas technologijas
            </p>
          </div>
          
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Ieškoti straipsnių..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="inline-flex flex-wrap gap-2">
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
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">Kraunami straipsniai...</p>
            </div>
          ) : filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => (
                <Card key={article.id} className="article-card">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-sm text-gray-500">
                        {new Date(article.date).toLocaleDateString('lt-LT')} · {article.read_time} skaitymo
                      </div>
                      <div className="text-xs font-medium py-1 px-2 rounded-full bg-primary/10 text-primary">
                        {article.category}
                      </div>
                    </div>
                    <CardTitle className="text-xl">{article.title}</CardTitle>
                    <CardDescription>{article.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {article.image_url ? (
                      <div className="h-40 overflow-hidden rounded-md">
                        <LazyImage 
                          src={article.image_url} 
                          alt={article.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-40 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                        Straipsnio nuotrauka
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Link to={`/straipsniai/${article.slug}`}>
                      <Button className="button-primary">Skaityti daugiau</Button>
                    </Link>
                    <Button 
                      onClick={() => shareFacebook(article.slug)} 
                      className="bg-[#1877F2] text-white hover:bg-[#1877F2]/90"
                      size="icon"
                    >
                      <Facebook className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">Pagal jūsų paiešką straipsnių nerasta</p>
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
        </div>
      </section>
    </Layout>
  );
};

export default ArticlesPage;
