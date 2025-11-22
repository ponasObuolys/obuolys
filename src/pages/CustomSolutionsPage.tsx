import { useState, lazy, Suspense } from "react";
import { Check, Users, TrendingUp, Zap, Target } from "lucide-react";
import SEOHead from "@/components/SEO";
import { SITE_CONFIG } from "@/utils/seo";
import LoadingSpinner from "@/components/ui/loading-spinner";
import EnhancedProjectCard from "@/components/custom-solutions/EnhancedProjectCard";
import PricingCard from "@/components/custom-solutions/PricingCard";
import ProcessStep from "@/components/custom-solutions/ProcessStep";
import { TechStackSection } from "@/components/custom-solutions/TechStackSection";

// Lazy load heavy components
const InquiryForm = lazy(() => import("@/components/custom-solutions/InquiryForm"));
const FAQ = lazy(() => import("@/components/custom-solutions/FAQ"));
const Testimonials = lazy(() => import("@/components/custom-solutions/Testimonials"));
const CalculatorCTA = lazy(() =>
  import("@/components/cta/calculator-cta").then((module) => ({ default: module.CalculatorCTA }))
);
const BusinessSolutionsCTA = lazy(() =>
  import("@/components/cta/business-solutions-cta").then((module) => ({
    default: module.BusinessSolutionsCTA,
  }))
);
import {
  problems,
  services,
  enhancedProjects,
  pricingPlans,
  processSteps,
  usp,
} from "@/data/customSolutionsData";

const CustomSolutionsPage = () => {
  const [showForm, setShowForm] = useState(false);



  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Logistikos Sistemų Automatizacija",
    description:
      "Logistikos specializacija – krovinių valdymo sistemos, automatinė sąskaitų generacija, sandėlio apskaita. 5 sėkmingi projektai Lietuvoje. ROI per 6-12 mėn.",
    provider: {
      "@type": "Person",
      name: "Ponas Obuolys",
      url: "https://ponasobuolys.lt",
    },
    areaServed: "Lietuva",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Logistikos Automatizacijos Paslaugos",
      itemListElement: pricingPlans.map(plan => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: plan.name,
          description: plan.bestFor,
        },
      })),
    },
  };

  return (
    <>
      <SEOHead
        title="Logistikos Sistemų Automatizacija Lietuvoje | Krovinių Valdymas, CRM, Automatizacija"
        description="Logistikos sistemų specialistas, kuris automatizavo 5 Lietuvos transporto įmonių procesus. Krovinių valdymo sistemos, automatinė sąskaitų generacija, klientų portalai. Sutaupykite 10+ valandų per savaitę. Investicija nuo €2,500. ROI per 6-12 mėn. Nemokama konsultacija."
        canonical={`${SITE_CONFIG.domain}/verslo-sprendimai`}
        keywords={[
          "logistikos sistemų automatizacija",
          "krovinių valdymo sistema Lietuvoje",
          "transporto įmonių programinė įranga",
          "logistikos CRM sistema",
          "verslo procesų automatizacija",
          "sąskaitų generavimo automatizacija",
          "sandėlio apskaitos sistema",
          "logistikos įrankiai verslui",
          "automatizuota krovinių sekimas",
          "custom verslo sistemos Lietuva",
          "verslo automatizacija Vilnius",
          "logistikos programuotojas Lietuva",
        ]}
        type="website"
        structuredData={structuredData}
      />

      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-background to-background/80">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
                Logistikos Sistemų Automatizacija, Kuri Leidžia Priimti{" "}
                <span className="gradient-text">2x Daugiau Užsakymų Be Papildomų Darbuotojų</span>
              </h1>
              <p className="text-xl md:text-2xl text-foreground/80 max-w-4xl mx-auto mb-8">
                5 Lietuvos transporto įmonės jau automatizavo krovinių valdymą, sąskaitų generavimą
                ir klientų komunikaciją su mano sukurtomis sistemomis. Specializuojuosi logistikos srityje –
                suprantu krovinių valdymo chaosą, nes išsprendžiau šias problemas tikrose įmonėse.
                Kuriu sistemas, kurios sutaupo 10+ valandų per savaitę ir leidžia augti be papildomų darbuotojų.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <button
                  onClick={() => setShowForm(true)}
                  className="button-primary text-lg px-8 py-4 inline-flex items-center justify-center gap-2"
                >
                  <Users className="w-5 h-5" />
                  Nemokama 30min konsultacija
                </button>
                <button
                  onClick={() =>
                    document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="button-outline text-lg px-8 py-4"
                >
                  Peržiūrėti projektus
                </button>
              </div>
              <div className="flex flex-wrap justify-center gap-6 text-sm text-foreground/60">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>5 logistikos įmonių automatizuota</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>10+ valandų/savaitę sutaupoma</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>ROI per 6-12 mėnesių</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
              Ar Jūsų Įmonė Taip Pat Kovoja Su Šiomis Problemomis?
            </h2>
            <p className="text-center text-foreground/70 mb-12 max-w-2xl mx-auto">
              5 logistikos įmonių savininkai minėjo tas pačias problemas prieš automatizavimą.
              Gera žinia – visos jos išsprendžiamos su tinkamais įrankiais.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {problems.map((problem, idx) => (
                <div key={idx} className="dark-card text-left">
                  <div className="text-5xl mb-4">{problem.icon}</div>
                  <h3 className="text-xl font-bold mb-3 text-foreground">{problem.title}</h3>
                  <p className="text-foreground/70 leading-relaxed mb-4">{problem.description}</p>
                  <p className="text-sm text-foreground/60 italic border-l-2 border-primary pl-3">
                    {problem.quote}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <TechStackSection />

      {/* CTA #1 - Po Tech Stack */}
      <div className="container mx-auto px-4 my-12">
        <Suspense fallback={<div className="h-32 bg-muted/20 rounded-lg animate-pulse" />}>
          <BusinessSolutionsCTA variant="inline" context="publications" />
        </Suspense>
      </div>

      {/* Solution Section */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
              Kuriu Sistemas, Kurios Pritaikytos Jūsų Procesams, O Ne Atvirkščiai
            </h2>
            <p className="text-center text-foreground/80 mb-12 max-w-3xl mx-auto text-lg">
              Ne standartiniai sprendimai su kompromisais. Analizuoju jūsų unikalius procesus ir kuriu
              sistemą, kuri juos palengvina, integruojasi su esamomis sistemomis ir auga kartu su jumis.
              Naudoju moderniausias debesų technologijas (React, TypeScript, Supabase) – greitai, saugiai, patikimai.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="dark-card text-center">
                <Target className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3 text-foreground">Sistema Pritaikoma Jums</h3>
                <p className="text-foreground/70">
                  Analizuoju jūsų verslo procesus ir kuriu sistemą, kuri juos palengvina, o ne
                  apsunkina. Kiekviena funkcija sprendžia realią problemą, ne tik "nice to have".
                </p>
              </div>
              <div className="dark-card text-center">
                <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3 text-foreground">MVP Per 2-4 Savaites</h3>
                <p className="text-foreground/70">
                  Naudoju AI įrankius produktyvumui padidinti 2-3x, bet kiekviena kodo eilutė
                  peržiūrima rankiniu būdu. Rezultatas: greitis be kokybės kompromisų.
                </p>
              </div>
              <div className="dark-card text-center">
                <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3 text-foreground">Investicija Atsiperkanti Per 6-12 Mėn</h3>
                <p className="text-foreground/70">
                  Automatizuoju procesus, kurie švaisto laiką. Tipiškas ROI: €1,500-€3,000/mėn
                  sutaupytos darbo sąnaudos. Realūs skaičiai iš 5 projektų.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
              Kokie Verslo Iššūkiai Sprendžiami?
            </h2>
            <p className="text-center text-foreground/70 mb-12 max-w-3xl mx-auto">
              Logistikos specializacija su 5 sėkmingais projektais, bet šie sprendimai adaptuojami įvairioms verslo sritims.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, idx) => (
                <div
                  key={idx}
                  className={`dark-card text-left ${service.featured ? "border-2 border-primary" : ""}`}
                >
                  {service.featured && (
                    <div className="inline-block bg-primary text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                      ⭐ Specializacija
                    </div>
                  )}
                  <div className="text-4xl mb-3">{service.icon}</div>
                  <h3 className="text-xl font-bold mb-3 text-foreground">{service.title}</h3>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-primary mb-1">PROBLEMA:</p>
                      <p className="text-sm text-foreground/70">{service.problem}</p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-primary mb-1">SPRENDIMAS:</p>
                      <p className="text-sm text-foreground/70">{service.solution}</p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-primary mb-1">REZULTATAS:</p>
                      <p className="text-sm text-foreground/70 font-medium">{service.result}</p>
                    </div>

                    <div className="pt-2 border-t border-foreground/10">
                      <p className="text-sm font-bold text-foreground">{service.investment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA #2 - Po paslaugų */}
      <div className="container mx-auto px-4 my-12">
        <Suspense fallback={<div className="h-48 bg-muted/20 rounded-lg animate-pulse" />}>
          <BusinessSolutionsCTA variant="compact" context="publications" />
        </Suspense>
      </div>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
              Tikri Projektai, Tikri Rezultatai
            </h2>
            <p className="text-center text-foreground/70 mb-12 max-w-3xl mx-auto">
              5 logistikos įmonės jau automatizavo savo procesus ir matė rezultatus per pirmuosius 3 mėnesius.
              Šių sistemų funkcionalumas adaptuojamas jūsų verslo specifikaacijai.
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {enhancedProjects.map(project => (
                <EnhancedProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Calculator CTA - Po portfolio */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <Suspense fallback={<div className="h-64 flex items-center justify-center"><LoadingSpinner /></div>}>
            <CalculatorCTA />
          </Suspense>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
              Investicija, Kuri Atsiperkanti Per 6-12 Mėnesių
            </h2>
            <p className="text-center text-foreground/70 mb-12 max-w-3xl mx-auto">
              Kiekvienas projektas sutaupo darbuotojų laiko ir sumažina klaidas. Tipinis ROI: €1,500-€3,000/mėn
              sutaupytos darbo sąnaudos. Investicija priklauso nuo projekto sudėtingumo ir funkcionalumo.
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {pricingPlans.map((plan, idx) => (
                <PricingCard key={idx} plan={plan} onCTAClick={() => setShowForm(true)} />
              ))}
            </div>

            {/* Additional Services */}
            <div className="dark-card">
              <h3 className="text-2xl font-bold mb-6 text-foreground">Papildomos Paslaugos:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-bold text-foreground mb-2">Talpinimas ir Infrastruktūra</h4>
                  <p className="text-primary font-bold mb-2">€50 - €200/mėn</p>
                  <ul className="text-sm text-foreground/70 space-y-1">
                    <li>• Modernus debesijos talpinimas</li>
                    <li>• Automatinės atsarginės kopijos</li>
                    <li>• SSL sertifikatai</li>
                    <li>• 99.9% veikimo laiko garantija</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-2">Priežiūra ir Pagalba</h4>
                  <p className="text-primary font-bold mb-2">€200 - €500/mėn</p>
                  <ul className="text-sm text-foreground/70 space-y-1">
                    <li>• Klaidų taisymas ir techninė pagalba</li>
                    <li>• Nedidelės funkcijos ir patobulinimai</li>
                    <li>• Saugumo atnaujinimai</li>
                    <li>• Pirmenybinė pagalba</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-2">Mokymai</h4>
                  <p className="text-primary font-bold mb-2">€500 - €1,000</p>
                  <ul className="text-sm text-foreground/70 space-y-1">
                    <li>• Komandos apmokymas</li>
                    <li>• Admin funkcijų mokymai</li>
                    <li>• Video mokymai</li>
                    <li>• Dokumentacija</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
              3 Žingsniai Nuo Idėjos Iki Veikiančios Sistemos
            </h2>
            <p className="text-center text-foreground/70 mb-12 max-w-2xl mx-auto">
              Skaidrus procesas su reguliariomis demonstracijomis. Matote pažangą kiekvieną savaitę, ne tik pabaigoje.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {processSteps.map(step => (
                <ProcessStep key={step.number} step={step} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* USP Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
              Kodėl Logistikos Įmonės Renkasi Mane, O Ne Agentūras?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {usp.map((item, idx) => (
                <div key={idx} className="dark-card text-left">
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">{item.title}</h3>
                  <p className="text-foreground/70">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA #4 - Didelis CTA po USP */}
      <div className="container mx-auto px-4 my-16">
        <Suspense fallback={<div className="h-64 bg-muted/20 rounded-lg animate-pulse" />}>
          <BusinessSolutionsCTA variant="default" context="publications" centered />
        </Suspense>
      </div>

      {/* Testimonials */}
      <Suspense fallback={<div className="h-64 flex items-center justify-center"><LoadingSpinner /></div>}>
        <Testimonials />
      </Suspense>

      {/* FAQ */}
      <Suspense fallback={<div className="h-64 flex items-center justify-center"><LoadingSpinner /></div>}>
        <FAQ />
      </Suspense>

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
              Paruošti Automatizuoti Procesus, Kurie Švaisto Jūsų Laiką?
            </h2>
            <p className="text-xl text-foreground/80 mb-8">
              Užpildykite trumpą formą – per 24 valandas susisieksiu su jumis. Pirmoji 30-60 min
              konsultacija nemokama. Aptarsime jūsų iššūkius, įvertinsiu automatizacijos galimybes
              ir sudarysiu preliminarų planą su tikslia kaina. Jokių įsipareigojimų.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="button-primary text-lg px-10 py-5 inline-flex items-center gap-2"
            >
              <Users className="w-5 h-5" />
              Gauti nemokamą konsultaciją
            </button>
            <p className="text-sm text-foreground/60 mt-6">
              ✅ Jūsų duomenys saugūs | ✅ Atsakau per 24 val darbo dienomis | ✅ Jokio spam – tik vienas pokalbis
            </p>
          </div>
        </div>
      </section>

      {/* Inquiry Form Modal */}
      {showForm && (
        <Suspense fallback={<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"><LoadingSpinner /></div>}>
          <InquiryForm onClose={() => setShowForm(false)} />
        </Suspense>
      )}

      {/* Sticky CTA Sidebar - visada matomas */}
    </>
  );
};

export default CustomSolutionsPage;
