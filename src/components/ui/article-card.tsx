import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Facebook, Clock, CalendarDays } from "lucide-react";
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
    <Card className="article-card flex flex-col overflow-hidden">
      <div className="card-image-container">
        {article.category && (
          <div className="category-tag">{article.category}</div>
        )}
        {article.image_url ? (
          <LazyImage 
            src={article.image_url} 
            alt={article.title} 
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
            Publikacijos nuotrauka
          </div>
        )}
      </div>
      
      <div className="card-content">
        <h3 className="card-title">{article.title}</h3>
        <p className="card-description">{article.description}</p>
        
        <div className="card-metadata">
          <div>
            <CalendarDays size={14} />
            <span>{new Date(article.date).toLocaleDateString('lt-LT')}</span>
          </div>
          <div>
            <Clock size={14} />
            <span>{article.read_time} skaitymo</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-auto">
          <Link to={`/publikacijos/${article.slug}`} className="w-3/4">
            <Button className="button-primary w-full">Skaityti daugiau</Button>
          </Link>
          <Button 
            onClick={() => shareFacebook(article.slug)} 
            className="bg-[#1877F2] text-white hover:bg-[#1877F2]/90"
            size="icon"
          >
            <Facebook className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ArticleCard;
