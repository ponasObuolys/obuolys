import React from 'react';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ToolSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const ToolSearch: React.FC<ToolSearchProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
      <Input
        type="text"
        placeholder="Ieškoti įrankių..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-12 pr-4 py-3 text-base border-2 border-input focus:border-primary transition-colors duration-200 ease-in-out rounded-lg shadow-sm bg-card text-card-foreground placeholder:text-muted-foreground"
        aria-label="Įrankių paieškos laukelis"
      />
    </div>
  );
};

export default ToolSearch; 