import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    <>
      {/* Desktop lentelė */}
      <div className="hidden md:block">
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
      </div>

      {/* Mobile kortelės */}
      <div className="md:hidden grid gap-3">
        {courses.map(course => (
          <Card key={course.id}>
            <CardContent className="p-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{course.title}</h3>
                  </div>
                  <Badge variant={course.published ? "default" : "secondary"} className="text-xs flex-shrink-0">
                    {course.published ? "Publikuota" : "Juodraštis"}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-3 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">Kaina:</span>
                    <span className="font-medium">{course.price}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">Lygis:</span>
                    <span className="font-medium">{course.level}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onEdit(course.id)}
                    className="flex-1"
                  >
                    <FilePenLine className="h-4 w-4 mr-1" /> Redaguoti
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => handleDelete(course.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default CoursesList;
