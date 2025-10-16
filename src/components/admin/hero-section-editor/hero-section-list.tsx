import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import type { HeroSection } from "./hero-section-editor.types";

interface HeroSectionListProps {
  heroSections: HeroSection[];
  loading: boolean;
  onEdit: (section: HeroSection) => void;
  onToggleActive: (section: HeroSection) => void;
  onDelete: (id: string) => void;
}

export const HeroSectionList = ({
  heroSections,
  loading,
  onEdit,
  onToggleActive,
  onDelete,
}: HeroSectionListProps) => {
  if (heroSections.length === 0 && !loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">Hero sekcijų nėra. Sukurkite naują hero sekciją.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {heroSections.map((section) => (
        <Card key={section.id} className={!section.active ? "opacity-60" : ""}>
          <CardContent className="p-3 md:p-4">
            <div className="space-y-3">
              {/* Title ir status */}
              <div className="flex items-start gap-2">
                {section.active ? (
                  <Eye className="h-4 w-4 text-green-600 flex-shrink-0 mt-1" />
                ) : (
                  <EyeOff className="h-4 w-4 text-gray-400 flex-shrink-0 mt-1" />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm md:text-base break-words">{section.title}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-2">{section.subtitle}</p>
                </div>
              </div>

              {/* Info */}
              <div className="flex flex-col gap-1 text-xs text-muted-foreground pl-6">
                <div className="truncate">Mygtukas: {section.button_text}</div>
                <div className="truncate">URL: {section.button_url}</div>
              </div>

              {/* Image */}
              {section.image_url && (
                <div className="pl-6">
                  <img
                    src={section.image_url}
                    alt="Hero"
                    className="w-full max-w-[200px] h-20 object-cover rounded border"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-2 border-t">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onEdit(section)} 
                  disabled={loading}
                  className="text-xs h-8"
                >
                  Redaguoti
                </Button>
                <Button
                  variant={section.active ? "secondary" : "default"}
                  size="sm"
                  onClick={() => onToggleActive(section)}
                  disabled={loading}
                  className="text-xs h-8"
                >
                  {section.active ? "Deaktyvuoti" : "Aktyvuoti"}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(section.id)}
                  disabled={loading}
                  className="text-xs h-8"
                >
                  Ištrinti
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
