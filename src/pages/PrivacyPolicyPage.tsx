import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Database, Eye, Lock, Mail, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEO";

export default function PrivacyPolicyPage() {
  return (
    <>
      <SEOHead
        title="Privatumo Politika | Ponas Obuolys"
        description="Privatumo politika - kaip renkame, naudojame ir saugome jūsų duomenis. GDPR/BDAR atitiktis."
        canonical="https://ponasobuolys.lt/privatumas"
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
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-4xl font-bold">Privatumo Politika</h1>
          </div>
          <p className="text-muted-foreground">
            Paskutinį kartą atnaujinta: 2025-10-20
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none space-y-8 text-left">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" />
              Įvadas
            </h2>
            <p>
              Ponas Obuolys ("mes", "mūsų") gerbia jūsų privatumą ir įsipareigoja apsaugoti 
              jūsų asmens duomenis. Ši privatumo politika paaiškina, kaip renkame, naudojame 
              ir saugome jūsų informaciją, kai naudojatės mūsų svetaine.
            </p>
            <p>
              Mes laikomės Bendrojo duomenų apsaugos reglamento (BDAR/GDPR) ir Lietuvos 
              Respublikos asmens duomenų teisinės apsaugos įstatymo reikalavimų.
            </p>
          </section>

          {/* Data We Collect */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Database className="w-6 h-6 text-primary" />
              Kokie Duomenys Renkami
            </h2>
            
            <h3 className="text-xl font-semibold mb-3">1. Automatiškai Renkami Duomenys</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Sesijos ID:</strong> Unikalus identifikatorius, saugomas naršyklės 
                sesijos metu (sessionStorage)
              </li>
              <li>
                <strong>Peržiūrų istorija:</strong> Neseniai skaitytų publikacijų sąrašas 
                su laiko žymomis (localStorage, 30 min)
              </li>
              <li>
                <strong>Naršyklės informacija:</strong> User-Agent string (naršyklės tipas ir versija)
              </li>
              <li>
                <strong>Realaus laiko buvimas:</strong> Laikinas buvimo žymėjimas per 
                Supabase Realtime (tik aktyvios sesijos metu)
              </li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">2. Pasirinktinai Renkami Duomenys</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Prisijungus:</strong> El. pašto adresas (jei naudojate Google Sign-In)
              </li>
              <li>
                <strong>Komentarai:</strong> Komentaro turinys, data, vartotojo ID
              </li>
              <li>
                <strong>Žymėjimai:</strong> Išsaugotų publikacijų sąrašas
              </li>
            </ul>
          </section>

          {/* How We Use Data */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Eye className="w-6 h-6 text-primary" />
              Kaip Naudojame Duomenis
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Analitika:</strong> Skaičiuojame publikacijų peržiūras ir aktyvius 
                skaitytojus, kad suprastume, kokios temos populiariausios
              </li>
              <li>
                <strong>Deduplikacija:</strong> Užtikriname, kad ta pati peržiūra nebūtų 
                skaičiuojama kelis kartus per 30 minučių
              </li>
              <li>
                <strong>Funkcionalumas:</strong> Suteikiame galimybę komentuoti, išsaugoti 
                publikacijas, sekti skaitymo progresą
              </li>
              <li>
                <strong>Gerinimas:</strong> Analizuojame, kaip vartotojai naudojasi svetaine, 
                kad galėtume ją tobulinti
              </li>
            </ul>
          </section>

          {/* Data Storage */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Lock className="w-6 h-6 text-primary" />
              Duomenų Saugojimas ir Apsauga
            </h2>
            
            <h3 className="text-xl font-semibold mb-3">Kur Saugomi Duomenys</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Jūsų naršyklėje:</strong> sessionStorage, localStorage (tik jūsų įrenginyje)
              </li>
              <li>
                <strong>Supabase:</strong> Duomenų bazė (EU serveriai, GDPR atitiktis)
              </li>
              <li>
                <strong>Realtime:</strong> Laikinas buvimo žymėjimas (išsivalo automatiškai)
              </li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">Kaip Saugomi</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Visi duomenys perduodami per HTTPS (šifruotą ryšį)</li>
              <li>Duomenų bazė apsaugota Row Level Security (RLS) politikomis</li>
              <li>Prieiga prie duomenų ribota pagal vartotojo teises</li>
              <li>Reguliarūs saugumo auditai ir atnaujinimai</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">Laikymo Laikas</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Sesijos ID:</strong> Iki naršyklės uždarymo</li>
              <li><strong>Peržiūrų istorija:</strong> 30 minučių</li>
              <li><strong>Realtime buvimas:</strong> Tik aktyvios sesijos metu</li>
              <li><strong>Peržiūrų statistika:</strong> Neribotai (anoniminė)</li>
              <li><strong>Vartotojo paskyra:</strong> Kol neištrinsite</li>
            </ul>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              Jūsų Teisės (BDAR/GDPR)
            </h2>
            <p>Pagal BDAR/GDPR turite šias teises:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Teisė žinoti:</strong> Sužinoti, kokius duomenis renkame ir kaip juos naudojame
              </li>
              <li>
                <strong>Teisė pasiekti:</strong> Gauti savo duomenų kopiją
              </li>
              <li>
                <strong>Teisė ištaisyti:</strong> Pataisyti neteisingus duomenis
              </li>
              <li>
                <strong>Teisė ištrinti:</strong> Prašyti ištrinti savo duomenis ("teisė būti pamirštam")
              </li>
              <li>
                <strong>Teisė apriboti:</strong> Apriboti duomenų tvarkymą
              </li>
              <li>
                <strong>Teisė perkelti:</strong> Gauti duomenis mašinai skaitomu formatu
              </li>
              <li>
                <strong>Teisė nesutikti:</strong> Nesutikti su duomenų tvarkymu
              </li>
            </ul>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Slapukai</h2>
            <p>
              Naudojame slapukus ir panašias technologijas (localStorage, sessionStorage). 
              Daugiau informacijos rasite mūsų{" "}
              <Link to="/slapukai" className="text-primary hover:underline">
                Slapukų politikoje
              </Link>.
            </p>
          </section>

          {/* Third Parties */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Trečiosios Šalys</h2>
            <p>Naudojame šias trečiųjų šalių paslaugas:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Supabase:</strong> Duomenų bazė ir autentifikacija (EU serveriai, GDPR atitiktis)
              </li>
              <li>
                <strong>Google Sign-In:</strong> Prisijungimas per Google paskyrą (pasirinktinai)
              </li>
            </ul>
            <p className="mt-4">
              <strong>Svarbu:</strong> Mes neparduodame ir neperduodame jūsų duomenų trečiosioms 
              šalims rinkodaros tikslais.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Mail className="w-6 h-6 text-primary" />
              Susisiekite
            </h2>
            <p>
              Jei turite klausimų apie šią privatumo politiką arba norite pasinaudoti savo 
              teisėmis, susisiekite su mumis:
            </p>
            <ul className="list-none space-y-2 mt-4">
              <li>
                <strong>El. paštas:</strong>{" "}
                <a href="mailto:labas@ponasobuolys.lt" className="text-primary hover:underline">
                  labas@ponasobuolys.lt
                </a>
              </li>
              <li>
                <strong>Kontaktų forma:</strong>{" "}
                <Link to="/kontaktai" className="text-primary hover:underline">
                  ponasobuolys.lt/kontaktai
                </Link>
              </li>
            </ul>
          </section>

          {/* Changes */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Pakeitimai</h2>
            <p>
              Galime atnaujinti šią privatumo politiką. Apie svarbius pakeitimus informuosime 
              per svetainę arba el. paštu (jei esate prisijungę).
            </p>
            <p className="mt-4">
              <strong>Versija:</strong> 1.0<br />
              <strong>Paskutinį kartą atnaujinta:</strong> 2025-10-20
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
