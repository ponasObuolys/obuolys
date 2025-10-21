import { Link } from "react-router-dom";
import { Clock, CalendarDays } from "lucide-react";
import LazyImage from "@/components/ui/lazy-image";
import { getOptimizedImage } from "@/utils/imageOptimization";

interface ArticleCardProps {
  article: {
    id: string;
    slug: string;
    title: string;
    description: string;
    image_url: string | null;
    date: string;
    read_time: string;
    category?: string[];
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
  const primaryCategory = article.category?.[0] || "default";
  const categoryColor = categoryColors[primaryCategory] || categoryColors.default;

  return (
    <Link to={`/publikacijos/${article.slug}`} className="block">
      <div className="project-card h-full">
        {/* Header with icon and title */}
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-10 h-10 rounded-lg ${categoryColor} flex items-center justify-center flex-shrink-0`}>
            <span className="text-white font-bold text-base">
              {primaryCategory.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold line-clamp-2 mb-1 text-left">
              {article.title}
            </h3>
            <p className="text-sm text-foreground/90 text-left">
              {article.category?.join(", ") || "AI Naujienos"}
            </p>
          </div>
          <svg className="w-5 h-5 text-foreground/40 group-hover:text-foreground transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>

        {/* Image section */}
        {article.image_url && (
          <div className="aspect-video rounded-lg overflow-hidden bg-muted mb-3">
            <LazyImage
              src={getOptimizedImage(article.image_url, 'card')}
              alt={article.title}
              width={600}
              height={338}
              aspectRatio="16/9"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-foreground/90 line-clamp-3 mb-3 text-left">
          {article.description}
        </p>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-xs text-foreground/90 mt-auto">
          <div className="flex items-center gap-1">
            <CalendarDays size={14} />
            <span>{new Date(article.date).toLocaleDateString('lt-LT')}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{article.read_time} skaitymo</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
