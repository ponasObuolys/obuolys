import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // Importuojame cn funkciją

interface ToolCategoriesProps {
  categories: string[];
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}

const ToolCategories: React.FC<ToolCategoriesProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setSelectedCategory(null)}
        className={cn(
          selectedCategory === null
            ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
            : "button-outline"
        )}
      >
        Visi
      </Button>
      {categories.map(category => (
        <Button
          key={category}
          variant="outline"
          size="sm"
          onClick={() => setSelectedCategory(category)}
          className={cn(
            selectedCategory === category
              ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
              : "button-outline"
          )}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default ToolCategories;
