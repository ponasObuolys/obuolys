
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Facebook } from "lucide-react";

const articles = [
  {
    id: 1,
    title: "Kaip ChatGPT gali padėti jūsų verslui",
    description: "Išsamiai apie ChatGPT panaudojimo galimybes versle: nuo marketingo iki klientų aptarnavimo.",
    readTime: "7 min.",
    date: "2023-06-15",
    slug: "chatgpt-versle"
  },
  {
    id: 2,
    title: "Midjourney v6: Kas naujo ir kaip naudoti",
    description: "Išsamus gidas apie naujausią Midjourney versiją ir kaip išgauti geriausius rezultatus.",
    readTime: "8 min.",
    date: "2023-07-02",
    slug: "midjourney-v6-gidas"
  },
  {
    id: 3,
    title: "AI įrankiai, kurie padės sutaupyti laiko",
    description: "Top 10 dirbtinio intelekto įrankių, kurie padės optimizuoti jūsų darbo procesus.",
    readTime: "5 min.",
    date: "2023-07-20",
    slug: "ai-irankiai-efektyvumui"
  }
];

const FeaturedArticles = () => {
  const shareFacebook = (slug: string) => {
    const url = `https://ponasobuolys.lt/straipsniai/${slug}`;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="mb-4">Populiariausi <span className="gradient-text">straipsniai</span></h2>
          <p className="max-w-2xl mx-auto">
            Naujausi ir populiariausi straipsniai apie dirbtinį intelektą ir jo pritaikymą
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Card key={article.id} className="article-card">
              <CardHeader>
                <div className="mb-2 text-sm text-gray-500">{article.date} · {article.readTime} skaitymo</div>
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
        
        <div className="text-center mt-12">
          <Link to="/straipsniai">
            <Button className="button-outline">Visi straipsniai</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedArticles;
