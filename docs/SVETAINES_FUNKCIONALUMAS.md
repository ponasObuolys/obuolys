## Svetainės „Ponas Obuolys“ funkcionalumo apžvalga

Ši svetainė yra turinio ir mokymų platforma apie dirbtinį intelektą lietuvių kalba. Vartotojai gali skaityti publikacijas, naršyti bei filtruoti AI įrankius, peržiūrėti kursų pasiūlą, susisiekti per kontaktų formą, o prisijungę – valdyti savo profilį. Administratoriai turi dedikuotą valdymo skydelį turiniui, sekcijoms ir naudotojams tvarkyti.

Svetainė sukurta naudojant React + TypeScript, React Router, React Query, shadcn/ui komponentus ir Tailwind CSS. Duomenų bazė ir autentifikacija vykdoma per Supabase.

---

## Pagrindinės vartotojų funkcijos

- **Publikacijos**: peržiūra, paieška ir filtravimas pagal kategorijas.
  - Sąrašas: naujausios publikuotos naujienos ir straipsniai.
  - Detalė: turinys su vaizdais, SEO meta žymomis ir struktūrizuotais duomenimis (Article). URL: `/publikacijos/:slug`.

- **AI įrankiai**: naršymas, paieška ir filtravimas pagal kategorijas.
  - Sąrašas su paieška ir kategorijų filtrais, kiekvienam įrankiui – kortelė su aprašu.
  - Detalė: pateikiama platesnė informacija, nuorodos, struktūrizuoti duomenys (SoftwareApplication). URL: `/irankiai/:slug`.

- **Kursai**: viešas kursų katalogas ir kurso detalė.
  - Sąrašas: publikuoti kursai (kaina, pavadinimas, trukmė).
  - Detalė: pilnas aprašymas, struktūrizuoti duomenys (Course), CTA įsigijimui (pvz., Patreon). URL: `/kursai/:slug`.

- **Kontaktai**: kontaktinė informacija ir forma.
  - Forma leidžia pateikti vardą, el. paštą, temą ir žinutę; įrašai saugomi `contact_messages` lentelėje.
  - Pateikiamos tiesioginės nuorodos į el. paštą, YouTube ir WhatsApp.

- **Parama**: informacija apie paramos galimybes (Patreon, YouTube narys­tystė) ir grįžimo mygtukas.

- **Autentifikacija (prisijungimas/registracija)**:
  - Prisijungimas ir registracija su `zod` + `react-hook-form` validacija.
  - Po prisijungimo vartotojas grąžinamas į pradžios puslapį.

- **Profilis**: prisijungę vartotojai gali tvarkyti savo profilį.
  - Skiltys: „Profilis“, „Veikla“, „Saugumas“, „Pranešimai“.
  - Palaikomas el. pašto atnaujinimas, slaptažodžio keitimas, profilio nuotraukos įkėlimas į Supabase Storage (`site-images/avatars/...`).

---

## Administravimo skydelis (admin)

Prieiga tik administratoriams (pagal `profiles.is_admin`). Neadmin vartotojai nukreipiami į pradžią.

- **Apžvalga**: svarbiausia statistika (publikacijų, įrankių, kursų, vartotojų, hero/CTA sekcijų, kontaktinių žinučių skaičiai).
- **Publikacijos**: sąrašas ir redaktorius (kurti, redaguoti, trinti; `articles`).
- **Įrankiai**: sąrašas ir redaktorius (kurti, redaguoti, trinti; `tools`).
- **Kursai**: sąrašas ir redaktorius (kurti, redaguoti, trinti; `courses`).
- **Hero sekcijos**: skilties turinio redagavimas (`hero_sections`).
- **CTA sekcijos**: „call-to-action“ skilties redagavimas (`cta_sections`).
- **Kontaktai**: kontaktinių žinučių peržiūra ir tvarkymas (`contact_messages`).
- **Vartotojai**: naudotojų sąrašas ir bazinė administracija (`profiles`).

Papildomai yra specialus puslapis `AdminUserCleanup` testinių naudotojų profiliams tvarkyti:

- Skiltys: `auth_users_view` (tik skaitymui), `user_profiles` (tik skaitymui), `profiles` (redaguojama lentelė).
- Galima šalinti testinių naudotojų profilius iš `profiles` (pagal filtrus, pvz., el. paštai su `test-` ar `@example.com`).
- Paaiškinimai apie teises: anon raktu negalima trinti įrašų iš `auth.users`; tam reikalingas service role raktas.

---

## Maršrutai (nuorodos) ir prieiga

- `/` – Pagrindinis puslapis (hero, išskirtinės publikacijos, įrankiai, kursai, CTA).
- `/publikacijos` – Publikacijų sąrašas (paieška + kategorijos).
- `/publikacijos/:slug` – Publikacijos detalė.
- `/irankiai` – Įrankių katalogas (paieška + kategorijos).
- `/irankiai/:slug` – Įrankio detalė.
- `/kursai` – Kursų sąrašas.
- `/kursai/:slug` – Kurso detalė.
- `/kontaktai` – Kontaktų puslapis su forma.
- `/paremti` – Paramos puslapis.
- `/auth` – Prisijungimas/registracija (tik neprisijungusiems).
- `/profilis` – Naudotojo profilis (reikia būti prisijungus).
- `/admin` – Administravimo skydelis (reikia admin teisių).
- `/admin/cleanup` – Testinių vartotojų profilių tvarkymas (reikia admin teisių).

Visi maršrutai apsaugoti maršrutų lygiu naudojant klaidų ir prieigos „error boundaries“, o administravimo ir profilio maršrutai turi papildomas prieigos patikras.

---

## Paieška, filtrai ir UX detalės

- **Publikacijos**: paieška pagal pavadinimą/aprašą; filtrai pagal kategorijas.
- **Įrankiai**: paieška pagal pavadinimą/aprašą/kategoriją; filtrai pagal kategorijas.
- **Kursai**: surikiuota abėcėlės tvarka; tuščio sąrašo būsenos pranešimai.
- **Srautų valdymas**: `React Query` su išmaniu pakartojimu ir klaidų apdorojimu.
- **Klaidų apdorojimas**: toast pranešimai ir „error boundaries“ konkretiems maršrutams.
- **SEO**: `react-helmet-async` meta žymos ir `JSON-LD` (Article, SoftwareApplication, Course) detalės puslapiuose.
- **Našumas**: lazy load komponentai, „intelligent preloading“, `LazyImage`, `useLazyImages`, `addLazyLoadingToImages` HTML turiniui.

---

## Duomenų bazė ir integracijos (Supabase)

- **Autentifikacija**: prisijungimas, registracija, atsijungimas. Vartotojo sesija ir būsenos stebėjimas.
- **Vaidmenys**: `profiles.is_admin` naudojamas admin prieigai nustatyti.
- **Lentelės (naudojamos šiame projekte)**:
  - `articles` – publikacijų sąrašas (su `published`, `category`, `content_type`, `read_time` ir kt.).
  - `tools` – AI įrankiai (su kategorijomis, aprašais, nuorodomis, paveikslėliais).
  - `courses` – kursai (pavadinimas, aprašymas, kaina, trukmė, lygis, turinys, `published`).
  - `profiles` – naudotojų profiliai (username, avatar_url, is_admin ir kt.).
  - `hero_sections`, `cta_sections` – viešo puslapio sekcijų turinys.
  - `contact_messages` – kontaktų formos įrašai.
- **Peržiūros (views)**: `auth_users_view`, `user_profiles` – naudojamos admin valymui (skaitymui).
- **Storage**: `site-images` talpykloje laikomos profilio nuotraukos; grąžinami vieši URL.

Pastaba: RLS politikos turi būti išlaikomos pagal projekto `DB_INFO.md` taisykles.

---

## Tipinės naudotojų užduotys

- Rasti ir skaityti AI naujienas bei straipsnius.
- Atrasti naudingus AI įrankius filtravimo ir paieškos pagalba.
- Peržiūrėti kursų aprašus ir įsigyti pasirinktą kursą per nurodytas platformas.
- Susisiekti užpildant kontaktų formą.
- Užsiregistruoti ir prisijungti, kad tvarkyti profilį (pakeisti el. paštą, slaptažodį, įkelti avatarą).

---

## Tipinės administratorių užduotys

- Kurti, redaguoti ir skelbti publikacijas, įrankius, kursus.
- Redaguoti viešo puslapio „Hero“ ir „CTA“ sekcijas.
- Peržiūrėti ir tvarkyti kontaktines žinutes.
- Stebėti svarbiausius turinio ir naudotojų rodiklius.
- Tvarkyti testinius naudotojų profilius (tik `profiles` lentelėje, laikantis teisių).

---

## Technologijos ir architektūros akcentai

- **Frontend**: React + TypeScript, Vite, React Router.
- **UI**: shadcn/ui komponentai, Tailwind CSS, mobilusis pirmas (responsive) dizainas.
- **Būsena**: `@tanstack/react-query` serverinė būsena; standartiniai React hook’ai kliento būsenai.
- **Formos ir validacija**: `react-hook-form` + `zod`.
- **Duomenys**: Supabase (DB + Auth + Storage), nuoseklūs užklausų moduliai.
- **Klaidų valdymas**: toast pranešimai, maršrutų „error boundaries“, centralizuotas žurnalizavimas.
- **Našumas**: lazy loading, išmanus preloading, `LazyImage`, atidėtas paveikslėlių įkėlimas HTML turinyje.
- **SEO**: `react-helmet-async`, `JSON-LD` struktūrizuoti duomenys.
- **Analitika**: `@vercel/analytics` produkcinėje aplinkoje.

---

## Saugumas ir prieigos kontrolė

- Administratoriaus teisės nustatomos pagal `profiles.is_admin` reikšmę (tikrinama po prisijungimo ir esant sesijai).
- Apsauga maršrutų lygiu: profilio (`/profilis`) ir admin (`/admin`, `/admin/cleanup`) puslapiai reikalauja atitinkamų teisių; nesant – peradresuojama.
- Autentifikacijos būsenos stebėjimas realiuoju laiku (Supabase `onAuthStateChange`).

---

## Ką galima daryti šioje svetainėje?

- Skaityti lietuviškas AI naujienas ir straipsnius.
- Ieškoti ir filtruoti AI įrankius pagal poreikius.
- Rasti ir išsirinkti AI kursus, sužinoti jų kainą ir turinį.
- Susisiekti dėl konsultacijų, bendradarbiavimo ar klausimų.
- Registruotis, prisijungti ir tvarkyti savo profilį (el. paštas, slaptažodis, avataras).
- Paremti projektą per Patreon ar YouTube narystę.
- (Admin) Valdyti visą turinį, sekcijas, kontaktus ir naudotojus, atlikti testinių profilių tvarkymą.

---

## Nuorodos (greita atmintinė)

- Pagrindinis: `/`
- Publikacijos: `/publikacijos`, detalė: `/publikacijos/:slug`
- Įrankiai: `/irankiai`, detalė: `/irankiai/:slug`
- Kursai: `/kursai`, detalė: `/kursai/:slug`
- Kontaktai: `/kontaktai`
- Parama: `/paremti`
- Autentifikacija: `/auth`
- Profilis: `/profilis`
- Admin: `/admin`, naudotojų valymas: `/admin/cleanup`
