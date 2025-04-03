# Projekto "Ponas Obuolys" Kelrodė (Roadmap)

Šis dokumentas apibrėžia projekto "Ponas Obuolys" viziją, tikslus ir planuojamus darbus.

## Vizija

Sukurti platformą, kurioje youtuberis Ponas Obuolys galėtų dalintis savo žiniomis apie dirbtinį intelektą (AI), pardavinėti kursus bei konsultacijas AI entuziastams Lietuvoje, kurie naudoja AI kasdienai ir uždarbiui internete.

## Tikslai

*   **Padidinti lankomumą:** Pritraukti tikslinę auditoriją į svetainę.
*   **Generuoti pajamas:** Sėkmingai pardavinėti kursus ir konsultacijas.
*   **Kurti bendruomenę:** Suburti AI entuziastų bendruomenę aplink Pono Obuolio turinį.

## Trumpalaikiai Prioritetai (Artimiausi darbai)

*   **[ ] Stripe API integracija:**
    *   Sukurti galimybę įsigyti kursus per Stripe.
    *   Sukurti galimybę užsisakyti konsultacijas per Stripe.
*   **[ ] Veikiančios formos:**
    *   Kontaktų forma:
        *   [ ] Sukurti formos komponentą.
        *   Integruoti su backend'u arba el. pašto siuntimo paslauga (pvz., Supabase functions, Resend).
        *   Pridėti validaciją.
    *   Naujienlaiškio forma:
        *   Sukurti formos komponentą.
        *   Integruoti su el. pašto rinkodaros įrankiu (pvz., Mailchimp, Brevo) arba saugoti prenumeratorius Supabase.
        *   Pridėti validaciją.
*   **[X] Klaidų taisymas:**
    *   **[X] 404 klaida atnaujinus puslapį:** Ištaisyta sukūrus `vercel.json`.
*   **[X] Naujienų skilties pašalinimas:**
    *   Pašalintas `/naujienos` maršrutas ir susiję komponentai.
    *   Pašalintos nuorodos iš navigacijos.
    *   Pašalintas naujienų valdymas iš admin panelės.
*   **[X] Straipsnių ir naujienų sujungimas:**
    *   Pervadinta "Straipsniai" į "Publikacijos" (navigacija, puslapiai, admin panelė).
    *   Pridėtas `content_type` laukas `articles` lentelei (DB pakeitimas).
    *   Atnaujintas `PublicationEditor`, leidžiant pasirinkti tipą.
    *   Pridėtos vizualios žymos (Badges) publikacijų sąraše ir detalės puslapyje.

## Ilgalaikiai Planai (Ateities idėjos)

*   Išplėsti kursų pasiūlą.
*   Sukurti forumą arba diskusijų grupę bendruomenei.
*   Papildomos integracijos (pvz., Discord).
*   SEO optimizacija.
*   Turinio lokalizacija (jei planuojama plėstis į kitas rinkas).

## Technologijos

*   Frontend: React, TypeScript, Vite, Tailwind CSS, shadcn/ui
*   Backend & DB: Supabase
*   Hosting: Vercel
*   Mokėjimai: Stripe

## Taisyklės ir Gairės

*   Laikytis `DB_INFO.md` duomenų bazės struktūros.
*   Laikytis projekto kodo stiliaus ir formatavimo taisyklių (`.cursorrules`, `eslint.config.js`).
*   Visi pakeitimai turi būti daromi per Git versijų kontrolę su aiškiais komentarais.
*   Nauji komponentai turi atitikti esamus šablonus. 