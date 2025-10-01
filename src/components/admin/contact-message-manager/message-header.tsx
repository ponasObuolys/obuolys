import { Button } from "@/components/ui/button";
import type { MessageFilter } from "./contact-message-manager.types";

interface MessageHeaderProps {
  totalCount: number;
  unreadCount: number;
  filter: MessageFilter;
  onFilterChange: (filter: MessageFilter) => void;
}

export const MessageHeader = ({
  totalCount,
  unreadCount,
  filter,
  onFilterChange,
}: MessageHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold">Kontaktų pranešimai</h2>
        <p className="text-muted-foreground">
          Iš viso: {totalCount} | Neperskaityti: {unreadCount}
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange("all")}
        >
          Visi
        </Button>
        <Button
          variant={filter === "unread" ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange("unread")}
        >
          Neperskaityti ({unreadCount})
        </Button>
        <Button
          variant={filter === "read" ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange("read")}
        >
          Perskaityti
        </Button>
      </div>
    </div>
  );
};
