import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import CourseCard from "@/components/ui/course-card";

const CoursesPage = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('published', true)
          .order('title', { ascending: true });
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setCourses(data);
        }
      } catch (error: any) {
        toast({
          title: "Klaida",
          description: "Nepavyko gauti kursų. Bandykite vėliau.",
          variant: "destructive"
        });
        console.error("Error fetching courses:", error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, [toast]);

  return (
    <>
      <section className="py-12 md:py-16">
        <div className="full-width-container px-4">
          <div className="text-center mb-12">
            <h1 className="mb-4"><span className="gradient-text">Kursai</span></h1>
            <p className="max-w-2xl mx-auto">
              Mūsų praktiniai kursai padės jums efektyviai panaudoti dirbtinį intelektą ir paversti jį 
              pajamų šaltiniu
            </p>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">Kraunami kursai...</p>
            </div>
          ) : courses.length > 0 ? (
            <div className="courses-grid">
              {courses.map((course) => (
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
              Siūlome individualius mokymus pagal jūsų poreikius ir tempą. 
              Susisiekite su mumis ir aptarsime jūsų tikslus bei galimas mokymosi galimybes.
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
