# Projekto "Ponas Obuolys" Kelrodė (Roadmap)

Šis dokumentas apibrėžia projekto "Ponas Obuolys" viziją, tikslus ir planuojamus darbus.

## Vizija

Sukurti platformą, kurioje youtuberis Ponas Obuolys galėtų dalintis savo žiniomis apie dirbtinį intelektą (AI), pardavinėti kursus bei konsultacijas AI entuziastams Lietuvoje, kurie naudoja AI kasdienai ir uždarbiui internete.

## Tikslai

*   **Padidinti lankomumą:** Pritraukti tikslinę auditoriją į svetainę.
*   **Generuoti pajamas:** Sėkmingai pardavinėti kursus ir konsultacijas.
*   **Kurti bendruomenę:** Suburti AI entuziastų bendruomenę aplink Pono Obuolio turinį.

## Trumpalaikiai Prioritetai (Artimiausi darbai)

*   **[X] Įrankių puslapio (/irankiai) atnaujinimas:**
    *   [X] Perkeltas paieškos laukelis virš kategorijų, pagerintas jo matomumas.
    *   [X] Atnaujinta įrankių kortelių navigacija (paspaudus veda į detalų puslapį `/irankiai/:slug`).
    *   [X] "Išbandyti" mygtukas veikia kaip tiesioginė nuoroda į išorinę svetainę.
    *   [X] Sukurtas įrankio detalaus aprašymo puslapis (`ToolDetailPage.tsx`) su šablonu (`ToolDetailCard.tsx`).
    *   [X] Pridėta "Grįžti į įrankių sąrašą" nuoroda.
    *   [X] Pagerintas kategorijų filtravimas (vizualinis indikatorius, veikia su paieška).
*   **[ ] Stripe API integracija:**
    *   [ ] Sukurti galimybę įsigyti kursus per Stripe.
    *   [ ] Sukurti galimybę užsisakyti konsultacijas per Stripe.
*   **[ ] Veikiančios formos:**
    *   Kontaktų forma:
        *   [ ] Sukurti formos komponentą.
        *   [ ] Integruoti su backend'u arba el. pašto siuntimo paslauga (pvz., Supabase functions, Resend).
        *   [ ] Pridėti validaciją.
    *   Naujienlaiškio forma:
        *   [ ] Sukurti formos komponentą.
        *   [ ] Integruoti su el. pašto rinkodaros įrankiu (pvz., Mailchimp, Brevo) arba saugoti prenumeratorius Supabase.
        *   [ ] Pridėti validaciją.
*   **[X] Klaidų taisymas:**
    *   **[X] 404 klaida atnaujinus puslapį:** Ištaisyta sukūrus `vercel.json`.
*   **[X] Naujienų skilties pašalinimas:**
    *   [X] Pašalintas `/naujienos` maršrutas ir susiję komponentai.
    *   [X] Pašalintos nuorodos iš navigacijos.
    *   [X] Pašalintas naujienų valdymas iš admin panelės.
*   **[X] Straipsnių ir naujienų sujungimas:**
    *   [X] Pervadinta "Straipsniai" į "Publikacijos" (navigacija, puslapiai, admin panelė).
    *   [X] Pridėtas `content_type` laukas `articles` lentelei (DB pakeitimas).
    *   [X] Atnaujintas `PublicationEditor`, leidžiant pasirinkti tipą.
    *   [X] Pridėtos vizualios žymos (Badges) publikacijų sąraše ir detalės puslapyje.

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