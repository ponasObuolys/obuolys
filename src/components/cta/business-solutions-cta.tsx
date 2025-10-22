import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Target, Rocket, TrendingUp, Brain } from "lucide-react";
import { useMemo } from "react";
import type { CTAContext, CTAVariant } from "@/types/cta";
import { useRandomCTA } from "@/hooks/use-cta";
import { ctaAnalyticsService } from "@/services/cta.service";

interface BusinessSolutionsCTAProps {
  variant?: CTAVariant;
  context?: CTAContext;
  centered?: boolean;
}

// Random tekstų variantai pagal kontekstą
const contentVariants = {
  article: [
    {
      title: "Norite tokio AI sprendimo savo verslui?",
      description:
        "Sukuriame individualius AI įrankius, pritaikytus jūsų verslo poreikiams. Automatizuokite procesus ir padidinkite efektyvumą.",
      cta: "Aptarti projektą",
      icon: Target,
    },
    {
      title: "Jūsų verslas nusipelno geresnių įrankių",
      description:
        "Padidinkite produktyvumą iki 300% su AI sprendimais. Mes sukursime įrankį, kuris dirbs už jus 24/7.",
      cta: "Gauti pasiūlymą",
      icon: Rocket,
    },
    {
      title: "Konkurentai jau naudoja AI. O jūs?",
      description:
        "Nelikite nuošalyje. Integruokite AI į savo verslą ir aplenkite konkurenciją. Pirmoji konsultacija - nemokama!",
      cta: "Pradėti dabar",
      icon: TrendingUp,
    },
    {
      title: "AI sprendimai, kurie atsipirks per 3 mėnesius",
      description:
        "Investicija į AI - tai investicija į ateitį. Skaičiuojame ROI prieš pradedant projektą. Garantuojame rezultatus.",
      cta: "Sužinoti daugiau",
      icon: Brain,
    },
    {
      title: "Sutaupykite 20 valandų per savaitę su AI",
      description:
        "Automatizuokite pasikartojančius darbus ir skirkite laiką tam, kas tikrai svarbu. Mano klientai sutaupo vidutiniškai 20h per savaitę.",
      cta: "Skaičiuoti taupymą",
      icon: Zap,
    },
    {
      title: "AI sprendimai, kurie veiks jau rytoj",
      description:
        "Nereikia laukti mėnesių. Greitas diegimas, akivaizdūs rezultatai. Pradėkite naudoti AI jau šią savaitę.",
      cta: "Greitas startas",
      icon: Rocket,
    },
    {
      title: "Klientų aptarnavimas 24/7 be papildomų darbuotojų",
      description:
        "AI chatbotai, kurie atsako akimirksniu. Sumažinkite klientų aptarnavimo išlaidas iki 70%.",
      cta: "Išbandyti demo",
      icon: Sparkles,
    },
    {
      title: "Duomenų analizė, kuri daro sprendimus už jus",
      description:
        "AI, kuris analizuoja jūsų duomenis ir pateikia konkrečius veiksmus. Ne tik ataskaitos - realūs sprendimai.",
      cta: "Pamatyti pavyzdį",
      icon: Brain,
    },
    {
      title: "Automatizuokite tai, kas kartojasi",
      description:
        "Dokumentų apdorojimas, el. pašto atsakymai, duomenų įvedimas - visa tai gali daryti AI. Jūs - strategijai.",
      cta: "Rasti procesus",
      icon: Target,
    },
    {
      title: "AI, kuris mokosi iš jūsų verslo",
      description:
        "Ne šabloninis sprendimas, o AI, kuris supranta jūsų specifiką ir tobulėja kiekvieną dieną.",
      cta: "Sužinoti kaip",
      icon: TrendingUp,
    },
    {
      title: "Pirmieji rezultatai per 2 savaites",
      description:
        "Greitas MVP kūrimas ir testavimas. Matote rezultatus prieš investuodami daugiau. Jokių rizikų.",
      cta: "Pradėti testą",
      icon: Rocket,
    },
    {
      title: "AI sprendimai nuo 500€/mėn",
      description:
        "Prieinamos kainos, didelis poveikis. Pilnas palaikymas ir atnaujinimai įskaičiuoti. Be paslėptų mokesčių.",
      cta: "Peržiūrėti planus",
      icon: Sparkles,
    },
    {
      title: "Jūsų komanda pamils šį AI įrankį",
      description:
        "Intuityvūs sprendimai, kuriems nereikia mokymo. Jūsų darbuotojai pradės naudoti nuo pirmos dienos.",
      cta: "Pamatyti demo",
      icon: Target,
    },
    {
      title: "AI, kuris dirba lietuvių kalba",
      description:
        "Pilnai pritaikyti sprendimai lietuvių kalbai. Ne vertimas, o tikras supratimas. Idealiai veikia su lietuviškais tekstais.",
      cta: "Išbandyti",
      icon: Brain,
    },
    {
      title: "Integruoju AI į jūsų sistemas",
      description:
        "Dirba su tuo, ką jau naudojate. CRM, ERP, el. parduotuvė - prijungiu AI prie bet kokios sistemos.",
      cta: "Aptarti integraciją",
      icon: Zap,
    },
    {
      title: "100+ sėkmingų AI projektų Lietuvoje",
      description:
        "Patirtis su įvairiausiais verslais - nuo startuolių iki korporacijų. Žinau, kas veikia Lietuvos rinkoje.",
      cta: "Skaityti atvejus",
      icon: TrendingUp,
    },
    {
      title: "AI sprendimai, kurie auga kartu su jumis",
      description:
        "Pradėkite mažai, plėskite pagal poreikį. Modulinė architektūra leidžia pridėti funkcijas bet kada.",
      cta: "Planuoti augimą",
      icon: Rocket,
    },
    {
      title: "Nemokama AI galimybių analizė jūsų verslui",
      description:
        "30 minučių konsultacija, kurioje identifikuosiu 3-5 procesus, kuriuos galima automatizuoti. Visiškai nemokamai.",
      cta: "Užsisakyti analizę",
      icon: Target,
    },
    {
      title: "AI sprendimai su garantija",
      description:
        "Jei per 3 mėnesius nematote rezultatų - grąžinsiu pinigus. Esu tikras savo sprendimų kokybe.",
      cta: "Skaityti garantiją",
      icon: Sparkles,
    },
    {
      title: "Jūsų konkurentai jau tauposi su AI",
      description:
        "Kol jūs svarstote, kiti jau automatizuoja. Nepavėluokite į traukinį - AI revoliucija vyksta dabar.",
      cta: "Neprarasti progos",
      icon: Brain,
    },
    {
      title: "AI asistentas, kuris supranta jūsų verslą",
      description:
        "Treniruoju AI su jūsų dokumentais, procesais ir žiniomis. Galit virtualų ekspertą, kuris dirba 24/7.",
      cta: "Sukurti asistentą",
      icon: Zap,
    },
  ],
  tools: [
    {
      title: "Reikalingas pritaikytas AI įrankis?",
      description:
        "Nematote tinkamo įrankio? Sukursiu Jums unikalų AI sprendimą, kuris idealiai atitiks Jūsų verslo tikslus.",
      cta: "Užsakyti įrankį",
      icon: Target,
    },
    {
      title: "Jūsų verslo problemos = Mūsų AI sprendimai",
      description:
        "Turite specifinę problemą? Sukursiu AI įrankį, kuris ją išspręs. Jokių šablonų - tik individualūs sprendimai.",
      cta: "Aptarti idėją",
      icon: Sparkles,
    },
    {
      title: "Kodėl prisitaikyti, kai galima sukurti?",
      description:
        "Standartiniai įrankiai nevisada tinka. Aų kuriu AI sprendimus, kurie 100% atitinka Jūsų procesus.",
      cta: "Pradėti projektą",
      icon: Rocket,
    },
    {
      title: "Nuo idėjos iki veikiančio įrankio per 2 savaites",
      description:
        "Greitas AI įrankių kūrimas be kompromisų kokybei. Pilnas palaikymas ir mokymai įtraukti į kainą.",
      cta: "Užsakyti dabar",
      icon: Zap,
    },
    {
      title: "AI įrankis, kuris dirba kaip Jūsų darbuotojas",
      description:
        "Ne tik automatizacija - tikras virtualus asistentas, kuris supranta kontekstą ir priima sprendimus.",
      cta: "Pamatyti galimybes",
      icon: Brain,
    },
    {
      title: "Integruojame AI į Jūsų darbo eigą",
      description:
        "Nereikia keisti procesų - AI prisitaiko prie Jūsų. Veikia su visomis populiariausiomis sistemomis.",
      cta: "Aptarti integraciją",
      icon: Target,
    },
    {
      title: "AI įrankiai, kurie mokosi iš Jūsų duomenų",
      description:
        "Kuo daugiau naudojate, tuo geresni rezultatai. Machine learning, kuris tobulėja kiekvieną dieną.",
      cta: "Sužinoti kaip",
      icon: TrendingUp,
    },
    {
      title: "Nuo paprasto chatbot'o iki sudėtingos sistemos",
      description:
        "Bet kokio sudėtingumo AI sprendimai. Pradėkite paprastai, plėskite pagal poreikį.",
      cta: "Planuoti sprendimą",
      icon: Rocket,
    },
    {
      title: "AI įrankiai su lietuvių kalbos palaikymu",
      description:
        "Pilnai veikia lietuviškai - nuo komandų iki ataskaitų. Ne vertimas, o tikras supratimas.",
      cta: "Išbandyti lietuviškai",
      icon: Sparkles,
    },
    {
      title: "Jūsų duomenys lieka pas Jus",
      description:
        "Saugumas pirmoje vietoje. On-premise sprendimai arba privatus cloud. Pilna duomenų kontrolė.",
      cta: "Skaityti apie saugumą",
      icon: Target,
    },
    {
      title: "AI įrankiai nuo 500€/mėn",
      description:
        "Prieinamos kainos už profesionalius sprendimus. Skaidrios sąlygos, be paslėptų mokesčių.",
      cta: "Peržiūrėti kainas",
      icon: Zap,
    },
    {
      title: "Nemokamas AI įrankio prototipas",
      description:
        "Sukursiu veikiančią demo versiją nemokamai. Išbandykite prieš priimdami sprendimą.",
      cta: "Užsakyti demo",
      icon: Sparkles,
    },
    {
      title: "AI įrankiai, kurie dirba Jūsų komandai",
      description:
        "Multi-vartotojų sprendimai su rolių valdymu. Visa komanda gali naudoti vienu metu.",
      cta: "Sužinoti daugiau",
      icon: Brain,
    },
    {
      title: "Automatizuokite tai, kas erzina",
      description:
        "Nuobodūs, pasikartojantys darbai? AI juos atliks greičiau ir tiksliau. Jūsų komanda - kūrybai.",
      cta: "Rasti procesus",
      icon: TrendingUp,
    },
    {
      title: "AI įrankiai su API integracija",
      description:
        "Prijunkite prie bet kokios sistemos. REST API, webhooks, real-time duomenų mainai.",
      cta: "Techninė dokumentacija",
      icon: Target,
    },
    {
      title: "Mobilios AI aplikacijos",
      description: "AI įrankiai, kurie veikia telefone. iOS ir Android. Dirba net be interneto.",
      cta: "Pamatyti pavyzdžius",
      icon: Rocket,
    },
    {
      title: "AI įrankiai su analitika",
      description:
        "Realaus laiko ataskaitos ir įžvalgos Matykite, kaip AI pagerina jūsų rezultatus.",
      cta: "Peržiūrėti dashboard",
      icon: Brain,
    },
    {
      title: "AI įrankiai su OCR technologija",
      description:
        "Skenuokite dokumentus, AI ištrauks visą informaciją. Sąskaitos, sutartys, formos - automatiškai.",
      cta: "Pamatyti veikimą",
      icon: Zap,
    },
    {
      title: "24/7 palaikymas lietuvių kalba",
      description:
        "Mano komanda visada pasiekiama. Greitas atsakymas, efektyvūs sprendimai. Jūsų sėkmė - mūsų prioritetas.",
      cta: "Susisiekti",
      icon: Target,
    },
  ],
  publications: [
    {
      title: "Paversk AI žinias į verslo rezultatus",
      description:
        "Padėsime integruoti AI technologijas į Jūsų verslą. Konsultacijos, įrankių kūrimas ir diegimas.",
      cta: "Pradėti projektą",
      icon: Target,
    },
    {
      title: "Skaityti apie AI - gerai. Naudoti AI - geriau!",
      description:
        "Jau žinote apie AI galimybes? Laikas jas pritaikyti savo versle. Padėsiu nuo A iki Z.",
      cta: "Konsultuotis",
      icon: Brain,
    },
    {
      title: "Kiekviena AI naujiena - tai nauja galimybė Jūsų verslui",
      description:
        "Matote įdomią technologiją? Mes galime ją integruoti į Jūsų procesus. Būkite pirmieji rinkoje!",
      cta: "Aptarti galimybes",
      icon: TrendingUp,
    },
    {
      title: "AI ekspertizė + Jūsų verslo žinios = Sėkmė",
      description:
        "Jūs žinote savo verslą, aš žinau AI. Kartu sukursime sprendimą, kuris veiks tobulai.",
      cta: "Susisiekti",
      icon: Rocket,
    },
    {
      title: "Matėte įdomų AI sprendimą straipsnyje?",
      description:
        "Aš galiu jį pritaikyti Jūsų verslui. Nuo idėjos iki veikiančio sprendimo - viskas vienoje vietoje.",
      cta: "Aptarti idėją",
      icon: Sparkles,
    },
    {
      title: "Nuo AI naujienų iki realių sprendimų",
      description:
        "Sekate AI naujienas? Puiku! Dabar laikas jas panaudoti. Padėsiu įgyvendinti tai, apie ką skaitote.",
      cta: "Pradėti veikti",
      icon: Zap,
    },
    {
      title: "Jūsų konkurentai skaito tas pačias naujienas",
      description:
        "Skirtumas - kas pirmas pritaiko. Būkite pirmieji savo rinkoje su naujausiais AI sprendimais.",
      cta: "Aplenkti konkurentus",
      icon: TrendingUp,
    },
    {
      title: "AI konsultacija su realiais pavyzdžiais",
      description:
        "Ne teorija, o konkretūs sprendimai jūsų verslui. Parodysime, kaip AI gali padėti jums.",
      cta: "Užsisakyti konsultaciją",
      icon: Brain,
    },
    {
      title: "Įkvėpė straipsnis? Sukurkime sprendimą!",
      description:
        "Matėte įdomų AI pritaikymą? Aš galiu sukurti panašų arba dar geresnį Jūsų verslui.",
      cta: "Aptarti projektą",
      icon: Rocket,
    },
    {
      title: "Nuo ChatGPT iki individualaus AI",
      description:
        "Naudojate ChatGPT? Įsivaizduokite AI, kuris žino Jūsų verslą. Mes jį sukursime.",
      cta: "Sužinoti kaip",
      icon: Target,
    },
    {
      title: "AI mokymai Jūsų komandai",
      description:
        "Ne tik sprendimų kūrimas, bet ir komandos mokymas. Jūsų darbuotojai mokės naudoti AI efektyviai.",
      cta: "Peržiūrėti programą",
      icon: Sparkles,
    },
    {
      title: "Nemokama AI galimybių analizė",
      description:
        "30 min. konsultacija, kurioje aptarsime, kaip AI gali padėti būtent Jūsų verslui. Visiškai nemokamai.",
      cta: "Registruotis",
      icon: Zap,
    },
    {
      title: "AI strategija Jūsų verslui",
      description:
        "Ne tik įrankiai, bet ir strategija. Padėsiu suplanuoti AI integraciją ilgalaikei perspektyvai.",
      cta: "Planuoti strategiją",
      icon: Brain,
    },
    {
      title: "Pritaikykite naujausias AI technologijas",
      description:
        "GPT-5, Claude, Gemini - aš dirbu su naujausiais modeliais. Jūsų verslas gauna geriausią.",
      cta: "Pamatyti technologijas",
      icon: TrendingUp,
    },
    {
      title: "AI sprendimai lietuviškam verslui",
      description: "Suprantu Lietuvos rinką ir specifiką. Sprendimai, kurie veikia čia ir dabar.",
      cta: "Lietuviški atvejai",
      icon: Target,
    },
    {
      title: "AI ROI skaičiuoklė Jūsų verslui",
      description:
        "Suskaičiuosiu tikslią investicijos grąžą prieš pradedant. Žinosite, ko tikėtis.",
      cta: "Skaičiuoti ROI",
      icon: Sparkles,
    },
    {
      title: "Sektoriaus specifiniai AI sprendimai",
      description: "E-commerce, gamyba, paslaugos, logistika - turiu patirties įvairiose srityse.",
      cta: "Rasti savo sektorių",
      icon: Brain,
    },
    {
      title: "AI diegimas be verslo sustabdymo",
      description:
        "Integruoju AI be trikdžių Jūsų veiklai. Verslas dirba, AI diegiamas lygiagrečiai.",
      cta: "Sužinoti procesą",
      icon: Zap,
    },
    {
      title: "Ilgalaikis AI partnerystė",
      description:
        "Ne tik sukuriu, bet ir palaikau. Jūsų AI sprendimai visada atnaujinti ir veikiantys.",
      cta: "Partnerystės sąlygos",
      icon: Target,
    },
  ],
};

export function BusinessSolutionsCTA({
  variant = "default",
  context = "article",
  centered = false,
}: BusinessSolutionsCTAProps) {
  // Bandome gauti iš DB
  const { data: dbCTA } = useRandomCTA(context);

  // Fallback į hardcoded tekstus
  const fallbackContent = useMemo(() => {
    const variants = contentVariants[context];
    return variants[Math.floor(Math.random() * variants.length)];
  }, [context]);

  // Helper funkcija ikonoms iš DB
  const getIconComponent = (iconName: string) => {
    const icons: Record<string, typeof Target> = {
      Target,
      Rocket,
      Sparkles,
      Brain,
      Zap,
      TrendingUp,
    };
    return icons[iconName] || Target;
  };

  // Naudojame DB duomenis arba fallback
  const content = useMemo(() => {
    if (dbCTA) {
      return {
        title: dbCTA.title,
        description: dbCTA.description,
        cta: dbCTA.button_text,
        icon: getIconComponent(dbCTA.icon),
      };
    }
    return fallbackContent;
  }, [dbCTA, fallbackContent]);

  const IconComponent = content.icon;

  // Click tracking handler
  const handleClick = () => {
    if (dbCTA?.id) {
      ctaAnalyticsService.trackClick(dbCTA.id, "cta_section", context);
    }
  };

  if (variant === "compact") {
    return (
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-lg p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <IconComponent className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">{content.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{content.description}</p>
            <Link
              to="/verslo-sprendimai"
              className="inline-block w-full sm:w-auto"
              onClick={handleClick}
            >
              <Button className="gap-2 w-full sm:w-auto">
                {content.cta}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left w-full sm:w-auto">
            <IconComponent className="h-5 w-5 text-primary flex-shrink-0 hidden sm:block" />
            <div className="flex-1">
              <p className="font-medium text-sm mb-1">{content.title}</p>
              <p className="text-xs text-muted-foreground">{content.description}</p>
            </div>
          </div>
          <Link to="/verslo-sprendimai" className="w-full sm:w-auto">
            <Button size="sm" className="gap-2 w-full sm:w-auto whitespace-nowrap">
              {content.cta}
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Default variant
  const textAlign = centered ? "text-center" : "text-center md:text-left";
  const justifyContent = centered ? "justify-center" : "justify-center md:justify-start";
  const marginAuto = centered ? "mx-auto" : "mx-auto md:mx-0";

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 rounded-xl p-6 md:p-12">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -z-10" />

      <div className={`relative z-10 ${textAlign}`}>
        <div className={`flex items-center ${justifyContent} gap-2 mb-4`}>
          <IconComponent className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium text-primary">Verslo Sprendimai</span>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold mb-4">{content.title}</h2>

        <p className={`text-base md:text-lg text-muted-foreground mb-6 max-w-2xl ${marginAuto}`}>
          {content.description}
        </p>

        <div className={`flex flex-col sm:flex-row gap-3 ${justifyContent} mb-8`}>
          <Link to="/verslo-sprendimai" className="w-full sm:w-auto">
            <Button size="lg" className="gap-2 w-full sm:w-auto">
              {content.cta}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/kontaktai?type=CUSTOM_TOOL" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
              Greita užklausa
              <Sparkles className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl ${marginAuto}`}>
          <div
            className={`flex flex-col sm:flex-row items-center sm:items-start gap-3 ${textAlign}`}
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-bold text-lg">1</span>
            </div>
            <div>
              <p className="font-semibold text-sm mb-1">Konsultacija</p>
              <p className="text-xs text-muted-foreground">Aptariame jūsų poreikius</p>
            </div>
          </div>
          <div
            className={`flex flex-col sm:flex-row items-center sm:items-start gap-3 ${textAlign}`}
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-bold text-lg">2</span>
            </div>
            <div>
              <p className="font-semibold text-sm mb-1">Kūrimas</p>
              <p className="text-xs text-muted-foreground">Kuriame sprendimą</p>
            </div>
          </div>
          <div
            className={`flex flex-col sm:flex-row items-center sm:items-start gap-3 ${textAlign}`}
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-bold text-lg">3</span>
            </div>
            <div>
              <p className="font-semibold text-sm mb-1">Diegimas</p>
              <p className="text-xs text-muted-foreground">Integruojame į verslą</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
