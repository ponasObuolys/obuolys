import { Button } from "@/components/ui/button";
import CourseCard from "@/components/ui/course-card";
import { useSupabaseErrorHandler } from "@/hooks/useErrorHandler";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Course = Database["public"]["Tables"]["courses"]["Row"];

import { Helmet } from "react-helmet-async";

const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { handleError } = useSupabaseErrorHandler({
    componentName: "CoursesPage",
    showToast: false,
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("courses")
          .select("*")
          .eq("published", true)
          .order("title", { ascending: true });

        if (error) {
          throw error;
        }

        if (data) {
          setCourses(data);
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Nepavyko gauti kursų";
        const err = error instanceof Error ? error : new Error(errorMessage);
        handleError(err);
        toast({
          title: "Klaida",
          description: "Nepavyko gauti kursų. Bandykite vėliau.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [handleError, toast]);

  return (
    <>
      <Helmet>
        <title>Kursai | Ponas Obuolys</title>
        <meta
          name="description"
          content="AI kursai ir mokymai lietuvių kalba. Sužinokite, kaip panaudoti dirbtinį intelektą savo veikloje su Ponas Obuolys kursais!"
        />
        <meta property="og:title" content="Kursai | Ponas Obuolys" />
        <meta
          property="og:description"
          content="AI kursai ir mokymai lietuvių kalba. Sužinokite, kaip panaudoti dirbtinį intelektą savo veikloje su Ponas Obuolys kursais!"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ponasobuolys.lt/kursai" />
        <meta property="og:image" content="https://ponasobuolys.lt/og-cover.jpg" />
      </Helmet>
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="mb-4">
              <span className="gradient-text">Kursai</span>
            </h1>
            <p className="max-w-2xl mx-auto">
              Mūsų praktiniai kursai padės jums efektyviai panaudoti dirbtinį intelektą ir paversti
              jį pajamų šaltiniu
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">Kraunami kursai...</p>
            </div>
          ) : courses.length > 0 ? (
            <div className="courses-grid">
              {courses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">Šiuo metu kursų nėra</p>
            </div>
          )}

          <div className="mt-16 bg-white rounded-lg p-8 shadow text-center">
            <h2 className="text-2xl font-bold mb-4">Norite mokytis individualiai?</h2>
            <p className="mb-6 max-w-xl mx-auto">
              Siūlome individualius mokymus pagal jūsų poreikius ir tempą. Susisiekite su mumis ir
              aptarsime jūsų tikslus bei galimas mokymosi galimybes.
            </p>
            <Link to="/kontaktai">
              <Button className="button-outline">Susisiekti</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default CoursesPage;
