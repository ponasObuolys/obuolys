import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, Trash2, MessageCircle, ExternalLink, Loader2 } from "lucide-react";
import { secureLogger } from "@/utils/browserLogger";
import { formatDistanceToNow } from "date-fns";
import { lt } from "date-fns/locale";
import { Link } from "react-router-dom";

interface ArticleComment {
  id: string;
  article_id: string;
  user_id: string;
  content: string;
  parent_id: string | null;
  is_approved: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

type Comment = ArticleComment & {
  user?: {
    username: string | null;
    avatar_url: string | null;
  };
  article?: {
    title: string;
    slug: string;
  };
};

const normalizeComment = (comment: Record<string, unknown>): ArticleComment => ({
  id: String(comment.id ?? ""),
  article_id: String(comment.article_id ?? ""),
  user_id: String(comment.user_id ?? ""),
  content: String(comment.content ?? ""),
  parent_id: (comment.parent_id as string | null | undefined) ?? null,
  is_approved: comment.is_approved === true,
  is_deleted: comment.is_deleted === true,
  created_at: String(comment.created_at ?? ""),
  updated_at: String(comment.updated_at ?? ""),
});

const normalizeUserProfile = (
  profile: Record<string, unknown> | null | undefined
): Comment["user"] =>
  profile
    ? {
        username: (profile.username as string | null | undefined) ?? null,
        avatar_url: (profile.avatar_url as string | null | undefined) ?? null,
      }
    : undefined;

const normalizeArticleInfo = (
  article: Record<string, unknown> | null | undefined
): Comment["article"] =>
  article
    ? {
        title: String(article.title ?? ""),
        slug: String(article.slug ?? ""),
      }
    : undefined;

const AdminCommentsModeration = () => {
  const { toast } = useToast();
  const [pendingComments, setPendingComments] = useState<Comment[]>([]);
  const [approvedComments, setApprovedComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchComments = async () => {
    try {
      setLoading(true);

      // Fetch pending comments
      const { data: pendingData, error: pendingError } = await supabase
        .from("article_comments")
        .select("*")
        .eq("is_approved", false)
        .eq("is_deleted", false)
        .order("created_at", { ascending: false });

      if (pendingError) throw pendingError;

      // Fetch approved comments
      const { data: approvedData, error: approvedError } = await supabase
        .from("article_comments")
        .select("*")
        .eq("is_approved", true)
        .eq("is_deleted", false)
        .order("created_at", { ascending: false })
        .limit(50);

      if (approvedError) throw approvedError;

      // Fetch user profiles and article info for pending comments
      const pendingWithDetails = await Promise.all(
        (pendingData || []).map(async rawComment => {
          const baseComment = normalizeComment(rawComment as Record<string, unknown>);
          const [userProfile, article] = await Promise.all([
            supabase
              .from("profiles")
              .select("username, avatar_url")
              .eq("id", baseComment.user_id)
              .single(),
            supabase
              .from("articles")
              .select("title, slug")
              .eq("id", baseComment.article_id)
              .single(),
          ]);

          return {
            ...baseComment,
            user: normalizeUserProfile(
              userProfile.data as Record<string, unknown> | null | undefined
            ),
            article: normalizeArticleInfo(
              article.data as Record<string, unknown> | null | undefined
            ),
          };
        })
      );

      // Fetch user profiles and article info for approved comments
      const approvedWithDetails = await Promise.all(
        (approvedData || []).map(async rawComment => {
          const baseComment = normalizeComment(rawComment as Record<string, unknown>);
          const [userProfile, article] = await Promise.all([
            supabase
              .from("profiles")
              .select("username, avatar_url")
              .eq("id", baseComment.user_id)
              .single(),
            supabase
              .from("articles")
              .select("title, slug")
              .eq("id", baseComment.article_id)
              .single(),
          ]);

          return {
            ...baseComment,
            user: normalizeUserProfile(
              userProfile.data as Record<string, unknown> | null | undefined
            ),
            article: normalizeArticleInfo(
              article.data as Record<string, unknown> | null | undefined
            ),
          };
        })
      );

      setPendingComments(pendingWithDetails);
      setApprovedComments(approvedWithDetails);
    } catch (error) {
      secureLogger.error("Error fetching comments", { error });
      toast({
        title: "Klaida",
        description: "Nepavyko gauti komentarų.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (commentId: string) => {
    setActionLoading(commentId);
    try {
      const { error } = await supabase
        .from("article_comments")
        .update({ is_approved: true })
        .eq("id", commentId);

      if (error) throw error;

      toast({
        title: "Patvirtinta!",
        description: "Komentaras patvirtintas ir dabar matomas visiems.",
      });

      fetchComments();
    } catch (error) {
      secureLogger.error("Error approving comment", { error, commentId });
      toast({
        title: "Klaida",
        description: "Nepavyko patvirtinti komentaro.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (commentId: string) => {
    setActionLoading(commentId);
    try {
      const { error } = await supabase
        .from("article_comments")
        .update({ is_deleted: true })
        .eq("id", commentId);

      if (error) throw error;

      toast({
        title: "Atmesta",
        description: "Komentaras atmestas ir nebus rodomas.",
      });

      fetchComments();
    } catch (error) {
      secureLogger.error("Error rejecting comment", { error, commentId });
      toast({
        title: "Klaida",
        description: "Nepavyko atmesti komentaro.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("Ar tikrai norite ištrinti šį komentarą?")) return;

    setActionLoading(commentId);
    try {
      const { error } = await supabase
        .from("article_comments")
        .update({ is_deleted: true })
        .eq("id", commentId);

      if (error) throw error;

      toast({
        title: "Ištrinta",
        description: "Komentaras ištrintas.",
      });

      fetchComments();
    } catch (error) {
      secureLogger.error("Error deleting comment", { error, commentId });
      toast({
        title: "Klaida",
        description: "Nepavyko ištrinti komentaro.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getInitials = (username: string | null) => {
    if (!username) return "V";
    return username.charAt(0).toUpperCase();
  };

  const CommentCard = ({ comment, isPending }: { comment: Comment; isPending: boolean }) => (
    <Card key={comment.id} className="mb-4">
      <CardContent className="p-4 md:pt-6">
        <div className="flex gap-3 md:gap-4">
          <Avatar className="h-8 w-8 md:h-10 md:w-10 flex-shrink-0">
            <AvatarImage src={comment.user?.avatar_url || undefined} />
            <AvatarFallback>{getInitials(comment.user?.username || null)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2 gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 mb-1">
                  <span className="font-semibold truncate">
                    {comment.user?.username || "Vartotojas"}
                  </span>
                  <span className="text-xs md:text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.created_at), {
                      addSuffix: true,
                      locale: lt,
                    })}
                  </span>
                </div>
                {comment.article && (
                  <Link
                    to={`/publikacijos/${comment.article.slug}`}
                    className="text-xs md:text-sm text-primary hover:underline flex items-center gap-1 truncate"
                  >
                    <span className="truncate">{comment.article.title}</span>
                    <ExternalLink className="h-3 w-3 flex-shrink-0" />
                  </Link>
                )}
              </div>
              {comment.parent_id && (
                <Badge
                  variant="secondary"
                  className="text-xs self-start md:self-auto flex-shrink-0"
                >
                  Atsakymas
                </Badge>
              )}
            </div>
            <p className="text-sm whitespace-pre-wrap mb-3 md:mb-4 bg-muted p-2 md:p-3 rounded-md break-words">
              {comment.content}
            </p>
            <div className="flex flex-col md:flex-row gap-2">
              {isPending ? (
                <>
                  <Button
                    size="sm"
                    onClick={() => handleApprove(comment.id)}
                    disabled={actionLoading === comment.id}
                    className="gap-2 w-full md:w-auto"
                  >
                    {actionLoading === comment.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    Patvirtinti
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleReject(comment.id)}
                    disabled={actionLoading === comment.id}
                    className="gap-2 w-full md:w-auto"
                  >
                    <X className="h-4 w-4" />
                    Atmesti
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(comment.id)}
                  disabled={actionLoading === comment.id}
                  className="gap-2 w-full md:w-auto"
                >
                  <Trash2 className="h-4 w-4" />
                  Ištrinti
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <MessageCircle className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Komentarų moderavimas</h1>
        </div>
        <p className="text-muted-foreground">Peržiūrėkite ir moderuokite vartotojų komentarus</p>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="pending" className="gap-1 md:gap-2 text-xs md:text-sm">
            <span className="hidden sm:inline">Laukiantys patvirtinimo</span>
            <span className="sm:hidden">Laukiantys</span>
            {pendingComments.length > 0 && (
              <Badge variant="destructive" className="ml-1 md:ml-2 text-xs">
                {pendingComments.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved" className="text-xs md:text-sm">
            Patvirtinti
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          {pendingComments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">Nėra laukiančių patvirtinimo komentarų</p>
              </CardContent>
            </Card>
          ) : (
            pendingComments.map(comment => (
              <CommentCard key={comment.id} comment={comment} isPending={true} />
            ))
          )}
        </TabsContent>

        <TabsContent value="approved" className="mt-6">
          {approvedComments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">Nėra patvirtintų komentarų</p>
              </CardContent>
            </Card>
          ) : (
            approvedComments.map(comment => (
              <CommentCard key={comment.id} comment={comment} isPending={false} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminCommentsModeration;
