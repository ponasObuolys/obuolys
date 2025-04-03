import { useState, useEffect } from 'react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Clock, BookOpen, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import LazyImage from "@/components/ui/lazy-image";

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
        <div className="container mx-auto px-4">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {courses.map((course) => (
                <Card key={course.id} className="custom-card h-full flex flex-col">
                  {course.image_url && (
                    <div className="aspect-video w-full overflow-hidden">
                      <LazyImage
                        src={course.image_url}
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                      />
                    </div>
                  )}
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
