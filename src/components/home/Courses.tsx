
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Clock, BookOpen, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
          .limit(2);
          
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
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {courses.map((course) => (
              <Card key={course.id} className="custom-card h-full flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm font-medium py-1 px-3 rounded-full bg-accent/10 text-accent inline-block">
                      {course.level}
                    </div>
                    <div className="text-xl font-bold text-primary">{course.price}</div>
                  </div>
                  <CardTitle className="text-2xl">{course.title}</CardTitle>
                  <CardDescription className="text-base">{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="py-2 flex-grow">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Clock className="mr-2 h-5 w-5 text-primary" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="mr-2 h-5 w-5 text-primary" />
                      <span>0 mokinių</span>
                    </div>
                  </div>
                  <div className="mt-6">
                    <h4 className="font-bold text-md mb-2 flex items-center">
                      <BookOpen className="mr-2 h-5 w-5 text-primary" />
                      Kurso turinys:
                    </h4>
                    <ul className="space-y-2 pl-7 list-disc">
                      {course.highlights && course.highlights.map((item: string, index: number) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="pt-4">
                  <Link to={`/kursai/${course.slug}`} className="w-full">
                    <Button className="w-full button-primary">Sužinoti daugiau</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <p>Šiuo metu nėra aktyvių kursų</p>
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
