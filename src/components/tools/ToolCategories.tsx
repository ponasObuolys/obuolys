import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // Importuojame cn funkciją

interface ToolCategoriesProps {
  categories: string[];
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}

const ToolCategories: React.FC<ToolCategoriesProps> = ({ categories, selectedCategory, setSelectedCategory }) => {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        onClick={() => setSelectedCategory(null)}
        className={cn(
          "px-4 py-2 h-auto rounded-full transition-colors duration-200",
          selectedCategory === null 
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "border-border hover:bg-accent hover:text-accent-foreground"
        )}
      >
        Visi
      </Button>
      {categories.map(category => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          onClick={() => setSelectedCategory(category)}
          className={cn(
            "px-4 py-2 h-auto rounded-full transition-colors duration-200",
            selectedCategory === category 
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "border-border hover:bg-accent hover:text-accent-foreground"
          )}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default ToolCategories; 