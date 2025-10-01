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
    <div className="grid gap-4">
      {heroSections.map((section) => (
        <Card key={section.id} className={!section.active ? "opacity-60" : ""}>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-semibold">{section.title}</h3>
                  {section.active ? (
                    <Eye className="h-4 w-4 text-green-600" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  )}
                </div>
                <p className="text-gray-600 mb-3">{section.subtitle}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Mygtukas: {section.button_text}</span>
                  <span>•</span>
                  <span>Nuoroda: {section.button_url}</span>
                </div>
                {section.image_url && (
                  <div className="mt-4">
                    <img
                      src={section.image_url}
                      alt="Hero sekcijos paveikslėlis"
                      className="w-full max-w-xs h-24 object-cover rounded border"
                    />
                  </div>
                )}
              </div>
              <div className="flex space-x-2 ml-4">
                <Button variant="outline" size="sm" onClick={() => onEdit(section)} disabled={loading}>
                  Redaguoti
                </Button>
                <Button
                  variant={section.active ? "secondary" : "default"}
                  size="sm"
                  onClick={() => onToggleActive(section)}
                  disabled={loading}
                >
                  {section.active ? "Deaktyvuoti" : "Aktyvuoti"}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(section.id)}
                  disabled={loading}
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
