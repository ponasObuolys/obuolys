import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminList } from "@/hooks/useAdminList";
import { FilePenLine, Trash2 } from "lucide-react";

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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-left">Pavadinimas</TableHead>
          <TableHead className="text-left w-32">Kategorija</TableHead>
          <TableHead className="text-left w-32">Rekomenduojamas</TableHead>
          <TableHead className="text-left w-28">Publikuota</TableHead>
          <TableHead className="text-left w-20">URL</TableHead>
          <TableHead className="text-right w-48">Veiksmai</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tools.map(tool => (
          <TableRow key={tool.id}>
            <TableCell className="font-medium text-left">
              <div className="max-w-xs">
                <div className="truncate">{tool.name}</div>
                {tool.description && (
                  <div className="text-sm text-gray-500 truncate">{tool.description}</div>
                )}
              </div>
            </TableCell>
            <TableCell className="text-left">
              <span className="text-sm whitespace-nowrap">{tool.category || "Nenurodyta"}</span>
            </TableCell>
            <TableCell className="text-left">
              <span
                className={`inline-flex px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                  tool.featured ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                }`}
              >
                {tool.featured ? "Taip" : "Ne"}
              </span>
            </TableCell>
            <TableCell className="text-left">
              <span
                className={`inline-flex px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                  tool.published ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {tool.published ? "Taip" : "Ne"}
              </span>
            </TableCell>
            <TableCell className="text-left">
              {tool.url && (
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-xs truncate max-w-20 block"
                >
                  Lankytis
                </a>
              )}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm" onClick={() => onEdit(tool.id)}>
                  <FilePenLine className="h-4 w-4 mr-1" /> Redaguoti
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(tool.id)}>
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

export default ToolsList;
