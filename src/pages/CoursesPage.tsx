import { Button } from "@/components/ui/button";
import { ShinyButton } from "@/components/ui/shiny-button";
import CourseCard from "@/components/ui/course-card";
import { CourseCardSkeleton } from "@/components/ui/course-card-skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { Users, Star, MessageCircle, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import SEOHead from "@/components/SEO";
import { SITE_CONFIG } from "@/utils/seo";
import { useCourses } from "@/hooks/useSupabaseData";
import { getServiceContent } from "@/data/coursesData";
import { ServiceCard } from "@/components/courses/ServiceCard";

const BusinessSolutionsCTA = lazy(() =>
  import("@/components/cta/business-solutions-cta").then(module => ({
    default: module.BusinessSolutionsCTA,
  }))
);

type ServiceType = "individual" | "group" | "workshop" | null;

const CoursesPage = () => {
  // State for selected service modal
  const [selectedService, setSelectedService] = useState<ServiceType>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const { toast } = useToast();

  // Naudojame React Query hook vietoj useState + useEffect
  const { data: courses = [], isLoading: loading, error } = useCourses();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  const handleMouseMove = (e: React.MouseEvent) => {
    setTooltipPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const serviceContent = selectedService ? getServiceContent(selectedService) : null;

  return (
    <>
      {/* Custom cursor-following tooltip - only on desktop */}
      {showTooltip && (
        <div
          className="hidden md:block fixed z-[100] pointer-events-none bg-primary text-white font-medium text-sm px-4 py-2 rounded-lg shadow-lg"
          style={{
            left: `${tooltipPosition.x + 15}px`,
            top: `${tooltipPosition.y + 15}px`,
          }}
        >
          Paspauskite, kad gautumėte daugiau informacijos
        </div>
      )}

      <Dialog open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {serviceContent && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-foreground mb-2">
                  {serviceContent.title}
                </DialogTitle>
                <DialogDescription className="text-lg text-foreground/80">
                  {serviceContent.subtitle}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                <p className="text-foreground/90 leading-relaxed">{serviceContent.description}</p>

                {serviceContent.sections.map((section, idx) => (
                  <div key={idx} className="space-y-3">
                    <h3 className="text-lg font-semibold text-foreground">{section.title}</h3>
                    <ul className="space-y-2">
                      {section.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="flex items-start gap-2 text-foreground/80">
                          <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                <div className="border-t border-border pt-4 mt-6">
                  <p className="text-sm font-medium text-foreground/90">{serviceContent.footer}</p>
                </div>

                <div className="flex gap-3 mt-6">
                  <Link to="/kontaktai?type=KONSULTACIJA" className="flex-1">
                    <ShinyButton className="w-full">Registruotis dabar</ShinyButton>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedService(null)}
                    className="button-outline"
                  >
                    Uždaryti
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <SEOHead
        title="AI Kursai ir Mokymai"
        description="Dirbtinio intelekto mokymai ir konsultacijos lietuvių kalba. Personalizuoti sprendimai ir praktiniai AI patarimai - ponas Obuolys"
        canonical={`${SITE_CONFIG.domain}/kursai`}
        keywords={[
          "AI kursai",
          "AI mokymai lietuviškai",
          "dirbtinio intelekto kursai",
          "ChatGPT mokymai",
          "AI konsultacijos",
        ]}
        type="website"
      />
      <section className="py-12 md:py-16 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="dark-card mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-2 h-2 rounded-full bg-foreground/40"></span>
                    <span className="text-sm text-foreground/90">Mokymai ir konsultacijos</span>
                  </div>

                  <h1 className="text-4xl md:text-5xl font-bold mb-4 text-left">
                    Personalizuoti AI mokymai
                  </h1>

                  <p className="text-xl text-foreground/90 max-w-2xl text-left">
                    Individualūs mokymai, praktiniai sprendimai ir konsultacijos dirbtinio intelekto
                    srityje. Pritaikyta jūsų verslo poreikiams ir tikslams.
                  </p>
                </div>
                <Link to="/kontaktai?type=KONSULTACIJA" className="w-full sm:w-auto">
                  <ShinyButton className="w-full sm:w-auto">
                    Registruotis konsultacijai
                  </ShinyButton>
                </Link>
              </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Individual Consultation */}
              <ServiceCard
                title="Individuali konsultacija"
                subtitle="1-1 pokalbis, pritaikyti sprendimai"
                description="60 minučių asmeninis pokalbis apie jūsų verslo poreikius ir AI galimybes. Gausite konkrečius rekomendacijas ir veiksmų planą."
                duration="60 min"
                format="Online/Offline"
                icon={<MessageCircle className="w-6 h-6 text-white" />}
                colorClass="bg-blue-600"
                onClick={() => setSelectedService("individual")}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              />

              {/* Group Training */}
              <ServiceCard
                title="Grupės mokymai"
                subtitle="Komandos, darbuotojai"
                description="Specializuoti mokymai jūsų komandai arba organizacijai. Praktiniai užsiėmimai su realiais pavyzdžiais ir įrankiais."
                duration="2-4 val"
                format="5-20 žmonių"
                icon={<Users className="w-6 h-6 text-white" />}
                colorClass="bg-green-600"
                onClick={() => setSelectedService("group")}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              />

              {/* Workshop */}
              <ServiceCard
                title="AI dirbtuvės"
                subtitle="Intensyvūs praktiniai užsiėmimai"
                description="Intensyvios praktinės dirbtuvės su konkrečiais projektais. Nuo AI įrankių iki sprendimų integracijos jūsų veikloje."
                duration="1-2 dienos"
                format="Savaitgaliais"
                icon={<Star className="w-6 h-6 text-white" />}
                colorClass="bg-purple-600"
                onClick={() => setSelectedService("workshop")}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              />
            </div>

            {/* Available Courses */}
            <div className="mb-12">
              <div className="dark-card">
                <h2 className="text-2xl font-bold text-foreground mb-6 text-left">
                  Aktualūs kursai
                </h2>
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <CourseCardSkeleton key={index} />
                    ))}
                  </div>
                ) : courses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map(course => (
                      <CourseCard
                        key={course.id}
                        course={{
                          ...course,
                          image_url: course.image_url ?? undefined,
                        }}
                      />
                    ))}
                    {/* Placeholder for future courses */}
                    <div className="project-card flex flex-col items-center justify-center min-h-[400px] border-dashed opacity-60 hover:opacity-80 transition-opacity">
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                          <svg
                            className="w-8 h-8 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </div>
                        <h3 className="font-semibold text-foreground mb-2">Netrukus bus daugiau</h3>
                        <p className="text-sm text-foreground/60">Ruošiami nauji kursai</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="project-card flex flex-col items-center justify-center min-h-[200px] opacity-80">
                    <div className="text-center">
                      <h3 className="font-semibold text-foreground mb-2">Šiuo metu kursų nėra</h3>
                      <p className="text-sm text-foreground/60">
                        Sekite naujienas – netrukus atsiras naujų AI mokymų.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* CTA - Po kursų sąrašo */}
            <div className="my-12">
              <Suspense fallback={<div className="h-48 bg-muted/20 rounded-lg animate-pulse" />}>
                <BusinessSolutionsCTA variant="compact" context="publications" />
              </Suspense>
            </div>

            {/* Process Section */}
            <div className="dark-card mb-12">
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
              <h2 className="text-3xl font-bold text-foreground mb-4">Pradėkime jūsų AI kelionę</h2>
              <p className="text-xl text-foreground/80 mb-8 max-w-2xl mx-auto">
                Susisiekite dėl nemokamos konsultacijos ir sužinokite, kaip AI gali transformuoti
                jūsų veiklą. Pirmas pokalbis - visada nemokamas!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/kontaktai">
                  <ShinyButton>Registruotis konsultacijai</ShinyButton>
                </Link>
                <Button variant="outline">Sužinoti daugiau</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CoursesPage;
