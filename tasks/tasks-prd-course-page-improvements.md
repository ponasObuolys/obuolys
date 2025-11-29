# Tasks: Kurso Puslapio Patobulinimai ir Admin Valdymas

## Relevant Files

### Duomenų bazė
- `supabase/migrations/XXXXXX_course_testimonials.sql` - Atsiliepimų lentelės migracija
- `supabase/migrations/XXXXXX_course_faq.sql` - FAQ lentelės migracija
- `supabase/migrations/XXXXXX_course_new_fields.sql` - Naujų laukų migracija (max_spots, course_start_date, pdf_guides, cta_button_text)
- `src/integrations/supabase/types.ts` - Supabase tipų atnaujinimas (generuojamas automatiškai)

### Atsiliepimų sistema
- `src/components/course/course-testimonials.tsx` - Atsiliepimų kortelių komponentas kurso puslapyje
- `src/components/admin/testimonials-manager.tsx` - Admin atsiliepimų valdymo komponentas
- `src/hooks/use-course-testimonials.ts` - Hook atsiliepimų duomenims gauti
- `src/services/testimonials.service.ts` - Atsiliepimų CRUD operacijos

### FAQ sistema
- `src/components/course/course-faq.tsx` - FAQ accordion komponentas kurso puslapyje
- `src/components/admin/faq-manager.tsx` - Admin FAQ valdymo komponentas
- `src/hooks/use-course-faq.ts` - Hook FAQ duomenims gauti
- `src/services/faq.service.ts` - FAQ CRUD operacijos

### Vietų skaičiavimas
- `src/components/course/course-spots-badge.tsx` - Vietų rodiklio badge komponentas
- `src/utils/calculate-remaining-spots.ts` - Vietų skaičiavimo logika

### PDF gidai ir CTA
- `src/components/course/course-pdf-guides.tsx` - PDF gidų sąrašo komponentas
- `src/components/admin/course-editor/course-additional-fields.tsx` - Nauji Admin formos laukai

### Kurso puslapis
- `src/pages/CourseDetail.tsx` - Pagrindinis kurso puslapis (modifikuoti)
- `src/components/course/CourseHero.tsx` - Hero sekcija (modifikuoti - mobilios vertės)
- `src/components/course/CoursePurchaseCard.tsx` - Pirkimo kortelė (modifikuoti - CTA tekstas)

### Admin panelė
- `src/components/admin/course-editor/index.tsx` - Kurso redaktorius (modifikuoti)
- `src/components/admin/course-editor/course-editor.types.ts` - Tipai (modifikuoti)
- `src/components/admin/course-editor/course-editor.hooks.ts` - Hooks (modifikuoti)

### SEO
- `src/utils/seo.ts` - SEO generavimo funkcijos (patikrinti)
- `src/components/SEO.tsx` - SEO Head komponentas (patikrinti)
- `index.html` - Default meta tags (patikrinti)

### Notes

- Unit tests should typically be placed alongside the code files they are testing
- Use `npm run test` to run tests
- Naudoti Supabase MCP (`mcp4_apply_migration`) migracijoms taikyti
- Naudoti `mcp4_execute_sql` duomenų įterpimui

## Tasks

- [x] 1.0 Duomenų bazės struktūros atnaujinimas
  - [x] 1.1 Sukurti `course_testimonials` lentelę su laukais: id, course_id, name, content, display_order, is_active, created_at
  - [x] 1.2 Sukurti `course_faq` lentelę su laukais: id, course_id, question, answer, display_order, is_active, created_at
  - [x] 1.3 Pridėti naujus laukus į `courses` lentelę: max_spots, course_start_date, pdf_guides, cta_button_text
  - [x] 1.4 Sukurti RLS politikas naujoms lentelėms (public read, admin write)
  - [x] 1.5 Įterpti pradinius atsiliepimų duomenis (4 atsiliepimai)
  - [x] 1.6 Atnaujinti dabartinio kurso duomenis (max_spots=30, course_start_date, pdf_guides, cta_button_text)

- [x] 2.0 Atsiliepimų sistemos implementacija
  - [x] 2.1 Sukurti `testimonials.service.ts` su CRUD operacijomis
  - [x] 2.2 Sukurti `use-course-testimonials.ts` hook su React Query
  - [x] 2.3 Sukurti `course-testimonials.tsx` komponentą (3-4 kortelės grid)
  - [x] 2.4 Sukurti `testimonials-manager.tsx` Admin komponentą (CRUD UI)
  - [x] 2.5 Integruoti atsiliepimų valdymą į kurso redaktorių

- [x] 3.0 FAQ sistemos implementacija
  - [x] 3.1 Sukurti `faq.service.ts` su CRUD operacijomis
  - [x] 3.2 Sukurti `use-course-faq.ts` hook su React Query
  - [x] 3.3 Sukurti `course-faq.tsx` accordion komponentą (naudoti shadcn/ui Accordion)
  - [x] 3.4 Sukurti `faq-manager.tsx` Admin komponentą (CRUD UI su drag-and-drop eilės tvarka)
  - [x] 3.5 Integruoti FAQ valdymą į kurso redaktorių

- [x] 4.0 Vietų skaičiavimo sistemos implementacija
  - [x] 4.1 Sukurti `calculate-remaining-spots.ts` utility funkciją
  - [x] 4.2 Sukurti `course-spots-badge.tsx` komponentą su spalvų logika (žalia >10, oranžinė 5-10, raudona <5)
  - [x] 4.3 Integruoti badge į CoursePurchaseCard ir CourseHero (mobile)
  - [x] 4.4 Pridėti max_spots ir course_start_date laukus į Admin formą

- [x] 5.0 PDF gidų ir CTA valdymo implementacija
  - [x] 5.1 Sukurti `course-pdf-guides.tsx` komponentą ("Ką gausite" sekcija)
  - [x] 5.2 Pridėti pdf_guides lauką į Admin formą (masyvo valdymas kaip highlights)
  - [x] 5.3 Pridėti cta_button_text lauką į Admin formą
  - [x] 5.4 Atnaujinti CoursePurchaseCard ir CourseHero naudoti cta_button_text
  - [x] 5.5 Atnaujinti course-editor.types.ts su naujais laukais
  - [x] 5.6 Atnaujinti course-editor.hooks.ts saugoti naujus laukus

- [x] 6.0 Kurso puslapio UI atnaujinimas
  - [x] 6.1 Pašalinti YouTube video iframe iš CourseDetail.tsx
  - [x] 6.2 Pridėti mobilios vertės breakdown į CourseHero (sutrumpinta versija)
  - [x] 6.3 Integruoti CourseTestimonials komponentą į CourseDetail
  - [x] 6.4 Integruoti CourseFaq komponentą į CourseDetail
  - [x] 6.5 Integruoti CoursePdfGuides komponentą į CourseDetail
  - [x] 6.6 Integruoti CourseSpotsBadge į pirkimo sekcijas (jau padaryta 4.3)

- [x] 7.0 Admin panelės kurso formos išplėtimas (jau atlikta ankstesnėse užduotyse)
  - [x] 7.1 Sukurti naują tab "Papildomi nustatymai" kurso formoje (2.5/3.5)
  - [x] 7.2 Pridėti vietų limito ir kurso datos laukus (4.4)
  - [x] 7.3 Pridėti PDF gidų valdymą (5.2)
  - [x] 7.4 Pridėti CTA mygtuko teksto lauką (5.3)
  - [x] 7.5 Pridėti atsiliepimų pasirinkimo/valdymo sekciją (2.5)
  - [x] 7.6 Pridėti FAQ valdymo sekciją (3.5)

- [x] 8.0 SEO ir baigiamieji pataisymai
  - [x] 8.1 Patikrinti ir pataisyti SEOHead komponentą (dinaminis title/description) ✓
  - [x] 8.2 Patikrinti index.html default meta tags neperrašo dinaminių ✓
  - [ ] 8.3 Testuoti OG tags su Facebook Sharing Debugger (žr. instrukcijas žemiau)
  - [ ] 8.4 Galutinis testavimas visų naujų funkcijų (žr. instrukcijas žemiau)
  - [ ] 8.5 Patikrinti mobilią versiją (žr. instrukcijas žemiau)
