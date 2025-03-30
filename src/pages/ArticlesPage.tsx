
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Facebook, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// Mock data
const articles = [
  {
    id: 1,
    title: "Kaip ChatGPT gali padėti jūsų verslui",
    description: "Išsamiai apie ChatGPT panaudojimo galimybes versle: nuo marketingo iki klientų aptarnavimo.",
    readTime: "7 min.",
    date: "2023-06-15",
    category: "Verslas",
    slug: "chatgpt-versle"
  },
  {
    id: 2,
    title: "Midjourney v6: Kas naujo ir kaip naudoti",
    description: "Išsamus gidas apie naujausią Midjourney versiją ir kaip išgauti geriausius rezultatus.",
    readTime: "8 min.",
    date: "2023-07-02",
    category: "Dizainas",
    slug: "midjourney-v6-gidas"
  },
  {
    id: 3,
    title: "AI įrankiai, kurie padės sutaupyti laiko",
    description: "Top 10 dirbtinio intelekto įrankių, kurie padės optimizuoti jūsų darbo procesus.",
    readTime: "5 min.",
    date: "2023-07-20",
    category: "Produktyvumas",
    slug: "ai-irankiai-efektyvumui"
  },
  {
    id: 4,
    title: "Dirbtinio intelekto etika: Ką turime žinoti",
    description: "Svarbiausios etinės problemos, susijusios su dirbtinio intelekto naudojimu ir plėtra.",
    readTime: "10 min.",
    date: "2023-08-05",
    category: "Etika",
    slug: "ai-etika"
  },
  {
    id: 5,
    title: "Kaip kurti efektyvius prašymus (prompts) ChatGPT",
    description: "Praktiški patarimai, kaip formuluoti efektyvius prašymus AI modeliams ir gauti geresnius rezultatus.",
    readTime: "6 min.",
    date: "2023-08-12",
    category: "Praktika",
    slug: "efektyvus-prompts"
  },
  {
    id: 6,
    title: "AI ir švietimas: Kaip keičiasi mokymosi procesai",
    description: "Dirbtinio intelekto įtaka švietimui ir kaip mokytojai bei mokiniai gali išnaudoti naujas galimybes.",
    readTime: "9 min.",
    date: "2023-08-20",
    category: "Švietimas",
    slug: "ai-svietimas"
  }
];

const categories = [
  "Visos kategorijos",
  "Verslas",
  "Dizainas",
  "Produktyvumas",
  "Etika",
  "Praktika",
  "Švietimas"
];

const ArticlesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Visos kategorijos");
  
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
          
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => (
                <Card key={article.id} className="article-card">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-sm text-gray-500">{article.date} · {article.readTime} skaitymo</div>
                      <div className="text-xs font-medium py-1 px-2 rounded-full bg-primary/10 text-primary">
                        {article.category}
                      </div>
                    </div>
                    <CardTitle className="text-xl">{article.title}</CardTitle>
                    <CardDescription>{article.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-40 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                      Straipsnio nuotrauka
                    </div>
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
