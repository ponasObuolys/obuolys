import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import LazyImage from "@/components/ui/lazy-image";
import { Clock, Calendar, ArrowRight, Eye } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import { useArticleViews } from "@/hooks/use-article-views";

type Article = Tables<"articles">;

interface RelatedArticlesProps {
  articles: Article[];
  loading?: boolean;
}

// Component for individual article card with view count
function RelatedArticleCard({ article }: { article: Article }) {
  const { viewCount, loading } = useArticleViews({ articleId: article.id });

  return (
    <Link to={`/publikacijos/${article.slug}`} className="group block">
      <article className="h-full bg-card border border-border rounded-lg overflow-hidden hover:border-primary transition-all duration-300 hover:shadow-lg">
        {/* Image */}
        {article.image_url ? (
          <div className="aspect-video overflow-hidden bg-muted">
            <LazyImage
              src={article.image_url}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <span className="text-4xl">📰</span>
          </div>
        )}

        {/* Content */}
        <div className="p-4">
          {/* Categories */}
          {article.category && article.category.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {article.category.slice(0, 2).map(cat => (
                <Badge key={cat} variant="secondary" className="text-xs">
                  {cat}
                </Badge>
              ))}
              {article.category.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{article.category.length - 2}
                </Badge>
              )}
            </div>
          )}

          {/* Title */}
          <h3 className="font-semibold text-base line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{article.description}</p>

          {/* Metadata */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{new Date(article.date).toLocaleDateString("lt-LT")}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{article.read_time}</span>
            </div>
            {!loading && viewCount > 0 && (
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3 text-blue-400" />
                <span>{viewCount.toLocaleString("lt-LT")}</span>
              </div>
            )}
          </div>

          {/* Read more indicator */}
          <div className="flex items-center gap-1 mt-3 text-sm text-primary font-medium">
            <span>Skaityti daugiau</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </article>
    </Link>
  );
}

export function RelatedArticles({ articles, loading }: RelatedArticlesProps) {
  if (loading) {
    return (
      <section className="mt-16 border-t border-border pt-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Kraunamos susijusios publikacijos...
          </h2>
        </div>
      </section>
    );
  }

  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 border-t border-border pt-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Jums gali patikti</h2>
            <p className="text-muted-foreground">
              Susijusios publikacijos, kurios gali jus sudominti
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map(article => (
              <RelatedArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
