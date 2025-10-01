import React from 'react';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
interface ToolSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const ToolSearch: React.FC<ToolSearchProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/60 h-4 w-4 pointer-events-none z-10" />
        <Input
          type="text"
          placeholder="Ieškoti įrankių..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-card border-border text-foreground placeholder:text-foreground/50 h-10"
          aria-label="Įrankių paieškos laukelis"
        />
      </div>
    </div>
  );
};

export default ToolSearch;