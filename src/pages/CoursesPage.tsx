import { Button } from "@/components/ui/button";
import CourseCard from "@/components/ui/course-card";
import { useSupabaseErrorHandler } from "@/hooks/useErrorHandler";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, Users, Star, MessageCircle } from "lucide-react";

import SEOHead from "@/components/SEO";
import { SITE_CONFIG } from "@/utils/seo";

type Course = Database["public"]["Tables"]["courses"]["Row"];

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
      <SEOHead
        title="AI Kursai ir Mokymai"
        description="Dirbtinio intelekto mokymai ir konsultacijos lietuvių kalba. Personalizuoti sprendimai ir praktiniai AI patarimai - ponas Obuolys"
        canonical={`${SITE_CONFIG.domain}/kursai`}
        keywords={['AI kursai', 'AI mokymai lietuviškai', 'dirbtinio intelekto kursai', 'ChatGPT mokymai', 'AI konsultacijos']}
        type="website"
      />
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="dark-card mb-8">
              <div className="text-center">
                <div className="flex items-center gap-3 mb-8 justify-center">
                  <span className="w-2 h-2 rounded-full bg-foreground/40"></span>
                  <span className="text-sm text-foreground/60">Mokymai ir konsultacijos</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  Personalizuoti AI mokymai
                </h1>

                <p className="text-xl text-foreground/80 max-w-3xl mx-auto mb-8">
                  Individualūs mokymai, praktiniai sprendimai ir konsultacijos dirbtinio intelekto srityje.
                  Pritaikyta jūsų verslo poreikiams ir tikslams.
                </p>

                <Link to="/kontaktai">
                  <Button className="button-primary">
                    Registruotis konsultacijai
                  </Button>
                </Link>
              </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {/* Individual Consultation */}
              <div className="project-card">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">
                      Individuali konsultacija
                    </h3>
                    <p className="text-sm text-foreground/60">1-1 pokalbis, pritaikyti sprendimai</p>
                  </div>
                </div>
                <p className="text-sm text-foreground/70 mb-4">
                  60 minučių asmeninis pokalbis apie jūsų verslo poreikius ir AI galimybes.
                  Gausite konkrečius rekomendacijas ir veiksmų planą.
                </p>
                <div className="flex items-center gap-4 text-xs text-foreground/50">
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>60 min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>Online/Offline</span>
                  </div>
                </div>
              </div>

              {/* Group Training */}
              <div className="project-card">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-green-600 flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">
                      Grupės mokymai
                    </h3>
                    <p className="text-sm text-foreground/60">Komandos, darbuotojai</p>
                  </div>
                </div>
                <p className="text-sm text-foreground/70 mb-4">
                  Specializuoti mokymai jūsų komandai arba organizacijai.
                  Praktiniai užsiėmimai su realiais pavyzdžiais ir įrankiais.
                </p>
                <div className="flex items-center gap-4 text-xs text-foreground/50">
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>2-4 val</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={12} />
                    <span>5-20 žmonių</span>
                  </div>
                </div>
              </div>

              {/* Workshop */}
              <div className="project-card">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-600 flex items-center justify-center flex-shrink-0">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">
                      AI dirbtuvės
                    </h3>
                    <p className="text-sm text-foreground/60">Intensyvūs praktiniai užsiėmimai</p>
                  </div>
                </div>
                <p className="text-sm text-foreground/70 mb-4">
                  Intensyvios praktinės dirbtuvės su konkretiais projektais.
                  Nuo AI įrankių iki sprendimų integracijos jūsų veikloje.
                </p>
                <div className="flex items-center gap-4 text-xs text-foreground/50">
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>1-2 dienos</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>Savaitgaliais</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Available Courses */}
            {courses.length > 0 && (
              <div className="mb-16">
                <div className="dark-card">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Aktualūs kursai</h2>
                  {loading ? (
                    <div className="text-center py-8">
                      <p className="text-foreground/60">Kraunami kursai...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {courses.map(course => (
                        <CourseCard key={course.id} course={course} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Process Section */}
            <div className="dark-card mb-16">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Kaip vyksta konsultacijos?
                </h2>
                <p className="text-foreground/80 max-w-2xl mx-auto">
                  Paprastas ir efektyvus procesas, pritaikytas jūsų poreikiams
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">1</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Pirminis pokalbis</h3>
                  <p className="text-sm text-foreground/70">
                    Aptariame jūsų tikslus, poreikius ir esamas AI naudojimo galimybes
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">2</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Sprendimų pasiūlymas</h3>
                  <p className="text-sm text-foreground/70">
                    Paruošiu individualų veiksmų planą su konkrečiais įrankiais ir metodais
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">3</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Įgyvendinimas</h3>
                  <p className="text-sm text-foreground/70">
                    Palydžiu sprendimų diegimo procese ir teikiu pagalbą viso kelio metu
                  </p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="dark-card text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Pradėkime jūsų AI kelionę
              </h2>
              <p className="text-xl text-foreground/80 mb-8 max-w-2xl mx-auto">
                Susisiekite dėl nemokamos konsultacijos ir sužinokite, kaip AI gali transformuoti jūsų veiklą.
                Pirmas pokalbis - visada nemokamas!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/kontaktai">
                  <Button className="button-primary">
                    Registruotis konsultacijai
                  </Button>
                </Link>
                <Button className="button-outline">
                  Sužinoti daugiau
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CoursesPage;
