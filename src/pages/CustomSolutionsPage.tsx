import { useState } from "react";
import { Check, Users, TrendingUp, Zap, Target } from "lucide-react";
import SEOHead from "@/components/SEO";
import { SITE_CONFIG } from "@/utils/seo";
import InquiryForm from "@/components/custom-solutions/InquiryForm";
import EnhancedProjectCard from "@/components/custom-solutions/EnhancedProjectCard";
import PricingCard from "@/components/custom-solutions/PricingCard";
import ProcessStep from "@/components/custom-solutions/ProcessStep";
import FAQ from "@/components/custom-solutions/FAQ";
import Testimonials from "@/components/custom-solutions/Testimonials";
import { BusinessSolutionsCTA } from "@/components/cta/business-solutions-cta";
import { StickyCtaSidebar } from "@/components/cta/sticky-cta-sidebar";
import { TechStackSection } from "@/components/custom-solutions/TechStackSection";
import { CalculatorCTA } from "@/components/cta/calculator-cta";

const CustomSolutionsPage = () => {
  const [showForm, setShowForm] = useState(false);

  const problems = [
    {
      icon: "⏰",
      title: "Laikas švaistomas rutininėms užduotims",
      description:
        "Jūsų komanda kasdien sugaišta valandas Excel'iuose, rankiniuose skaičiavimuose ir informacijos perkėlinėjime tarp sistemų. Klaidos dažnos, duomenys pasenę, sprendimai priimami pagal netikslią informaciją.",
      quote: '"Buhalterė praleidžia 8 valandas generuojant sąskaitas. Tai nepriimtina." – Jonas, Logistikos Vadovas'
    },
    {
      icon: "🔧",
      title: "Standartinės sistemos netinka",
      description:
        "Pirkote brangų CRM ar ERP, bet jis nepritaikytas jūsų procesams. Darbuotojai stengiasi prisitaikyti prie sistemos, o ne sistema prie jų. Rezultatas - žemas naudojimas ir nusivylimas.",
      quote: '"Įdiegėme brangų ERP, bet jis per sudėtingas mūsų procesams." – Rasa, Įmonės Savininkė'
    },
    {
      icon: "📈",
      title: "Procesai neleidžia augti",
      description:
        "Norite priimti daugiau užsakymų, bet dabartiniai procesai to neleidžia. Sistemų stinga arba jos negali mastelį keisti kartu su jumis. Konkurentai lenkia pasinaudodami automatizacija.",
      quote: '"Atsisakome užsakymų, nes neturime pajėgumų. Frustruojančia." – Andrius, Transporto Įmonės CEO'
    },
  ];

  const services = [
    {
      icon: "👥",
      title: "Nustokite Prarasti Potencialius Klientus",
      problem: "Leads prarandi tarp el. laiškų, skambučių ir susitikimų. Pardavimų komanda nesusikalba, klientai lieka be dėmesio.",
      solution: "CRM sistema, pritaikyta jūsų procesui – automatinis lead tracking, komunikacijos istorija, pardavimų analizė ir 100% komandos matomumas.",
      result: "30% daugiau konversijų, nes nei vienas potencialus klientas nelieka pamirštas.",
      investment: "Nuo €5,000 | 4-6 savaitės",
    },
    {
      icon: "🚚",
      title: "Valdykite 400+ Krovinių Per Dieną Be Streso",
      problem: "Excel failai nebeveikia. Klientai skambina dėl užsakymų būsenos. Klaidos dažnos. Augimas sustoja.",
      solution: "Krovinių valdymo sistema su real-time sekimu, automatiniais pranešimais klientams, maršrutų optimizavimu ir pilna analitika.",
      result: "60% mažiau skambučių, 50% daugiau užsakymų priimama su ta pačia komanda. 5 įmonės jau naudoja.",
      investment: "Nuo €8,000 | 6-8 savaitės",
      featured: true,
    },
    {
      icon: "⚙️",
      title: "Automatizuokite Procesus, Kurie Švaisto 10+ Valandų Per Savaitę",
      problem: "Rankiniai procesai – sąskaitų generavimas, duomenų kopijavimas, ataskaitų rengimas. Visko per daug.",
      solution: "Automatizacijos sistema, kuri generuoja dokumentus, sinchronizuoja duomenis tarp sistemų ir valdo workflow be jūsų dalyvavimo.",
      result: "Sutaupoma 10-20 valandų per savaitę, 0 klaidų dokumentuose, greičiau apmokamos sąskaitos.",
      investment: "Nuo €4,000 | 3-5 savaitės",
    },
    {
      icon: "📊",
      title: "Priimkite Sprendimus Grįstus Duomenimis, Ne Nuojauta",
      problem: "Ataskaitos rengiamos rankiniu būdu. Duomenys neaktualūs. Sprendimai priimami pagal seną informaciją.",
      solution: "Real-time analitikos sistema su KPI stebėjimu, prognozavimu ir duomenų vizualizacija. Visa informacija vienoje vietoje.",
      result: "Greičiau reaguojate į rinkos pokyčius. Aiškiai matote, kas veikia ir kas ne.",
      investment: "Nuo €6,000 | 4-6 savaitės",
    },
    {
      icon: "📅",
      title: "Pamiršite Grafikų Planavimo Chaosą",
      problem: "Excel failai su pamainomis. Sumaištis su atostogomis. Darbuotojai nesusikalba dėl grafikų.",
      solution: "Darbuotojų grafikų sistema su pamainų planavimu, atostogų valdymu, laiko apskaita ir mobiliąja prieiga.",
      result: "0 konfliktų dėl grafikų. Darbuotojai žino savo pamainas bet kada. HR taupo 5 val/savaitę.",
      investment: "Nuo €3,500 | 3-4 savaitės",
    },
    {
      icon: "🔌",
      title: "Sujunkite Sistemas, Kurios Nekalba Tarpusavyje",
      problem: "CRM, buhalterija, sandėlis – visos atskiros. Duomenis kopijuojate rankiniu būdu tarp jų.",
      solution: "API integracijos, kurios automatiškai sinchronizuoja duomenis tarp jūsų sistemų. Be rankinio darbo.",
      result: "Duomenys visada aktualūs visose sistemose. Sutaupoma 3-8 val/savaitę.",
      investment: "Nuo €2,500 | 2-4 savaitės",
    },
  ];

  // Enhanced projects with multiple images, tech stack, timeline
  const enhancedProjects = [
    {
      id: 1,
      title: "Kaip Transporto Įmonė Su 400 Krovinių/Dieną Atsisakė Excel'io Amžiams",
      category: "Logistika",
      problem:
        "Augdami iki 400+ krovinių per dieną, prarado kontrolę. Excel failai nebeveikė. Klientai nuolat skambino dėl užsakymų būsenos. Klaidos dažnos, vėlavimai reguliarūs. Augimas sustojo.",
      solution:
        "Krovinių valdymo sistema su real-time sekimu ir vairuotojo lokacija, automatiniais pranešimais klientams (SMS + email), maršrutų optimizavimu ir išsamia analitika. Visa informacija vienoje vietoje.",
      results: [
        "60% mažiau skambučių \"kur mano krovinys?\"",
        "50% daugiau užsakymų priimama su ta pačia komanda",
        "8 valandos per dieną sutaupyta (buhalterija + dispečeriai)",
        "0 užsakymų praradimas per 6 mėnesius",
        "95% klientų pasitenkinimas (NPS score)",
      ],
      roi: "Investicija €12,000 • Atsipirko per 4 mėnesius • Sutaupo €3,000/mėn darbo sąnaudas",
      images: [
        { url: "/verslo-sprendimai/logistics.png", caption: "Krovinių stebėjimo dashboard" },
        { url: "/verslo-sprendimai/logistics-map.png", caption: "Real-time tracking žemėlapis" },
        { url: "/verslo-sprendimai/logistics-form.png", caption: "Krovinio detalių forma" },
        { url: "/verslo-sprendimai/logistics-analytics.png", caption: "Analitikos dashboard" },
        { url: "/verslo-sprendimai/logistics-mobile.png", caption: "Mobilioji versija vairuotojams" },
      ],
      techStack: ["React 18", "TypeScript", "Supabase", "Leaflet", "React Query", "Tailwind CSS"],
      timeline: "6 savaitės kūrimas • 2025 Q2",
      clientInfo: "Transporto įmonė, 50+ darbuotojų, 400+ krovinių/dieną",
    },
    {
      id: 3,
      title: "Kaip Autodetalių Platintojas Pasiekė 0 Apskaitos Klaidų Per 6 Mėnesius",
      category: "Autodetalės",
      problem: "3 sandėliai su atskirais Excel failais. Duomenys nesinchronizuoti. Rankinė apskaita užima 3 val/dieną. Klaidos reguliarios. Prarasti užsakymai dėl netikslių atsargų duomenų.",
      solution:
        "Centralizuota atsargų valdymo sistema su brūkšninių kodų skenavimu, automatine apskaita visų sandėlių, mažų atsargų įspėjimais ir real-time ataskaitymu.",
      results: [
        "0 apskaitos klaidų per 6 mėnesius (anksčiau ~5/savaitę)",
        "3 valandos per dieną sutaupyta (nebesinaudoja Excel)",
        "Atsargų matomumas realiuoju laiku visuose sandėliuose",
        "Automatiniai įspėjimai užsakymams sumažino išpardavimų trūkumą 40%",
        "Inventoriaus procesai iš 3 dienų → 4 valandos",
      ],
      roi: "Investicija €8,000 • Atsipirko per 5 mėnesius • Sutaupo €1,600/mėn darbo sąnaudas",
      images: [
        { url: "/verslo-sprendimai/warehouse.png", caption: "Atsargų valdymo dashboard" },
        { url: "/verslo-sprendimai/warehouse-scanner.png", caption: "Brūkšninių kodų skenavimas" },
        { url: "/verslo-sprendimai/warehouse-inventory.png", caption: "Inventoriaus sąrašas" },
        { url: "/verslo-sprendimai/warehouse-alerts.png", caption: "Mažų atsargų įspėjimai" },
        { url: "/verslo-sprendimai/warehouse-reports.png", caption: "Atsargų ataskaitos" },
      ],
      techStack: ["React", "TypeScript", "Supabase", "QuaggaJS", "Chart.js", "React Hook Form"],
      timeline: "4 savaitės kūrimas • 2024 Q4",
      clientInfo: "Autodetalių platintojas, 3 sandėliai, 5000+ SKU",
    },
    {
      id: 4,
      title: "Kaip E-commerce Platforma Sumažino Skambučius 60% Su Savitarnos Portalu",
      category: "E. komercija",
      problem: "Klientai nuolat skambina dėl užsakymų būsenos. Aptarnavimo komanda perkrauta – 80+ skambučių per dieną. Klientai nusivylę dėl ilgo laukimo telefonu. Mastelį keisti neįmanoma.",
      solution:
        "Savitarnos klientų portalas su užsakymų sekimu realiuoju laiku, dokumentų (sąskaitos, važtaraščiai) atsisiuntimu, automatiškais el. pašto pranešimais ir pilna užsakymų istorija.",
      results: [
        "60% mažiau skambučių į centrą (iš 80 → 32 per dieną)",
        "Klientai vertina 4.8/5 (pasitenkinimas išaugo 35%)",
        "24/7 prieiga prie užsakymų informacijos",
        "2 darbuotojus perkėlė iš support į pardavimus",
        "Vidutinis klientų retention išaugo 22%",
      ],
      roi: "Investicija €10,000 • Atsipirko per 6 mėnesius • Sutaupo €1,800/mėn darbo sąnaudas",
      images: [
        { url: "/verslo-sprendimai/clients.jpg", caption: "Klientų portalo pagrindinis" },
        { url: "/verslo-sprendimai/client-orders.png", caption: "Užsakymų sekimas" },
        { url: "/verslo-sprendimai/client-tracking.png", caption: "Real-time užsakymo būsena" },
        { url: "/verslo-sprendimai/client-documents.png", caption: "Dokumentų atsisiuntimas" },
        { url: "/verslo-sprendimai/client-history.png", caption: "Užsakymų istorija" },
      ],
      techStack: ["React", "TypeScript", "Supabase", "Recharts", "React PDF", "Zod"],
      timeline: "8 savaitės kūrimas • 2025 Q3",
      clientInfo: "E-commerce platforma, 1000+ aktyvių klientų",
    },
    {
      id: 5,
      title: "Kaip Buhalterė Sutaupė 8 Valandas Per Dieną Su Automatine Sąskaitų Sistema",
      category: "Logistika",
      problem: "Buhalterė kiekvieną dieną praleidžia 8 valandas rankiniu būdu generuojant sąskaitas už 100+ krovinių. Klaidos dažnos. Sąskaitos vėluoja. Klientai laukia mokėjimo dokumentų.",
      solution:
        "Automatinė sąskaitų generavimo sistema, integruota su krovinių valdymu – sukuria PDF sąskaitas pagal taisykles ir automatiškai išsiunčia klientams el. paštu.",
      results: [
        "Iš 8 valandų → 15 minučių per dieną sąskaitų procesui",
        "0 klaidų sąskaitose (anksčiau 3-5 klaidos/dieną)",
        "Sąskaitos išsiunčiamos automatiškai per 1 valandą po pristatymo",
        "30% greičiau apmokamos sąskaitos (geriau cash flow)",
        "Buhalterė persikėlė į strateginius projektus",
      ],
      roi: "Investicija €5,000 • Atsipirko per 3 mėnesius • Sutaupo €2,000/mėn darbo sąnaudas",
      images: [
        { url: "/verslo-sprendimai/invoice.png", caption: "Sąskaitų generavimo interface" },
        { url: "/verslo-sprendimai/invoice-template.png", caption: "PDF sąskaitos šablonas" },
        { url: "/verslo-sprendimai/invoice-automation.png", caption: "Automatizavimo taisyklės" },
        { url: "/verslo-sprendimai/invoice-email.png", caption: "Auto-siuntimas el. paštu" },
      ],
      techStack: ["React", "TypeScript", "Supabase", "PDF-lib", "Nodemailer", "Zod"],
      timeline: "3 savaitės kūrimas • 2024 Q3",
      clientInfo: "Logistikos įmonė, 100+ krovinių/dieną",
    },
  ];

  const pricingPlans = [
    {
      name: "MVP / Prototipas",
      priceRange: "€2,500 - €5,000",
      duration: "2-4 savaitės",
      features: [
        "Pagrindinį funkcionalumą (1-3 funkcijos)",
        "1-3 vartotojų vaidmenis",
        "Responsive dizainą (kompiuteriui ir mobiliam)",
        "Bazinį paleidimą ir dokumentaciją",
        "1 mėnesį nemokamos pagalbos",
        "Mokymus, kaip naudotis sistema",
      ],
      bestFor: "Norite greitai išbandyti idėją, minimali investicija, planuojate plėsti vėliau",
      roi: "Tipinis ROI: Sutaupo 3-5 val/savaitę (~€600/mėn) • Atsiperkanti per 6-8 mėnesius",
      popular: false,
    },
    {
      name: "Vidutinio Sudėtingumo Sistema",
      priceRange: "€5,000 - €12,000",
      duration: "4-8 savaitės",
      features: [
        "Pilną funkcionalumą (5-10 funkcijų)",
        "Kelių vartotojų sistemą su skirtingais vaidmenimis",
        "Integracijas su trečiųjų šalių sistemomis (2-3)",
        "Papildomas galimybes (ataskaitos, pranešimai)",
        "Profesionalų dizainą su individualiu prekės ženklu",
        "Paleidimą į veikiančią aplinką",
        "Pilną dokumentaciją",
        "2 mėnesius nemokamos pagalbos",
        "Išsamius mokymus komandai",
      ],
      bestFor:
        "Norite pilnai funkcionuojančios sistemos, kuri sprendžia visas pagrindines problemas",
      roi: "Tipinis ROI: Sutaupo 10-15 val/savaitę (~€2,000/mėn) • Atsiperkanti per 4-6 mėnesius",
      popular: true,
    },
    {
      name: "Kompleksinė Verslo Sistema",
      priceRange: "€12,000 - €25,000+",
      duration: "2-3+ mėnesiai",
      features: [
        "Įmonės lygio funkcionalumą",
        "Sudėtingas integracijas (API, senosios sistemos)",
        "Išplėstinę analitiką ir ataskaitas",
        "Individualų API kitoms sistemoms",
        "Galimybę mąstelį iki 100+ vartotojų",
        "Aukštą prieinamumą ir atsigavimą po gedimų",
        "Nuodugnią dokumentaciją",
        "3 mėnesius nemokamos pagalbos",
        "Pirmenybinę pagalbą",
        "Išsamius mokymus ir įdiegimą",
      ],
      bestFor: "Didelės apimties projektas, kritiškas verslui, enterprise reikalavimai",
      roi: "Tipinis ROI: Sutaupo 20-40 val/savaitę (~€3,500/mėn) • Atsiperkanti per 6-9 mėnesius",
      popular: false,
    },
  ];

  const processSteps = [
    {
      number: 1,
      title: "Konsultacija ir Planavimas",
      duration: "1 savaitė",
      icon: "🎯",
      description:
        "Nemokama 30-60 min konsultacija, kur išklausau jūsų iššūkius ir įvertinu galimybes. Tada kuriu detalų planą su dizainu, funkcionalumu ir tikslia kaina. Matysite, kaip atrodys sistema prieš pradedant kodavimą.",
      output: "✅ Tikslus projekto planas ir kaina | ✅ Patvirtintas dizainas | ✅ Pradedame kurti",
    },
    {
      number: 2,
      title: "Kūrimas ir Demonstracijos",
      duration: "2-12 savaičių",
      icon: "⚙️",
      description:
        "Kuriu iteratyviai – kas 1-2 savaitės demonstruoju pažangą ir įtraukiu jūsų atsiliepimus. Testuoju kiekvieną funkciją iš karto. Matote sistemą augant žingsnis po žingsnio, ne tik pabaigoje.",
      output: "✅ Veikianti sistema | ✅ Įtraukti visi jūsų atsiliepmai | ✅ Paruošta paleidimui",
    },
    {
      number: 3,
      title: "Paleidimas ir Rezultatai",
      duration: "1 savaitė, tada palaikymas",
      icon: "🚀",
      description:
        "Paliečiu sistemą į veikiančią aplinką, apmokaau jūsų komandą (su video medžiaga) ir vykdau bandomąjį paleidimą. Pirmą mėnesį pagalba nemokama. Matote rezultatus – sutaupytą laiką, sumažintas klaidas – per pirmas 4 savaites.",
      output: "✅ Sistema veikia | ✅ Komanda apmokata | ✅ Matote ROI per 1-3 mėn",
    },
  ];

  const usp = [
    {
      icon: "🚚",
      title: "Logistikos Specialistas, Ne Bendras Programuotojas",
      description:
        "Nesu dar vienas React developer. 5 logistikos įmonės patikėjo man krovinių valdymo, sąskaitų automatizacijos ir sandėlio apskaitos sistemas. Suprantu jūsų iššūkius, nes jau sprendžiau juos tikrose įmonėse – su tikrais kroviniais, tikrais vairuotojais, tikromis problemomis.",
    },
    {
      icon: "⚡",
      title: "MVP Per 2-4 Savaites, Ne 3 Mėnesius",
      description:
        "Kol agentūros organizuoja susirinkimus, aš jau kuriu. Naudoju AI įrankius produktyvumui padidinti 2-3x, bet kiekviena eilutė kodo peržiūrima ir testuojama rankiniu būdu. Rezultatas: greitesnis paleidimas, ta pati kokybė, 30-40% mažesnė investicija.",
    },
    {
      icon: "👤",
      title: "Kalbate Su Tuo, Kas Kodavo, Ne Su Sales Skyriumi",
      description:
        "Dirbu tiesiogiai su jumis nuo pirmos konsultacijos iki paleidimo. Jokių tarpininkų, jokių \"aš pasiteiksiu su technine komanda\". Jūsų feedback įgyvendinamas per 24 val, ne per 2 savaites. Jūsų klausimas ateina man, ne į helpdesk sistemą.",
    },
    {
      icon: "💰",
      title: "ROI Per 6-12 Mėn, Garantuota",
      description:
        "Visi mano projektai atsiperkantys per 12 mėn ar greičiau. Kaip? Automatizuoju procesus, kurie švaisto laiką: sąskaitų generavimas 8 val → 15 min, apskaitos klaidos 5/savaitę → 0, skambučiai dėl užsakymų 80/dieną → 32/dieną. Realūs skaičiai iš realių projektų.",
    },
    {
      icon: "🌐",
      title: "Modern Stack, Enterprise Patikimumas",
      description:
        "React + TypeScript + Supabase = sistema, kuri veikia kaip Google produktai. 99.9% uptime, automatinės backup'ai, mastelis iki šimtų vartotojų be papildomos investicijos. Bet skirtingai nei enterprise įrankiai – nesudėtinga, greita, prieinama.",
    },
    {
      icon: "❤️",
      title: "Pasiekiamas Net Po Paleidimo (Tai Retas Dalykas)",
      description:
        "Pirmą mėnesį pagalba nemokama – atsakau į klausimus, taisau klaidas, mokaau komandą. Vėliau €200-500/mėn už pilną priežiūrą. Nesiskambinu tik kai kažkas sulaužyta – priimu naujus feature request'us, optimizuoju, tobulinau. Tai partnerystė, ne projektas.",
    },
  ];

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
        <BusinessSolutionsCTA variant="inline" context="publications" />
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
        <BusinessSolutionsCTA variant="compact" context="publications" />
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
          <CalculatorCTA />
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
      {showForm && <InquiryForm onClose={() => setShowForm(false)} />}

      {/* Sticky CTA Sidebar - visada matomas */}
      <StickyCtaSidebar />
    </>
  );
};

export default CustomSolutionsPage;
