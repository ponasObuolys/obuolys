import { Link } from "react-router-dom";
import { Clock, CalendarDays } from "lucide-react";
import LazyImage from "@/components/ui/lazy-image";

interface ArticleCardProps {
  article: {
    id: string;
    slug: string;
    title: string;
    description: string;
    image_url: string | null;
    date: string;
    read_time: string;
    category?: string;
  };
}

// Color palette for different categories
const categoryColors: { [key: string]: string } = {
  "AI": "bg-purple-600",
  "Technologijos": "bg-blue-600",
  "Verslas": "bg-orange-500",
  "Tyrimai": "bg-green-600",
  "Įrankiai": "bg-cyan-500",
  "default": "bg-purple-600"
};

const ArticleCard = ({ article }: ArticleCardProps) => {
  const categoryColor = categoryColors[article.category || "default"] || categoryColors.default;

  return (
    <Link to={`/publikacijos/${article.slug}`} className="block">
      <div className="project-card h-full">
        {/* Header with icon and title */}
        <div className="flex items-start gap-3 mb-4">
          <div className={`w-12 h-12 rounded-lg ${categoryColor} flex items-center justify-center flex-shrink-0`}>
            <span className="text-white font-bold text-lg">
              {article.category ? article.category.charAt(0) : "AI"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground line-clamp-2 mb-1">
              {article.title}
            </h3>
            <p className="text-sm text-foreground/60">
              {article.category || "AI Naujienos"}
            </p>
          </div>
          <svg className="w-5 h-5 text-foreground/40 group-hover:text-foreground transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>

        {/* Image section */}
        {article.image_url && (
          <div className="aspect-video rounded-lg overflow-hidden bg-muted mb-4">
            <LazyImage
              src={article.image_url}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-foreground/70 line-clamp-3 mb-4">
          {article.description}
        </p>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-xs text-foreground/50 mt-auto">
          <div className="flex items-center gap-1">
            <CalendarDays size={12} />
            <span>{new Date(article.date).toLocaleDateString('lt-LT')}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <span>{article.read_time} skaitymo</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
