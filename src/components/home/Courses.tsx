import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import CourseCard from "@/components/ui/course-card";

const Courses = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('published', true)
          .limit(4);
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setCourses(data);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, []);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="mb-4">Mokykitės <span className="gradient-text">uždirbti</span> su AI</h2>
          <p className="max-w-2xl mx-auto">
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
              courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))
            ) : (
              // Jei nėra kursų, rodome pranešimą
              <div className="col-span-4 text-center">
                <p>Šiuo metu nėra aktyvių kursų</p>
              </div>
            )}
            {/* Jei turime mažiau nei 4 kursus, pridedame tuščias korteles, kad užpildytume vietą */}
            {courses.length > 0 && courses.length < 4 && (
              Array.from({ length: 4 - courses.length }).map((_, index) => (
                <div key={`empty-${index}`} className="course-card-placeholder rounded-lg border border-dashed border-gray-300 h-[300px] flex items-center justify-center">
                  <p className="text-gray-400">Netrukus bus daugiau kursų</p>
                </div>
              ))
            )}
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link to="/kursai">
            <Button className="button-outline">Visi kursai</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Courses;
