import { Button } from "@/components/ui/button";
import CourseCard from "@/components/ui/course-card";
import { CourseCardSkeleton } from "@/components/ui/course-card-skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, Users, Star, MessageCircle, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import SEOHead from "@/components/SEO";
import { SITE_CONFIG } from "@/utils/seo";
import { BusinessSolutionsCTA } from "@/components/cta/business-solutions-cta";
import { useCourses } from "@/hooks/useSupabaseData";

type ServiceType = "individual" | "group" | "workshop" | null;

const CoursesPage = () => {
  const [selectedService, setSelectedService] = useState<ServiceType>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const { toast } = useToast();

  // Naudojame React Query hook vietoj useState + useEffect
  const { data: courses = [], isLoading: loading, error } = useCourses();

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

  const getServiceContent = (service: ServiceType) => {
    switch (service) {
      case "individual":
        return {
          title: "1-1 AI konsultacija su praktiniais sprendimais",
          subtitle: "Asmeninė konsultacija su AI specialistu",
          description:
            "Asmeninė konsultacija su AI specialistu – tai 60 minučių intensyvus pokalbis, kurio metu gaunate praktines rekomendacijas ir konkrečius AI sprendimus būtent jūsų situacijai. Ne teorija, o realūs įrankiai ir metodai.",
          sections: [
            {
              title: "Konsultacijos turinys:",
              items: [
                "Praktinis ChatGPT, Claude, Gemini panaudojimas kasdieniam darbui",
                "AI įrankių įdiegimas jūsų darbo procese per 24 val",
                "Efektyvaus prompt kūrimo technikos (prompt engineering)",
                "Verslo procesų automatizavimas su AI asistentais",
                "Turinio kūrimas su dirbtinio intelekto pagalba (tekstai, vaizdai, video)",
                "AI sprendimų sąnaudų optimizavimas",
                "Konkretūs pavyzdžiai ir šablonai jūsų sričiai",
              ],
            },
            {
              title: "Idealu:",
              items: [
                "Savarankiškai dirbantiems ir freelanceriams",
                "Įmonių darbuotojams, siekiantiems produktyvumo",
                "Rinkodarininkams ir turinio kūrėjams",
                "Klientų aptarnavimo specialistams",
              ],
            },
          ],
          footer: "Garantija: Gaunate darbo šablonus, prompt bibliotekų ir AI įrankių sąrašą",
          keywords:
            "AI konsultacija online, ChatGPT mokymai lietuviškai, praktiniai AI sprendimai, AI įrankiai verslui, dirbtinio intelekto mokymai, generatyvioji AI, turinio kūrimas su AI, automatizavimas",
        };
      case "group":
        return {
          title: "Korporatyviniai AI mokymai jūsų komandai",
          subtitle: "Specializuoti dirbtinio intelekto mokymai",
          description:
            "Specializuoti dirbtinio intelekto mokymai, pritaikyti jūsų organizacijos poreikiams. Mokome 5-20 darbuotojų, kaip efektyviai naudoti AI įrankius kasdienėje veikloje ir padidinti komandos produktyvumą iki 40%.",
          sections: [
            {
              title: "Mokymo programa:",
              items: [
                "ChatGPT, Claude, Gemini ir kitos AI platformos",
                "Praktiniai AI panaudojimo scenarijai pagal jūsų veiklos sritį",
                "Verslo procesų automatizavimas su AI",
                "Prompt engineering mokymų sesijos",
                "Turinio generavimas su dirbtinio intelekto pagalba",
                "AI integracijos strategija organizacijoje",
                "Duomenų saugumas ir etika naudojant AI",
                "Komandos produktyvumo optimizavimas",
              ],
            },
            {
              title: "Mokymo eiga:",
              items: [
                "Pirminis poreikių tyrimas",
                "Pritaikyta programa jūsų sričiai (IT, rinkodara, pardavimai, klientų aptarnavimas)",
                "Praktiniai užsiėmimai su realiais jūsų projektų pavyzdžiais",
                "Darbo šablonų ir prompt bibliotekų sukūrimas",
                "Po-mokymo palaikymas 30 dienų",
              ],
            },
            {
              title: "Kam skirta:",
              items: [
                "Vidutinėms ir didelėms įmonėms",
                "IT komandom",
                "Rinkodaros ir komunikacijos skyriams",
                "Klientų aptarnavimo komandom",
                "Valdymo komandom",
              ],
            },
          ],
          footer:
            "Trukmė: 2-4 valandos (pritaikoma) | Dalyviai: 5-20 žmonių | Formatas: Online arba On-site",
          keywords:
            "AI mokymai įmonėms, ChatGPT mokymai komandai, dirbtinio intelekto mokymai verslui, korporatyviniai AI mokymai, AI produktyvumas, komandos mokymas, generatyvioji AI verslui",
        };
      case "workshop":
        return {
          title: "AI dirbtuvės: nuo idėjos iki veikiančio produkto",
          subtitle: "Du dienų AI workshop'as su VIBE CODING",
          description:
            "Du dienų AI workshop'as, kurio metu sukuriate realų AI sprendimą savo verslui ar projektui. Dirbtuvių pabaigoje turite veikiantį prototipą ir planą tolimesnei plėtrai. Įskaitant VIBE CODING su Claude Code, Cursor, Windsurf - moderniausiomis AI programavimo priemonėmis.",
          sections: [
            {
              title: "Šeštadienis – Projektavimas ir prototipavimas:",
              items: [
                "09:00-10:30 - AI galimybių ir įrankių apžvalga",
                "10:45-12:30 - Jūsų projekto idėjos analizė ir AI architektūros projektavimas",
                "13:30-15:30 - Prompt engineering ir AI workflow kūrimas + VIBE CODING įvadas",
                "15:45-18:00 - Prototipo kūrimas su Claude Code/Cursor/Windsurf mentoriaus pagalba",
              ],
            },
            {
              title: "Sekmadienis – Integracijos ir automatizavimas:",
              items: [
                "09:00-11:00 - AI API integracijos ir automatizavimas su VIBE CODING",
                "11:15-13:00 - Testavimas ir optimizavimas",
                "14:00-16:00 - Deployment ir produkcijos paruošimas",
                "16:15-17:30 - Projektų pristatymai ir feedback",
                "17:30-18:00 - Plėtros planas ir gairės",
              ],
            },
            {
              title: "VIBE CODING sesijos:",
              items: [
                "Claude Code (Anthropic) - AI asistuotas kodo rašymas",
                "Cursor - kodo užbaigimas ir refaktoringas su AI",
                "Windsurf - modernios AI development aplinkos",
                "OpenAI Codex integracijos",
                "Realaus kodo generavimas ir optimizavimas",
                "Best practices dirbtiniam intelektui koduoti",
              ],
            },
            {
              title: "Ką išsinešite:",
              items: [
                "Veikiantį AI prototipą / MVP",
                "Pilną kodą su dokumentacija",
                "AI architektūros diagramas",
                "Deployment instrukcijas",
                "VIBE CODING šablonus ir workflow'us",
                "Prieigų prie AI įrankių (14-30 dienų trial)",
                "Bendruomenės prieigą ir palaikymą",
              ],
            },
            {
              title: "Projektų pavyzdžiai:",
              items: [
                "AI chatbotai klientų aptarnavimui",
                "Automatinė turinio generavimo sistema",
                "Duomenų analizės ir insights platformos",
                "Asmeniniai AI asistentai specifinėms užduotims",
                "AI įrankiai produktyvumui didinti",
                "Custom GPT su jūsų duomenų baze",
              ],
            },
          ],
          footer:
            "Reikalavimai: Bazinės programavimo žinios (Python arba JavaScript) | Nešiojamas kompiuteris | Idėja arba problema",
          keywords:
            "AI workshop Lietuvoje, VIBE CODING, Claude Code, Cursor, Windsurf, dirbtinio intelekto kursai, AI projektų kūrimas, praktiniai AI mokymai, ChatGPT API, AI prototipas, custom GPT, AI chatbot kūrimas",
        };
      default:
        return null;
    }
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
                    <Button className="button-primary w-full">Registruotis dabar</Button>
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
      <section className="py-12 md:py-16">
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
                  <Button className="button-primary flex items-center justify-center gap-2 w-full sm:w-auto">
                    Registruotis konsultacijai
                  </Button>
                </Link>
              </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Individual Consultation */}
              <div
                className="project-card flex flex-col h-full"
                onClick={() => setSelectedService("individual")}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === "Enter" && setSelectedService("individual")}
              >
                {/* Header section - fixed */}
                <div className="flex items-start gap-3 mb-4 min-h-[80px]">
                  <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1 text-left">
                      Individuali konsultacija
                    </h3>
                    <p className="text-sm text-foreground/90 text-left">
                      1-1 pokalbis, pritaikyti sprendimai
                    </p>
                  </div>
                </div>

                {/* Description section - flexible */}
                <div className="flex-1 mb-4">
                  <p className="text-sm text-foreground/70 text-left">
                    60 minučių asmeninis pokalbis apie jūsų verslo poreikius ir AI galimybes.
                    Gausite konkrečius rekomendacijas ir veiksmų planą.
                  </p>
                </div>

                {/* Metadata section - fixed at bottom */}
                <div className="flex items-center gap-4 text-xs text-foreground/50 pt-4 border-t border-border">
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
              <div
                className="project-card flex flex-col h-full"
                onClick={() => setSelectedService("group")}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === "Enter" && setSelectedService("group")}
              >
                {/* Header section - fixed */}
                <div className="flex items-start gap-3 mb-4 min-h-[80px]">
                  <div className="w-12 h-12 rounded-lg bg-green-600 flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1 text-left">Grupės mokymai</h3>
                    <p className="text-sm text-foreground/60 text-left">Komandos, darbuotojai</p>
                  </div>
                </div>

                {/* Description section - flexible */}
                <div className="flex-1 mb-4">
                  <p className="text-sm text-foreground/70 text-left">
                    Specializuoti mokymai jūsų komandai arba organizacijai. Praktiniai užsiėmimai su
                    realiais pavyzdžiais ir įrankiais.
                  </p>
                </div>

                {/* Metadata section - fixed at bottom */}
                <div className="flex items-center gap-4 text-xs text-foreground/50 pt-4 border-t border-border">
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
              <div
                className="project-card flex flex-col h-full"
                onClick={() => setSelectedService("workshop")}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === "Enter" && setSelectedService("workshop")}
              >
                {/* Header section - fixed */}
                <div className="flex items-start gap-3 mb-4 min-h-[80px]">
                  <div className="w-12 h-12 rounded-lg bg-purple-600 flex items-center justify-center flex-shrink-0">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1 text-left">AI dirbtuvės</h3>
                    <p className="text-sm text-foreground/60 text-left">
                      Intensyvūs praktiniai užsiėmimai
                    </p>
                  </div>
                </div>

                {/* Description section - flexible */}
                <div className="flex-1 mb-4">
                  <p className="text-sm text-foreground/70 text-left">
                    Intensyvios praktinės dirbtuvės su konkrečiais projektais. Nuo AI įrankių iki
                    sprendimų integracijos jūsų veikloje.
                  </p>
                </div>

                {/* Metadata section - fixed at bottom */}
                <div className="flex items-center gap-4 text-xs text-foreground/50 pt-4 border-t border-border">
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
                        <h3 className="font-semibold text-foreground mb-2">
                          Netrukus bus daugiau
                        </h3>
                        <p className="text-sm text-foreground/60">Ruošiami nauji kursai</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="project-card flex flex-col items-center justify-center min-h-[200px] opacity-80">
                    <div className="text-center">
                      <h3 className="font-semibold text-foreground mb-2">
                        Šiuo metu kursų nėra
                      </h3>
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
              <BusinessSolutionsCTA variant="compact" context="publications" />
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
                  <Button className="button-primary">Registruotis konsultacijai</Button>
                </Link>
                <Button className="button-outline">Sužinoti daugiau</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CoursesPage;
