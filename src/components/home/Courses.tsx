import { Button } from "@/components/ui/button";
import CourseCard from "@/components/ui/course-card";
import { useSupabaseErrorHandler } from "@/hooks/useErrorHandler";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Course = Database["public"]["Tables"]["courses"]["Row"];

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { handleError } = useSupabaseErrorHandler({ componentName: "Courses" });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("courses")
          .select("*")
          .eq("published", true)
          .limit(4);

        if (error) {
          throw error;
        }

        if (data) {
          setCourses(data);
        }
      } catch (error) {
        handleError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [handleError]);

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
          <div className="courses-grid">
            {courses.length > 0 ? (
              // Rodome turimus kursus
              courses.map(course => <CourseCard key={course.id} course={{...course, image_url: course.image_url ?? undefined}} />)
            ) : (
              // Jei nėra kursų, rodome pranešimą
              <div className="col-span-4 text-center">
                <p>Šiuo metu nėra aktyvių kursų</p>
              </div>
            )}
            {/* Jei turime mažiau nei 4 kursus, pridedame tuščias korteles, kad užpildytume vietą */}
            {courses.length > 0 &&
              courses.length < 4 &&
              Array.from({ length: 4 - courses.length }).map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="course-card-placeholder rounded-lg border border-dashed border-gray-600 h-[300px] flex items-center justify-center"
                >
                  <p className="text-gray-200">Netrukus bus daugiau kursų</p>
                </div>
              ))}
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
