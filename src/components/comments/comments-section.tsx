import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Send, Loader2 } from "lucide-react";
import { secureLogger } from "@/utils/browserLogger";
import type { Tables } from "@/integrations/supabase/types";
import { formatDistanceToNow } from "date-fns";
import { lt } from "date-fns/locale";

type CommentProfile = {
  username: string | null;
  avatar_url: string | null;
};

type Comment = Tables<"article_comments"> & {
  user?: CommentProfile;
  replies?: Comment[];
};

interface CommentsSectionProps {
  articleId: string;
}

export function CommentsSection({ articleId }: CommentsSectionProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const { data: commentsData, error } = await supabase
        .from("article_comments")
        .select("*")
        .eq("article_id", articleId)
        .eq("is_approved", true)
        .eq("is_deleted", false)
        .is("parent_id", null)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch user profiles and replies for each comment
      const commentsWithReplies = await Promise.all(
        (commentsData || []).map(async (comment) => {
          // Fetch user profile
          const { data: userProfile } = await supabase
            .from("profiles")
            .select("username, avatar_url")
            .eq("id", comment.user_id)
            .single();

          // Fetch replies
          const { data: repliesData } = await supabase
            .from("article_comments")
            .select("*")
            .eq("parent_id", comment.id)
            .eq("is_approved", true)
            .eq("is_deleted", false)
            .order("created_at", { ascending: true });

          // Fetch profiles for replies
          const repliesWithProfiles = await Promise.all(
            (repliesData || []).map(async (reply) => {
              const { data: replyUserProfile } = await supabase
                .from("profiles")
                .select("username, avatar_url")
                .eq("id", reply.user_id)
                .single();

              return {
                ...reply,
                user: replyUserProfile || undefined,
              };
            })
          );

          return {
            ...comment,
            user: userProfile || undefined,
            replies: repliesWithProfiles,
          } as Comment;
        })
      );

      setComments(commentsWithReplies);
    } catch (error) {
      secureLogger.error("Error fetching comments", { error, articleId });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!user) {
      toast({
        title: "Prisijunkite",
        description: "Norėdami komentuoti, turite prisijungti.",
        variant: "destructive",
      });
      return;
    }

    if (!newComment.trim()) {
      toast({
        title: "Tuščias komentaras",
        description: "Įveskite komentaro tekstą.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("article_comments").insert({
        article_id: articleId,
        user_id: user.id,
        content: newComment.trim(),
        is_approved: false, // Requires admin approval
      });

      if (error) throw error;

      setNewComment("");
      toast({
        title: "Komentaras pateiktas!",
        description: "Jūsų komentaras bus rodomas po moderatoriaus patvirtinimo.",
      });
    } catch (error) {
      secureLogger.error("Error submitting comment", { error });
      toast({
        title: "Klaida",
        description: "Nepavyko pateikti komentaro. Bandykite vėliau.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!user) {
      toast({
        title: "Prisijunkite",
        description: "Norėdami atsakyti, turite prisijungti.",
        variant: "destructive",
      });
      return;
    }

    if (!replyContent.trim()) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from("article_comments").insert({
        article_id: articleId,
        user_id: user.id,
        parent_id: parentId,
        content: replyContent.trim(),
        is_approved: false,
      });

      if (error) throw error;

      setReplyContent("");
      setReplyingTo(null);
      toast({
        title: "Atsakymas pateiktas!",
        description: "Jūsų atsakymas bus rodomas po moderatoriaus patvirtinimo.",
      });
    } catch (error) {
      secureLogger.error("Error submitting reply", { error });
      toast({
        title: "Klaida",
        description: "Nepavyko pateikti atsakymo. Bandykite vėliau.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = (username: string | null) => {
    if (!username) return "V";
    return username.charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <div className="mt-16 border-t border-border pt-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16 border-t border-border pt-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <MessageCircle className="h-6 w-6" />
          <h2 className="text-2xl font-bold">
            Komentarai ({comments.length})
          </h2>
        </div>

        {/* New comment form */}
        <div className="mb-8 bg-card border border-border rounded-lg p-4">
          <Textarea
            placeholder={user ? "Parašykite komentarą..." : "Prisijunkite, kad galėtumėte komentuoti"}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={!user || submitting}
            rows={4}
            className="mb-3"
          />
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Komentarai moderuojami. Jūsų komentaras bus rodomas po patvirtinimo.
            </p>
            <Button
              onClick={handleSubmitComment}
              disabled={!user || submitting || !newComment.trim()}
              className="gap-2"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Siųsti
            </Button>
          </div>
        </div>

        {/* Comments list */}
        <div className="space-y-6">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Dar nėra komentarų. Būkite pirmas!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="bg-card border border-border rounded-lg p-4">
                <div className="flex gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={comment.user?.avatar_url || undefined} />
                    <AvatarFallback>
                      {getInitials(comment.user?.username || null)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">
                        {comment.user?.username || "Vartotojas"}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.created_at), {
                          addSuffix: true,
                          locale: lt,
                        })}
                      </span>
                    </div>
                    <p className="text-sm mb-3 whitespace-pre-wrap">{comment.content}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyingTo(comment.id)}
                      className="text-xs"
                    >
                      Atsakyti
                    </Button>

                    {/* Reply form */}
                    {replyingTo === comment.id && (
                      <div className="mt-3 ml-4 border-l-2 border-border pl-4">
                        <Textarea
                          placeholder="Parašykite atsakymą..."
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          disabled={submitting}
                          rows={3}
                          className="mb-2"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSubmitReply(comment.id)}
                            disabled={submitting || !replyContent.trim()}
                          >
                            {submitting ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              "Siųsti"
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyContent("");
                            }}
                          >
                            Atšaukti
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-4 ml-4 space-y-4 border-l-2 border-border pl-4">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={reply.user?.avatar_url || undefined} />
                              <AvatarFallback className="text-xs">
                                {getInitials(reply.user?.username || null)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-sm">
                                  {reply.user?.username || "Vartotojas"}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(new Date(reply.created_at), {
                                    addSuffix: true,
                                    locale: lt,
                                  })}
                                </span>
                              </div>
                              <p className="text-sm whitespace-pre-wrap">{reply.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
