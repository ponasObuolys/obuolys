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
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div>
        <h2 className="text-xl md:text-2xl font-bold">Kontaktų pranešimai</h2>
        <p className="text-sm md:text-base text-muted-foreground">
          Iš viso: {totalCount} | Neperskaityti: {unreadCount}
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange("all")}
          className="text-xs md:text-sm"
        >
          Visi
        </Button>
        <Button
          variant={filter === "unread" ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange("unread")}
          className="text-xs md:text-sm"
        >
          <span className="hidden sm:inline">Neperskaityti ({unreadCount})</span>
          <span className="sm:hidden">Nauji ({unreadCount})</span>
        </Button>
        <Button
          variant={filter === "read" ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange("read")}
          className="text-xs md:text-sm"
        >
          Perskaityti
        </Button>
      </div>
    </div>
  );
};
