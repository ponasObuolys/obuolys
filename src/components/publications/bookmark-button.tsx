import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { useBookmark } from "@/hooks/use-bookmark";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  articleId: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  showText?: boolean;
  className?: string;
}

export function BookmarkButton({
  articleId,
  variant = "outline",
  size = "default",
  showText = true,
  className,
}: BookmarkButtonProps) {
  const { isBookmarked, loading, toggleBookmark } = useBookmark({ articleId });

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleBookmark}
      disabled={loading}
      className={cn(
        "gap-2",
        isBookmarked && "bg-primary text-primary-foreground hover:bg-primary/90",
        className
      )}
    >
      <Bookmark
        className={cn(
          "h-4 w-4 transition-all",
          isBookmarked && "fill-current"
        )}
      />
      {showText && (
        <span>{isBookmarked ? "Išsaugota" : "Išsaugoti"}</span>
      )}
    </Button>
  );
}
