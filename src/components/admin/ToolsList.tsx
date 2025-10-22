import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAdminList } from "@/hooks/useAdminList";
import { FilePenLine, Trash2, ExternalLink } from "lucide-react";

interface ToolsListProps {
  onEdit: (id: string) => void;
  onDelete: () => void;
}

/**
 * Tools list component for the admin dashboard
 */
const ToolsList = ({ onEdit, onDelete }: ToolsListProps) => {
  const {
    items: tools,
    loading,
    deleteItem,
  } = useAdminList<"tools">({
    tableName: "tools",
    selectFields: "*",
    orderByField: "created_at",
    orderDirection: "desc",
    onDelete,
  });

  const handleDelete = (id: string) => {
    deleteItem(id, "Ar tikrai norite ištrinti šį įrankį?");
  };

  if (loading) {
    return <p className="text-center py-4">Kraunama...</p>;
  }

  if (tools.length === 0) {
    return <p>Įrankių nerasta. Sukurkite naują įrankį.</p>;
  }

  return (
    <div className="space-y-3">
      {tools.map(tool => (
        <Card key={tool.id}>
          <CardContent className="p-3 md:p-4">
            <div className="space-y-3">
              {/* Title ir badges */}
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm md:text-base break-words">{tool.name}</h3>
                  {tool.description && (
                    <p className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-2">
                      {tool.description}
                    </p>
                  )}
                </div>
                <Badge
                  variant={tool.published ? "default" : "secondary"}
                  className="text-xs flex-shrink-0"
                >
                  {tool.published ? "Publikuota" : "Juodraštis"}
                </Badge>
              </div>

              {/* Info */}
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <div>
                  Kategorija: <span className="font-medium">{tool.category || "Nenurodyta"}</span>
                </div>
                {tool.featured && (
                  <Badge variant="outline" className="text-xs h-5">
                    ⭐ Rekomenduojamas
                  </Badge>
                )}
              </div>

              {/* URL */}
              {tool.url && (
                <div className="text-xs">
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1 truncate max-w-full"
                  >
                    <ExternalLink className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{tool.url}</span>
                  </a>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(tool.id)}
                  className="text-xs h-8"
                >
                  <FilePenLine className="h-4 w-4 mr-1" /> Redaguoti
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(tool.id)}
                  className="text-xs h-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ToolsList;
