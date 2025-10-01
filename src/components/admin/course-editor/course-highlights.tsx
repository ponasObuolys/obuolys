import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";

interface CourseHighlightsProps {
  highlights: string[];
  newHighlight: string;
  setNewHighlight: (value: string) => void;
  addHighlight: () => void;
  removeHighlight: (index: number) => void;
}

export const CourseHighlights = ({
  highlights,
  newHighlight,
  setNewHighlight,
  addHighlight,
  removeHighlight,
}: CourseHighlightsProps) => {
  return (
    <div className="border rounded-md p-4">
      <h3 className="text-lg font-medium mb-4">Kurso ypatybės</h3>
      <div className="space-y-2 mb-4">
        {highlights.map((highlight, index) => (
          <div key={index} className="flex items-center">
            <span className="flex-grow">{highlight}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeHighlight(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <Input
          placeholder="Pridėti naują ypatybę..."
          value={newHighlight}
          onChange={e => setNewHighlight(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") {
              e.preventDefault();
              addHighlight();
            }
          }}
        />
        <Button type="button" onClick={addHighlight}>
          <Plus className="h-4 w-4 mr-1" /> Pridėti
        </Button>
      </div>
    </div>
  );
};
