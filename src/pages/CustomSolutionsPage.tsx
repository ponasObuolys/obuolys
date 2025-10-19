import { useState } from 'react';
import { Check, Users, TrendingUp, Zap, Target } from 'lucide-react';
import SEOHead from '@/components/SEO';
import { SITE_CONFIG } from '@/utils/seo';
import InquiryForm from '@/components/custom-solutions/InquiryForm';
import ProjectCard from '@/components/custom-solutions/ProjectCard';
import PricingCard from '@/components/custom-solutions/PricingCard';
import ProcessStep from '@/components/custom-solutions/ProcessStep';
import FAQ from '@/components/custom-solutions/FAQ';
import Testimonials from '@/components/custom-solutions/Testimonials';
import { BusinessSolutionsCTA } from '@/components/cta/business-solutions-cta';
import { StickyCtaSidebar } from '@/components/cta/sticky-cta-sidebar';

const CustomSolutionsPage = () => {
  const [showForm, setShowForm] = useState(false);

  const problems = [
    {
      icon: '⏰',
      title: 'Laikas švaistomas rutininėms užduotims',
      description: 'Jūsų komanda kasdien sugaišta valandas Excel\'iuose, rankiniuose skaičiavimuose ir informacijos perkėlinėjime tarp sistemų. Klaidos dažnos, duomenys pasenę, sprendimai priimami pagal netikslią informaciją.'
    },
    {
      icon: '🔧',
      title: 'Standartinės sistemos netinka',
      description: 'Pirkote brangų CRM ar ERP, bet jis nepritaikytas jūsų procesams. Darbuotojai stengiasi prisitaikyti prie sistemos, o ne sistema prie jų. Rezultatas - žemas naudojimas ir nusivylimas.'
    },
    {
      icon: '📈',
      title: 'Procesai neleidžia augti',
      description: 'Norite priimti daugiau užsakymų, bet dabartiniai procesai to neleidžia. Sistemų stinga arba jos negali mastelį keisti kartu su jumis. Konkurentai lenkia pasinaudodami automatizacija.'
    }
  ];

  const services = [
    {
      icon: '👥',
      title: 'Custom CRM Sistemos',
      description: 'Klientų valdymo sistemos, pritaikytos jūsų pardavimo procesui. Automatizuotas lead tracking, komunikacijos istorija, pardavimų analizė.'
    },
    {
      icon: '🚚',
      title: 'Logistikos Sprendimai',
      description: 'Krovinių valdymas, maršrutų optimizavimas, sandėlio apskaita, vairuotojų koordinavimas. 5 sėkmingi projektai logistikos srityje.',
      featured: true
    },
    {
      icon: '⚙️',
      title: 'Verslo Automatizacija',
      description: 'Rutininių procesų automatizavimas, dokumentų generavimas, duomenų sinchronizacija tarp sistemų, workflow valdymas.'
    },
    {
      icon: '📊',
      title: 'Analitikos Įrankiai',
      description: 'Real-time ataskaitų generavimas, KPI stebėjimas, prognozavimas, duomenų vizualizacija. Sprendimai grįsti duomenimis.'
    },
    {
      icon: '📅',
      title: 'Darbuotojų Grafikų Planavimas',
      description: 'Pamainų planavimas, atostogų valdymas, darbo laiko apskaita, mobilioji prieiga darbuotojams.'
    },
    {
      icon: '🔌',
      title: 'Integracijos ir API',
      description: 'Jūsų esamų sistemų sujungimas, duomenų mainai, trečiųjų šalių servisų integracija (buhalterija, mokėjimai, CRM).'
    }
  ];

  const projects = [
    {
      id: 1,
      title: 'Krovinių Valdymo Sistema',
      category: 'Logistika',
      problem: 'Transporto kompanija prarado užsakymų kontrolę, kai augdama pasiekė 400+ krovinių per dieną.',
      solution: 'Individuali sistema su realiuoju laiku veikiančiu krovinių sekimu, automatiniais pranešimais klientams, maršrutų optimizavimu ir išsamia analitika.',
      results: [
        '40% sumažėjo laikas užsakymams apdoroti',
        '95% klientų pasitenkinimas',
        'Automatizuoti 80% rutininių procesų'
      ],
      image: '/verslo-sprendimai/logistics.png'
    },
    {
      id: 3,
      title: 'Sandėlio Apskaitos Sistema',
      category: 'Autodetalės',
      problem: 'Excel failai kiekvienam sandėliui, duomenys nesinchronizuoti, daug rankinio darbo.',
      solution: 'Centralizuota sistema su brūkšninių kodų skenavimu, automatine apskaita, mažų atsargų įspėjimais.',
      results: [
        '0 apskaitos klaidų per 6 mėnesius',
        '3 valandos per dieną sutaupyta',
        'Atsargų matomumas realiuoju laiku'
      ],
      image: '/verslo-sprendimai/warehouse.png'
    },
    {
      id: 4,
      title: 'Klientų Portalo Platforma',
      category: 'E. komercija',
      problem: 'Klientai nuolat skambina dėl užsakymo būsenos, aptarnavimo komanda perkrauta.',
      solution: 'Savitarnos klientų portalas su užsakymų sekimu realiuoju laiku, dokumentų atsisiuntimu, automatiškais pranešimais ir užsakymų istorija.',
      results: [
        '60% mažiau skambučių į centrą',
        'Klientai vertina 4.8/5',
        'Prieiga prie informacijos visą parą'
      ],
      image: '/verslo-sprendimai/clients.jpg'
    },
    {
      id: 5,
      title: 'Automatinė Sąskaitų Generavimo Sistema',
      category: 'Logistika',
      problem: 'Buhalterija praleidžia dieną generuojant sąskaitas už 100+ krovinių.',
      solution: 'Automatinė integracija su krovinių sistema, sąskaitų generavimas pagal taisykles, siuntimas el. paštu.',
      results: [
        'Iš 8 valandų → 15 minučių per dieną',
        '0 klaidų sąskaitose',
        'Greičiau apmokamos sąskaitos'
      ],
      image: '/verslo-sprendimai/invoice.png'
    }
  ];

  const pricingPlans = [
    {
      name: 'MVP / Prototipas',
      priceRange: '€2,500 - €5,000',
      duration: '2-4 savaitės',
      features: [
        'Pagrindinį funkcionalumą (1-3 funkcijos)',
        '1-3 vartotojų vaidmenis',
        'Responsive dizainą (kompiuteriui ir mobiliam)',
        'Bazinį paleidimą ir dokumentaciją',
        '1 mėnesį nemokamos pagalbos',
        'Mokymus, kaip naudotis sistema'
      ],
      bestFor: 'Norite greitai išbandyti idėją, minimali investicija, planuojate plėsti vėliau',
      popular: false
    },
    {
      name: 'Vidutinio Sudėtingumo Sistema',
      priceRange: '€5,000 - €12,000',
      duration: '4-8 savaitės',
      features: [
        'Pilną funkcionalumą (5-10 funkcijų)',
        'Kelių vartotojų sistemą su skirtingais vaidmenimis',
        'Integracijas su trečiųjų šalių sistemomis (2-3)',
        'Papildomas galimybes (ataskaitos, pranešimai)',
        'Profesionalų dizainą su individualiu prekės ženklu',
        'Paleidimą į veikiančią aplinką',
        'Pilną dokumentaciją',
        '2 mėnesius nemokamos pagalbos',
        'Išsamius mokymus komandai'
      ],
      bestFor: 'Norite pilnai funkcionuojančios sistemos, kuri sprendžia visas pagrindines problemas',
      popular: true
    },
    {
      name: 'Kompleksinė Verslo Sistema',
      priceRange: '€12,000 - €25,000+',
      duration: '2-3+ mėnesiai',
      features: [
        'Įmonės lygio funkcionalumą',
        'Sudėtingas integracijas (API, senosios sistemos)',
        'Išplėstinę analitiką ir ataskaitas',
        'Individualų API kitoms sistemoms',
        'Galimybę mąstelį iki 100+ vartotojų',
        'Aukštą prieinamumą ir atsigavimą po gedimų',
        'Nuodugnią dokumentaciją',
        '3 mėnesius nemokamos pagalbos',
        'Pirmenybinę pagalbą',
        'Išsamius mokymus ir įdiegimą'
      ],
      bestFor: 'Didelės apimties projektas, kritiškas verslui, enterprise reikalavimai',
      popular: false
    }
  ];

  const processSteps = [
    {
      number: 1,
      title: 'Susipažinimas ir Analizė',
      duration: '1-2 savaitės',
      icon: '🔍',
      description: 'Nemokama pirminio pokalbio konsultacija (30-60 min). Gilesnė jūsų verslo procesų analizė, esamų sistemų įvertinimas, poreikių išsiaiškinimas.',
      output: 'Detalus projekto planas, funkcionalumo aprašas, tiksli kaina'
    },
    {
      number: 2,
      title: 'Dizainas ir Prototipas',
      duration: '1-2 savaitės',
      icon: '🎨',
      description: 'UI/UX dizaino kūrimas, klikkuojamo prototipo pristatymas, jūsų feedback ir pakeitimai, technologijų pasirinkimas.',
      output: 'Patvirtintas dizainas, techninis planas, darbo grafikas'
    },
    {
      number: 3,
      title: 'Kūrimas ir Testavimas',
      duration: '2-12 savaičių',
      icon: '⚙️',
      description: 'Iteratyvus kūrimas (kas 1-2 savaitės demonstracija), reguliarūs pažangos pranešimai, testavimas kiekviename etape, jūsų atsiliepimų įtraukimas į procesą.',
      output: 'Veikianti sistema, pilna dokumentacija, testavimo rezultatai'
    },
    {
      number: 4,
      title: 'Paleidimas ir Palaikymas',
      duration: '1 savaitė + nuolatinis',
      icon: '🚀',
      description: 'Paleidimas į veikiančią aplinką, duomenų perkėlimas (jei reikia), komandos apmokymai, bandomasis paleidimas su realiais vartotojais, oficialus paleidimas.',
      output: 'Veikianti sistema, apmokyti vartotojai, pagalbos sutartis'
    }
  ];

  const usp = [
    {
      icon: '❤️',
      title: 'Entuziazmas, o ne tik darbas',
      description: 'Man tai ne darbas - tai aistra. Kiekvienas projektas man asmeniškas iššūkis. Kuriu sistemą taip, tarsi sau - su atidumu detalėms ir dėmesiu kokybei.'
    },
    {
      icon: '⚡',
      title: 'Greitis be kompromisų',
      description: 'Naudodamas moderniausias AI technologijas galiu pristatyti MVP 2-3 kartus greičiau nei tradicinės agentūros. Bet greitis nereiškia žemos kokybės - kiekviena eilutė peržiūrima ir testuojama.'
    },
    {
      icon: '🚚',
      title: 'Logistikos srities ekspertizė',
      description: '5 sėkmingi projektai logistikos srityje - suprantu šios industrijos specifiką, problemas ir poreikius. Bet tai neapriboja - šios žinios pritaikomos ir kitose srityse.'
    },
    {
      icon: '🌐',
      title: 'Modernios technologijos',
      description: 'Naudoju naujausias debesijos technologijas (Supabase, Vercel), užtikrinančias greitį ir sklandumą, 99.9% veikimo laiką, automatines atsargines kopijas, lengvą mastelio keitimą, saugumą ir BDAR atitiktį.'
    },
    {
      icon: '👤',
      title: 'Asmeninis dėmesys',
      description: 'Dirbu tiesiogiai su jumis, ne per projektų vadovus. Greitesni sprendimai, geresnis bendravimas, lanksčiai reaguoju į pokyčius.'
    },
    {
      icon: '💰',
      title: 'Konkurencingos kainos',
      description: 'Mažesnės overhead išlaidos = geresnės kainos jums be kompromisų kokybei. Paprastai 30-40% pigiau nei agentūros.'
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Individualių Verslo Įrankių Kūrimas",
    "description": "Custom verslo sistemų ir įrankių kūrimas - CRM, logistika, automatizacija, analitika",
    "provider": {
      "@type": "Person",
      "name": "Ponas Obuolys",
      "url": "https://ponasobuolys.lt"
    },
    "areaServed": "Lietuva",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Verslo Įrankių Kūrimo Paslaugos",
      "itemListElement": pricingPlans.map(plan => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": plan.name,
          "description": plan.bestFor
        }
      }))
    }
  };

  return (
    <>
      <SEOHead
        title="Individualių Verslo Įrankių Kūrimas | Custom CRM, Automatizacija"
        description="Kuriu individualius verslo įrankius ir sistemas Lietuvoje. CRM, automatizacija, logistikos sprendimai, analitika. Nuo MVP iki kompleksinių sistemų. Greitas pristatymas, konkurencingos kainos."
        canonical={`${SITE_CONFIG.domain}/verslo-sprendimai`}
        keywords={[
          'individualių verslo įrankių kūrimas',
          'custom CRM Lietuvoje',
          'verslo automatizacija Lietuvoje',
          'logistikos programinė įranga',
          'verslo valdymo sistema',
          'darbuotojų grafikų planavimo sistema',
          'buhalterijos automatizacija',
          'verslo analitikos įrankiai',
          'custom verslo sprendimai'
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
                Individualių Verslo Įrankių Kūrimas, Kuris Išsprendžia{' '}
                <span className="gradient-text">Jūsų Unikalias Problemas</span>
              </h1>
              <p className="text-xl md:text-2xl text-foreground/80 max-w-4xl mx-auto mb-8">
                Pirmiausia išklausau jūsų iššūkius, tada kuriu įrankį, kuris taps kasdienės veiklos dalimi.
                Specializuojuosi logistikos srityje, bet nebijau sudėtingų verslo automatizacijos iššūkių.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <button
                  onClick={() => setShowForm(true)}
                  className="button-primary text-lg px-8 py-4"
                >
                  Pirminė konsultacija
                </button>
                <button
                  onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
                  className="button-outline text-lg px-8 py-4"
                >
                  Peržiūrėti portfolio
                </button>
              </div>
              <div className="flex flex-wrap justify-center gap-6 text-sm text-foreground/60">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>5+ sėkmingai įgyvendinti projektai</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Specializacija logistikoje</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Modernios technologijos</span>
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
              Ar pažįstamos šios kasdienės verslo problemos?
            </h2>
            <p className="text-center text-foreground/70 mb-12 max-w-2xl mx-auto">
              Daugelis verslų susiduria su tais pačiais iššūkiais. Gera žinia - visi jie sprendžiami.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {problems.map((problem, idx) => (
                <div key={idx} className="dark-card text-left">
                  <div className="text-5xl mb-4">{problem.icon}</div>
                  <h3 className="text-xl font-bold mb-3 text-foreground">{problem.title}</h3>
                  <p className="text-foreground/70 leading-relaxed">{problem.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA #1 - Po problemų */}
      <div className="container mx-auto px-4 my-12">
        <BusinessSolutionsCTA variant="inline" context="publications" />
      </div>

      {/* Solution Section */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
              Individualūs Įrankiai, Sukurti Būtent Jūsų Verslui
            </h2>
            <p className="text-center text-foreground/80 mb-12 max-w-3xl mx-auto text-lg">
              Ne standartiniai sprendimai su kompromisais. Kuriu programinę įrangą, kuri tiksliai atitinka jūsų procesus,
              integruojasi su esamomis sistemomis ir auga kartu su jumis. Naudoju moderniausias debesų technologijas,
              užtikrinančias greitį, saugumą ir patikimumą.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="dark-card text-center">
                <Target className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3 text-foreground">Pritaikyta jums</h3>
                <p className="text-foreground/70">
                  Analizuoju jūsų verslo procesus ir kuriu sistemą, kuri juos palengvina, o ne apsunkina.
                  Kiekviena funkcija turi tikslą.
                </p>
              </div>
              <div className="dark-card text-center">
                <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3 text-foreground">Greitas pristatymas</h3>
                <p className="text-foreground/70">
                  Naudodamas moderniausias AI technologijas, galiu pristatyti MVP 2-3 kartus greičiau
                  nei tradicinės agentūros.
                </p>
              </div>
              <div className="dark-card text-center">
                <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3 text-foreground">Mokanti investicija</h3>
                <p className="text-foreground/70">
                  Automatizuodami procesus sutaupysite darbuotojų laiko ir sumažinsite klaidų.
                  ROI pasiekiamas per 6-12 mėnesių.
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
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
              Ką Galiu Sukurti Jums?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, idx) => (
                <div
                  key={idx}
                  className={`dark-card text-left ${service.featured ? 'border-2 border-primary' : ''}`}
                >
                  {service.featured && (
                    <div className="inline-block bg-primary text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                      ⭐ Specializacija
                    </div>
                  )}
                  <div className="text-4xl mb-3">{service.icon}</div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">{service.title}</h3>
                  <p className="text-foreground/70">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA #2 - Po paslaugų */}
      <div className="container mx-auto px-4 my-12">
        <BusinessSolutionsCTA variant="compact" context="publications" />
      </div>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
              Sėkmingi Projektai, Kuriuos Galite Adaptuoti
            </h2>
            <p className="text-center text-foreground/70 mb-12 max-w-3xl mx-auto">
              Visi šie projektai sukurti logistikos srityje, bet jų funkcionalumas gali būti pritaikytas
              jūsų verslo poreikiams.
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA #3 - Po portfolio */}
      <div className="container mx-auto px-4 my-12">
        <BusinessSolutionsCTA variant="inline" context="publications" />
      </div>

      {/* Pricing Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
              Skaidrios Kainos Be Paslėptų Mokesčių
            </h2>
            <p className="text-center text-foreground/70 mb-12 max-w-3xl mx-auto">
              Kainos priklauso nuo projekto sudėtingumo, funkcionalumo ir trukmės.
              Siūlau tris skirtingus paketus:
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {pricingPlans.map((plan, idx) => (
                <PricingCard
                  key={idx}
                  plan={plan}
                  onCTAClick={() => setShowForm(true)}
                />
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
              Kaip Vyksta Bendradarbiavimas?
            </h2>
            <p className="text-center text-foreground/70 mb-12 max-w-2xl mx-auto">
              Paprastas ir skaidrus procesas nuo pirmo susitikimo iki paleidimo
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {processSteps.map((step) => (
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
              Ne Agentūra - Partneris Jūsų Sėkmei
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
        <BusinessSolutionsCTA variant="default" context="publications" centered />
      </div>

      {/* Testimonials */}
      <Testimonials />

      {/* FAQ */}
      <FAQ />

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
              Pasiruošęs Pradėti? Pradėkime Nuo Nemokamos Konsultacijos
            </h2>
            <p className="text-xl text-foreground/80 mb-8">
              Užpildykite trumpą formą ir per 24 valandas susisieksiu su jumis.
              Pirmoji 30-60 minučių konsultacija nemokama - aptarsime jūsų poreikius,
              įvertinsime galimybes ir sudarysime preliminarų planą.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="button-primary text-lg px-10 py-5 inline-flex items-center gap-2"
            >
              <Users className="w-5 h-5" />
              Užsiregistruoti konsultacijai
            </button>
            <p className="text-sm text-foreground/60 mt-6">
              Jūsų duomenys saugūs. Nesidalinsiu su trečiosiomis šalimis. Susisieksiu per 24 val. darbo dienomis.
            </p>
          </div>
        </div>
      </section>

      {/* Inquiry Form Modal */}
      {showForm && (
        <InquiryForm onClose={() => setShowForm(false)} />
      )}

      {/* Sticky CTA Sidebar - visada matomas */}
      <StickyCtaSidebar />
    </>
  );
};

export default CustomSolutionsPage;
