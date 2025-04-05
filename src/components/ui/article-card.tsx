import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Facebook } from "lucide-react";
import LazyImage from "@/components/ui/lazy-image";

interface ArticleCardProps {
  article: {
    id: string;
    slug: string;
    title: string;
    description: string;
    image_url?: string;
    date: string;
    read_time: string;
    category?: string;
  };
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  const shareFacebook = (slug: string) => {
    const url = `https://ponasobuolys.lt/publikacijos/${slug}`;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  return (
    <Card className="article-card flex flex-col h-full overflow-hidden">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <div className="text-sm text-gray-500">
            {new Date(article.date).toLocaleDateString('lt-LT')} · {article.read_time} skaitymo
          </div>
          {article.category && (
            <div className="text-xs font-medium py-1 px-2 rounded-full bg-primary/10 text-primary">
              {article.category}
            </div>
          )}
        </div>
        <CardTitle className="text-xl line-clamp-2 h-14">{article.title}</CardTitle>
        <CardDescription className="line-clamp-3 h-18">{article.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow">
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
            Publikacijos nuotrauka
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between mt-auto">
        <Link to={`/publikacijos/${article.slug}`}>
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
  );
};

export default ArticleCard;
