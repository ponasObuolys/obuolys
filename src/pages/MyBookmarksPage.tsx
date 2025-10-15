import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import ArticleCard from "@/components/ui/article-card";
import { Bookmark, Loader2, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import type { Tables } from "@/integrations/supabase/types";
import { secureLogger } from "@/utils/browserLogger";
import SEOHead from "@/components/SEO";
import { SITE_CONFIG } from "@/utils/seo";

type Article = Tables<"articles">;

const MyBookmarksPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookmarkedArticles, setBookmarkedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBookmarkedArticles();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchBookmarkedArticles = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Get bookmarked article IDs
      const { data: bookmarks, error: bookmarksError } = await supabase
        .from("article_bookmarks")
        .select("article_id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (bookmarksError) throw bookmarksError;

      if (!bookmarks || bookmarks.length === 0) {
        setBookmarkedArticles([]);
        return;
      }

      const articleIds = bookmarks.map(b => b.article_id);

      // Fetch articles
      const { data: articles, error: articlesError } = await supabase
        .from("articles")
        .select("*")
        .in("id", articleIds)
        .eq("published", true);

      if (articlesError) throw articlesError;

      // Sort articles by bookmark order
      const sortedArticles = articleIds
        .map(id => articles?.find(a => a.id === id))
        .filter((a): a is Article => a !== undefined);

      setBookmarkedArticles(sortedArticles);
    } catch (error) {
      secureLogger.error("Error fetching bookmarked articles", { error });
      toast({
        title: "Klaida",
        description: "Nepavyko gauti išsaugotų straipsnių. Bandykite vėliau.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <>
        <SEOHead
          title="Mano sąrašas"
          description="Jūsų išsaugoti AI straipsniai ir naujienos"
          canonical={`${SITE_CONFIG.domain}/mano-sarasas`}
          noindex={true}
        />
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <Bookmark className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h1 className="text-3xl font-bold mb-4">Mano sąrašas</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Norėdami išsaugoti straipsnius vėlesniam skaitymui, turite prisijungti.
              </p>
              <Link to="/prisijungti">
                <Button className="gap-2">
                  <LogIn className="h-4 w-4" />
                  Prisijungti
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <SEOHead
          title="Mano sąrašas"
          description="Jūsų išsaugoti AI straipsniai ir naujienos"
          canonical={`${SITE_CONFIG.domain}/mano-sarasas`}
          noindex={true}
        />
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <SEOHead
        title="Mano sąrašas"
        description="Jūsų išsaugoti AI straipsniai ir naujienos"
        canonical={`${SITE_CONFIG.domain}/mano-sarasas`}
        noindex={true}
      />
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Bookmark className="h-8 w-8" />
                <h1 className="text-4xl font-bold">Mano sąrašas</h1>
              </div>
              <p className="text-lg text-muted-foreground">
                Jūsų išsaugoti straipsniai vėlesniam skaitymui
              </p>
            </div>

            {/* Articles grid */}
            {bookmarkedArticles.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-card border border-border rounded-lg p-12">
                  <Bookmark className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h2 className="text-2xl font-bold mb-2">Sąrašas tuščias</h2>
                  <p className="text-muted-foreground mb-6">
                    Dar neišsaugojote jokių straipsnių. Naršykite publikacijas ir spauskite
                    "Išsaugoti" mygtuką.
                  </p>
                  <Link to="/publikacijos">
                    <Button>Naršyti publikacijas</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-muted-foreground">
                  Rasta {bookmarkedArticles.length}{" "}
                  {bookmarkedArticles.length === 1
                    ? "straipsnis"
                    : bookmarkedArticles.length < 10
                    ? "straipsniai"
                    : "straipsnių"}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bookmarkedArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default MyBookmarksPage;
