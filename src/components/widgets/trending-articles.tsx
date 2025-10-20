import { Link } from "react-router-dom";
import { Eye, Flame } from "lucide-react";
import { useTrendingArticles } from "@/hooks/use-trending-articles";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { formatViewCount } from "@/utils/pluralize";

interface TrendingArticlesProps {
  days?: number;
  limit?: number;
  className?: string;
  variant?: "default" | "compact";
}

export function TrendingArticles({
  days = 7,
  limit = 5,
  className,
  variant = "default",
}: TrendingArticlesProps) {
  const { data: articles, isLoading, error } = useTrendingArticles({ days, limit });

  if (error) {
    return null;
  }

  if (isLoading) {
    return (
      <div className={cn("", className)}>
        <div className="mb-8 text-center">
          <Skeleton className="h-8 w-64 mx-auto mb-3" />
          <Skeleton className="h-5 w-96 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="project-card h-full">
              <div className="flex items-start gap-3 mb-3">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="w-5 h-5" />
              </div>
              <Skeleton className="h-4 w-20 mb-3" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return null;
  }

  const timeLabel = days === 7 ? "šią savaitę" : days === 30 ? "šį mėnesį" : `per ${days} d.`;

  if (variant === "compact") {
    return (
      <div className={cn("space-y-2", className)}>
        <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
          <Flame className="h-4 w-4 text-orange-500" />
          Populiariausia {timeLabel}
        </h3>
        <div className="space-y-1">
          {articles.slice(0, 3).map((article, index) => (
            <Link
              key={article.id}
              to={`/publikacijos/${article.slug}`}
              className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
            >
              <span className="text-muted-foreground font-medium">{index + 1}.</span>
              <span className="line-clamp-1 flex-1">{article.title}</span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {article.views}
              </span>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("", className)}>
      {/* Section Header */}
      <div className="mb-8 text-center">
        <h2 className="mb-3 flex items-center justify-center gap-2">
          <Flame className="h-6 w-6 text-orange-500" />
          Populiariausia <span className="gradient-text">{timeLabel}</span>
        </h2>
        <p className="text-gray-200">
          Daugiausiai skaitomi straipsniai pagal peržiūras
        </p>
      </div>

      {/* Articles Grid - matching ArticleCard layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <Link
            key={article.id}
            to={`/publikacijos/${article.slug}`}
            className="block group"
          >
            <div className="project-card h-full">
              {/* Header with ranking and title */}
              <div className="flex items-start gap-3 mb-3">
                {/* Ranking Badge */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                    index === 0 && "bg-yellow-500",
                    index === 1 && "bg-gray-400",
                    index === 2 && "bg-orange-500",
                    index > 2 && "bg-purple-600"
                  )}
                >
                  <span className="text-white font-bold text-lg">
                    {index + 1}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold line-clamp-2 mb-1 text-left">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-200 text-left">
                    {article.category?.join(", ") || "AI Naujienos"}
                  </p>
                </div>
                
                {/* Arrow icon */}
                <svg className="w-5 h-5 text-foreground/40 group-hover:text-foreground transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-200 line-clamp-2 mb-3 text-left">
                {article.description}
              </p>

              {/* Metadata - matching ArticleCard style */}
              <div className="flex items-center gap-4 text-xs text-gray-200 mt-auto">
                <div className="flex items-center gap-1">
                  <Eye size={14} className="text-blue-400" />
                  <span>{formatViewCount(article.views)}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
