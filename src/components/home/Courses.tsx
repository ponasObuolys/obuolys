import { Button } from "@/components/ui/button";
import CourseCard from "@/components/ui/course-card";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { useCourses } from "@/hooks/useSupabaseData";
import { useEffect } from "react";

const Courses = () => {
  const { toast } = useToast();

  // Naudojame React Query hook vietoj useState + useEffect (limituojame 2 kursus)
  const { data: courses = [], isLoading: loading, error } = useCourses(2);

  // Rodome klaidos pranešimą jei įvyko klaida (useEffect išvengia infinite loop)
  useEffect(() => {
    if (error) {
      toast({
        title: "Klaida",
        description: "Nepavyko gauti kursų. Bandykite vėliau.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 md:mb-12 text-center">
          <h2 className="mb-3">
            Mokykitės <span className="gradient-text">uždirbti</span> su AI
          </h2>
          <p>
            Mūsų praktiniai kursai padės jums efektyviai panaudoti dirbtinį intelektą ir paversti jį
            pajamų šaltiniu
          </p>
        </div>

        {loading ? (
          <div className="text-center">Kraunami kursai...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {courses.length > 0 ? (
              courses.map(course => (
                <CourseCard
                  key={course.id}
                  course={{ ...course, image_url: course.image_url ?? undefined }}
                />
              ))
            ) : (
              <div className="col-span-2 text-center">
                <p>Šiuo metu nėra aktyvių kursų</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 md:mt-12">
          <Link to="/kursai" className="block w-full sm:w-auto">
            <Button className="button-outline w-full sm:w-auto">Visi kursai</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Courses;
