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

interface CoursesListProps {
  onEdit: (id: string) => void;
  onDelete: () => void;
}

/**
 * Courses list component for the admin dashboard
 */
const CoursesList = ({ onEdit, onDelete }: CoursesListProps) => {
  const {
    items: courses,
    loading,
    deleteItem,
  } = useAdminList<"courses">({
    tableName: "courses",
    selectFields: "*",
    orderByField: "created_at",
    orderDirection: "desc",
    onDelete,
  });

  const handleDelete = (id: string) => {
    deleteItem(id, "Ar tikrai norite ištrinti šį kursą?");
  };

  if (loading) {
    return <p className="text-center py-4">Kraunama...</p>;
  }

  if (courses.length === 0) {
    return <p>Kursų nerasta. Sukurkite naują kursą.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Pavadinimas</TableHead>
          <TableHead>Kaina</TableHead>
          <TableHead>Lygis</TableHead>
          <TableHead>Publikuota</TableHead>
          <TableHead>Veiksmai</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {courses.map(course => (
          <TableRow key={course.id}>
            <TableCell className="font-medium">{course.title}</TableCell>
            <TableCell>{course.price}</TableCell>
            <TableCell>{course.level}</TableCell>
            <TableCell>{course.published ? "Taip" : "Ne"}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => onEdit(course.id)}>
                  <FilePenLine className="h-4 w-4 mr-1" /> Redaguoti
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(course.id)}>
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

export default CoursesList;
