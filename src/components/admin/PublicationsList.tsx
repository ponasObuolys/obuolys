import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { createErrorReport, reportError } from "@/utils/errorReporting";
import { FilePenLine, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

// Type definition for article list items
type ArticleListItem = Pick<
  Tables<"articles">,
  | "id"
  | "title"
  | "slug"
  | "date"
  | "published"
  | "featured"
  | "content_type"
  | "description"
  | "content"
>;

interface PublicationsListProps {
  onEdit: (id: string) => void;
  onDelete: () => void;
}

/**
 * Publications list component for the admin dashboard
 * Uses custom fetch logic due to specific field selection and ordering requirements
 */
const PublicationsList = ({ onEdit, onDelete }: PublicationsListProps) => {
  const [publications, setPublications] = useState<ArticleListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPublications = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("id, title, slug, date, published, featured, content_type, description, content")
        .order("date", { ascending: false });

      if (error) throw error;
      setPublications((data as ArticleListItem[]) || []);
    } catch (error: unknown) {
      // Struktūrizuota klaidos registracija vietoje console.error
      reportError(
        createErrorReport(error as Error, {
          additionalData: { source: "PublicationsList.fetchPublications" },
        })
      );
      toast({
        title: "Klaida",
        description: "Nepavyko gauti publikacijų sąrašo.",
        variant: "destructive",
      });
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchPublications();
  }, [fetchPublications]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Ar tikrai norite ištrinti šią publikaciją?")) return;

    try {
      const { error } = await supabase.from("articles").delete().match({ id });

      if (error) throw error;

      toast({
        title: "Sėkmingai ištrinta",
        description: "Publikacija buvo sėkmingai ištrinta.",
      });

      fetchPublications();
      onDelete();
    } catch (error: unknown) {
      // Struktūrizuota klaidos registracija vietoje console.error
      reportError(
        createErrorReport(error as Error, {
          additionalData: { source: "PublicationsList.handleDelete", id },
        })
      );
      toast({
        title: "Klaida",
        description: `Nepavyko ištrinti publikacijos: ${
          error instanceof Error
            ? error.message
            : typeof error === "string"
              ? error
              : "nežinoma klaida"
        }`,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <p className="text-center py-4">Kraunama...</p>;
  }

  if (publications.length === 0) {
    return <p>Publikacijų nėra.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-left">Pavadinimas</TableHead>
          <TableHead className="text-left w-32">Data</TableHead>
          <TableHead className="text-left w-28">Statusas</TableHead>
          <TableHead className="text-left w-24">Tipas</TableHead>
          <TableHead className="text-left w-32">Rekomenduojama</TableHead>
          <TableHead className="text-right w-48">Veiksmai</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {publications.map(item => (
          <TableRow key={item.id}>
            <TableCell className="font-medium text-left">
              <div className="max-w-xs">
                <div className="truncate">{item.title}</div>
                {item.description && (
                  <div className="text-sm text-gray-500 truncate">{item.description}</div>
                )}
              </div>
            </TableCell>
            <TableCell className="text-left whitespace-nowrap">
              {new Date(item.date).toLocaleDateString("lt-LT")}
            </TableCell>
            <TableCell className="text-left">
              <span
                className={`inline-flex px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                  item.published ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {item.published ? "Publikuota" : "Juodraštis"}
              </span>
            </TableCell>
            <TableCell className="text-left">
              <span className="text-sm whitespace-nowrap">
                {item.content_type === "news" ? "Naujiena" : "Straipsnis"}
              </span>
            </TableCell>
            <TableCell className="text-left">
              <span
                className={`inline-flex px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                  item.featured ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                }`}
              >
                {item.featured ? "Taip" : "Ne"}
              </span>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm" onClick={() => onEdit(item.id)}>
                  <FilePenLine className="h-4 w-4 mr-1" /> Redaguoti
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="h-4 w-4 mr-1" /> Ištrinti
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PublicationsList;
