import { Link } from "react-router-dom";
import { ArrowLeft, Cookie, Shield, BarChart3, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEO";

export default function CookiePolicyPage() {
  const clearConsent = () => {
    localStorage.removeItem("obuolys_cookie_consent");
    window.location.reload();
  };

  return (
    <>
      <SEOHead
        title="Slapukų Politika | Ponas Obuolys"
        description="Slapukų politika - kaip naudojame slapukus ir vietinę saugyklą. GDPR/BDAR atitiktis."
        canonical="https://ponasobuolys.lt/slapukai"
      />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span>Grįžti į pagrindinį</span>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Cookie className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-4xl font-bold">Slapukų Politika</h1>
          </div>
          <p className="text-muted-foreground">
            Paskutinį kartą atnaujinta: 2025-10-20
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none space-y-8 text-left">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Kas Yra Slapukai?</h2>
            <p>
              Slapukai (cookies) yra maži tekstiniai failai, kuriuos svetainė išsaugo jūsų 
              naršyklėje. Mes taip pat naudojame panašias technologijas, tokias kaip 
              localStorage ir sessionStorage.
            </p>
            <p>
              Šios technologijos padeda mums užtikrinti svetainės veikimą, analizuoti lankytojų 
              elgesį ir pagerinti jūsų naršymo patirtį.
            </p>
          </section>

          {/* Cookie Categories */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Kokius Slapukus Naudojame</h2>

            {/* Necessary Cookies */}
            <div className="bg-card border border-border rounded-lg p-6 mb-6">
              <div className="flex items-start gap-3 mb-4">
                <Shield className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">1. Būtini Slapukai</h3>
                  <span className="inline-block px-2 py-1 bg-green-500/20 text-green-500 text-xs font-medium rounded">
                    Visada aktyvūs
                  </span>
                </div>
              </div>
              
              <p className="mb-4">
                Šie slapukai yra būtini svetainės veikimui ir negali būti išjungti.
              </p>

              <div className="space-y-4">
                <div className="bg-muted/50 rounded p-4">
                  <h4 className="font-semibold mb-2">obuolys_session_id</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li><strong>Tipas:</strong> sessionStorage</li>
                    <li><strong>Paskirtis:</strong> Unikalus sesijos identifikatorius</li>
                    <li><strong>Laikymo laikas:</strong> Iki naršyklės uždarymo</li>
                    <li><strong>Trečioji šalis:</strong> Ne</li>
                  </ul>
                </div>

                <div className="bg-muted/50 rounded p-4">
                  <h4 className="font-semibold mb-2">obuolys_cookie_consent</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li><strong>Tipas:</strong> localStorage</li>
                    <li><strong>Paskirtis:</strong> Saugo jūsų slapukų sutikimo nustatymus</li>
                    <li><strong>Laikymo laikas:</strong> Neribotai (kol neištrinate)</li>
                    <li><strong>Trečioji šalis:</strong> Ne</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Analytics Cookies */}
            <div className="bg-card border border-border rounded-lg p-6 mb-6">
              <div className="flex items-start gap-3 mb-4">
                <BarChart3 className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">2. Analitikos Slapukai</h3>
                  <span className="inline-block px-2 py-1 bg-blue-500/20 text-blue-500 text-xs font-medium rounded">
                    Pasirinktinai
                  </span>
                </div>
              </div>
              
              <p className="mb-4">
                Šie slapukai padeda mums suprasti, kaip lankytojai naudojasi svetaine. 
                Galite juos išjungti pasirinkdami "Tik būtini" slapukų sutikimo lange.
              </p>

              <div className="space-y-4">
                <div className="bg-muted/50 rounded p-4">
                  <h4 className="font-semibold mb-2">obuolys_recent_views</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li><strong>Tipas:</strong> localStorage</li>
                    <li><strong>Paskirtis:</strong> Saugo neseniai skaitytų publikacijų sąrašą deduplikacijai</li>
                    <li><strong>Duomenys:</strong> Publikacijos ID ir laiko žyma</li>
                    <li><strong>Laikymo laikas:</strong> 30 minučių</li>
                    <li><strong>Trečioji šalis:</strong> Ne</li>
                  </ul>
                </div>

                <div className="bg-muted/50 rounded p-4">
                  <h4 className="font-semibold mb-2">Supabase Realtime Presence</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li><strong>Tipas:</strong> WebSocket connection</li>
                    <li><strong>Paskirtis:</strong> Skaičiuoja realiu laiku skaitančius vartotojus</li>
                    <li><strong>Duomenys:</strong> Laikinas buvimo žymėjimas (online_at, user_agent)</li>
                    <li><strong>Laikymo laikas:</strong> Tik aktyvios sesijos metu</li>
                    <li><strong>Trečioji šalis:</strong> Supabase (EU serveriai, GDPR atitiktis)</li>
                  </ul>
                </div>

                <div className="bg-muted/50 rounded p-4">
                  <h4 className="font-semibold mb-2">page_views (duomenų bazė)</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li><strong>Tipas:</strong> Duomenų bazės įrašas</li>
                    <li><strong>Paskirtis:</strong> Skaičiuoja publikacijų peržiūras</li>
                    <li><strong>Duomenys:</strong> Publikacijos ID, sesijos ID, user_agent, data</li>
                    <li><strong>Laikymo laikas:</strong> Neribotai (anoniminė statistika)</li>
                    <li><strong>Trečioji šalis:</strong> Supabase (EU serveriai)</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* How to Manage */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Settings className="w-6 h-6 text-primary" />
              Kaip Valdyti Slapukus
            </h2>

            <h3 className="text-xl font-semibold mb-3">1. Per Mūsų Svetainę</h3>
            <p className="mb-4">
              Galite bet kada pakeisti savo slapukų nustatymus:
            </p>
            <Button onClick={clearConsent} variant="outline" className="mb-6">
              <Cookie className="mr-2 h-4 w-4" />
              Pakeisti slapukų nustatymus
            </Button>

            <h3 className="text-xl font-semibold mb-3">2. Per Naršyklę</h3>
            <p className="mb-4">
              Galite valdyti slapukus per savo naršyklės nustatymus:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Chrome:</strong> Nustatymai → Privatumas ir saugumas → Slapukai
              </li>
              <li>
                <strong>Firefox:</strong> Nustatymai → Privatumas ir saugumas → Slapukai ir svetainių duomenys
              </li>
              <li>
                <strong>Safari:</strong> Nuostatos → Privatumas → Valdyti svetainių duomenis
              </li>
              <li>
                <strong>Edge:</strong> Nustatymai → Slapukai ir svetainės leidimai
              </li>
            </ul>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mt-6">
              <p className="text-sm">
                <strong>⚠️ Svarbu:</strong> Išjungus būtinus slapukus, svetainė gali veikti netinkamai.
              </p>
            </div>
          </section>

          {/* Third Party Services */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Trečiųjų Šalių Paslaugos</h2>
            
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Supabase</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li><strong>Paskirtis:</strong> Duomenų bazė, autentifikacija, realtime funkcijos</li>
                  <li><strong>Serveriai:</strong> EU (GDPR atitiktis)</li>
                  <li><strong>Privatumo politika:</strong>{" "}
                    <a 
                      href="https://supabase.com/privacy" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      supabase.com/privacy
                    </a>
                  </li>
                </ul>
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Google Sign-In</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li><strong>Paskirtis:</strong> Prisijungimas per Google paskyrą (pasirinktinai)</li>
                  <li><strong>Duomenys:</strong> El. paštas, vardas (jei naudojate)</li>
                  <li><strong>Privatumo politika:</strong>{" "}
                    <a 
                      href="https://policies.google.com/privacy" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      policies.google.com/privacy
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Updates */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Pakeitimai</h2>
            <p>
              Galime atnaujinti šią slapukų politiką. Apie svarbius pakeitimus informuosime 
              per svetainę.
            </p>
            <p className="mt-4">
              <strong>Versija:</strong> 1.0<br />
              <strong>Paskutinį kartą atnaujinta:</strong> 2025-10-20
            </p>
          </section>

          {/* More Info */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Daugiau Informacijos</h2>
            <p>
              Daugiau informacijos apie tai, kaip tvarkome jūsų duomenis, rasite mūsų{" "}
              <Link to="/privatumas" className="text-primary hover:underline">
                Privatumo politikoje
              </Link>.
            </p>
            <p className="mt-4">
              Jei turite klausimų, susisiekite:{" "}
              <a href="mailto:labas@ponasobuolys.lt" className="text-primary hover:underline">
                labas@ponasobuolys.lt
              </a>
            </p>
          </section>
        </div>

        {/* Back to Top */}
        <div className="mt-12 pt-8 border-t border-border">
          <Link to="/">
            <Button className="w-full sm:w-auto">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Grįžti į pagrindinį puslapį
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
