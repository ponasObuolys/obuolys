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
    <Card className="article-card">
      <div className="card-image-container">
        {article.category && (
          <div className="category-tag">{article.category}</div>
        )}
        {article.image_url ? (
          <LazyImage 
            src={article.image_url} 
            alt={article.title} 
            className="object-cover absolute inset-0 w-full h-full"
          />
        ) : (
          <div className="absolute inset-0 bg-slate-100 flex items-center justify-center text-slate-400">
            Publikacijos nuotrauka
          </div>
        )}
      </div>
      
      <div className="card-content flex flex-col flex-1">
        <h3 className="card-title line-clamp-2">{article.title}</h3>
        <p className="card-description line-clamp-3">{article.description}</p>
        
        <div className="card-metadata">
          <div className="flex items-center gap-1">
            <CalendarDays size={14} />
            <span>{new Date(article.date).toLocaleDateString('lt-LT')}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{article.read_time} skaitymo</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-auto pt-2">
          <Link to={`/publikacijos/${article.slug}`} className="flex-1 mr-2">
            <Button className="button-primary w-full text-sm py-1.5">Skaityti daugiau</Button>
          </Link>
          <Button 
            variant="ghost"
            size="icon"
            onClick={() => shareFacebook(article.slug)} 
            className="text-blue-600 hover:bg-blue-100 flex-shrink-0"
            aria-label="Dalintis Facebook"
          >
            <Facebook className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ArticleCard;
