import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Publication {
  id: string;
  title: string;
  date: string;
  image: string;
}

interface Course {
  id: string;
  title: string;
  image: string;
  progress: number;
}

interface ActivityTabProps {
  savedPublications: Publication[];
  enrolledCourses: Course[];
  isLoading: boolean;
}

export const ActivityTab = ({
  savedPublications,
  enrolledCourses,
  isLoading,
}: ActivityTabProps) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Išsaugotos publikacijos */}
      <Card>
        <CardHeader>
          <CardTitle>Išsaugotos publikacijos</CardTitle>
          <CardDescription>Jūsų išsaugotos ir pamėgtos publikacijos</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Kraunama...</p>
          ) : savedPublications.length === 0 ? (
            <p className="text-muted-foreground">Neturite išsaugotų publikacijų</p>
          ) : (
            <div className="space-y-4">
              {savedPublications.map(pub => (
                <div key={pub.id} className="flex items-center space-x-4 p-4 border rounded-md">
                  <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
                    <img src={pub.image} alt={pub.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{pub.title}</h3>
                    <p className="text-sm text-muted-foreground">{pub.date}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Peržiūrėti
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Prenumeruojami kursai */}
      <Card>
        <CardHeader>
          <CardTitle>Kursų prenumeratos</CardTitle>
          <CardDescription>Jūsų prenumeruojami kursai ir mokymosi progresas</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Kraunama...</p>
          ) : enrolledCourses.length === 0 ? (
            <p className="text-muted-foreground">Neturite prenumeruojamų kursų</p>
          ) : (
            <div className="space-y-4">
              {enrolledCourses.map(course => (
                <div key={course.id} className="p-4 border rounded-md">
                  <div className="flex items-center space-x-4 mb-2">
                    <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{course.title}</h3>
                      <p className="text-sm text-muted-foreground">Progresas: {course.progress}%</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      Tęsti
                    </Button>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-primary h-2.5 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
