# Obuolys Spotlight PRD - Asmeninės Svetainės Transformacija

## Projekto Apžvalga

**Obuolys** svetainės transformacija į Spotlight asmeninės svetainės šabloną, pritaikytą lietuvių kalbai ir išlaikant esamą duomenų bazės struktūrą bei funkcionalumą.

### Pagrindiniai Tikslai
- Transformuoti dabartinę svetainę į modernų asmeninės svetainės formatą
- Išlaikyti visą esamą funkcionalumą ir duomenų bazės struktūrą
- Pritaikyti Spotlight dizaino principus lietuvių kalbos kontekstui
- Sukurti intuityvų, mobilų ir greitą vartotojo sąsają

## Esama Architektūra vs. Spotlight Architektūra

### Dabartinė Technologijų Steka
- **Frontend:** React 18.3.1 + TypeScript + Vite
- **UI:** Shadcn/UI + Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth)
- **Deployment:** Vercel

### Spotlight Pritaikymas
- **Išlaikyti:** React + TypeScript + Tailwind CSS
- **Adaptuoti:** Spotlight dizaino principus su esama komponentų struktūra
- **Papildyti:** MDX palaikymą straipsnių sistemai
- **Optimizuoti:** Performance ir SEO aspektus

## Funkciniai Reikalavimai

### 1. Pagrindinio Puslapio Transformacija

#### Hero Sekcija (Spotlight įkvėpta)
- **Duomenų šaltinis:** `hero_sections` lentelė
- **Funkcionalumas:**
  - Autoriaus pristatymas su profilio nuotrauka
  - Subtilus dizainas su spalvų akcentais
  - Pasukta nuotrauka (Spotlight charakteristika)
  - Socialinių tinklų nuorodos
  - CTA mygtukai

#### Blog Sekcija
- **Duomenų šaltinis:** `articles` lentelė
- **Funkcionalumas:**
  - Straipsnių tinklelis su featured pažymėjimais
  - Kategorijų filtravimas
  - Skaitymo laiko rodiklis
  - Responsive dizainas

#### AI Įrankių Katalogas
- **Duomenų šaltinis:** `tools` lentelė
- **Funkcionalumas:**
  - Įrankių korteles su kategorijomis
  - Featured įrankių išskyrimas
  - Paieškos funkcionalumas

#### Kursų Sekcija
- **Duomenų šaltinis:** `courses` lentelė
- **Funkcionalumas:**
  - Kursų korteles su level ir duration
  - Pricing informacija
  - Course highlights

### 2. Navigacijos Sistema

#### Viršutinė Navigacija
- **Minimalistinis dizainas:** Spotlight principai
- **Responsyvus:** Mobile hamburger meniu
- **Struktūra:**
  - Pagrindinis
  - Blog
  - Įrankiai
  - Kursai
  - Kontaktai

#### Šoninė Juosta (Spotlight charakteristika)
- **Newsletter forma:** Papildyti `contact_messages` lentelę
- **Socialiniai tinklai:** Integruoti su profiles
- **Mini biografija:** Trumpas aprašymas

### 3. Blog Sistema (MDX Integracijos)

#### Straipsnių Valdymas
- **Esama sistema:** `articles` lentelė
- **Papildymai:**
  - MDX palaikymas content laukui
  - Syntax highlighting
  - Interaktyvūs komponentai straipsniuose
  - Automatinis RSS feed

#### Straipsnių Puslapiai
- **Dizainas:** Spotlight skaitymo patirtis
- **Funkcionalumas:**
  - Breadcrumb navigacija
  - Sharing mygtukai
  - Susiję straipsniai
  - Komentarų sistema (ateityje)

### 4. Admin Dashboard Adaptacija

#### Turinio Valdymas
- **Išlaikyti:** Visus esamus admin komponentus
- **Papildyti:** 
  - MDX editor straipsniams
  - Spotlight template preview
  - Image optimization tools
  - SEO meta duomenų valdymas

#### Naujos Admin Funkcijos
- **Newsletter valdymas:** Subscriptions iš contact_messages
- **Analytics dashboard:** Integruoti su Vercel Analytics
- **Performance metrics:** Loading times, user engagement

## Dizaino Reikalavimai

### Spotlight Dizaino Principai

#### Spalvų Paletė
- **Pagrindinės spalvos:** Neutralūs atspalviai
- **Akcentai:** Spalvų akcentai nuorodoms ir CTA
- **Tamsus režimas:** Opcional (ateityje)

#### Tipografija
- **Pirminiai šriftai:** Inter arba panašūs
- **Hierarchija:** H1-H6 su aiškiomis proporcijomis
- **Skaitymo patirtis:** Optimizuoti line-height ir spacing

#### Komponentų Stiliai
- **Kortelės:** Subtilūs šešėliai ir border-radius
- **Mygtukai:** Hover efektai ir animacijos
- **Formos:** Minimal dizainas su focus states
- **Nuotraukos:** Rounded corners, pasuktos kortelės

### Responsive Design
- **Mobile-first:** Tailwind CSS principai
- **Breakpoints:** sm, md, lg, xl, 2xl
- **Touch-friendly:** Minimum 44px tap targets
- **Performance:** Lazy loading, optimized images

## Techniniai Reikalavimai

### Database Schema Išlaikymas
- **Visi lentelės:** Išlaikyti esamas 9 lenteles
- **RLS Policies:** Išlaikyti visus saugumo apribojimus
- **Nauji laukai:** Pridėti jei reikalinga MDX palaikymui

### Performance Optimizacijos
- **Bundle size:** Vite code splitting
- **Images:** Next/Image tipo optimizacija
- **Fonts:** Preload kritiniai šriftai
- **CSS:** Tailwind CSS purging

### SEO Optimizacijos
- **Meta tags:** Automatinis generavimas
- **Structured data:** JSON-LD markup
- **Sitemap:** Automatinis generavimas
- **RSS feed:** Blog straipsniams

## Migracija ir Implementacija

### Fazių Planas

#### 1 Fazė: Dizaino Sistema ✅ ATLIKTA
- ✅ Sukurti Spotlight tema Tailwind CSS
- ✅ Adaptuoti esamus UI komponentus
- ✅ Implementuoti naują spalvų paletę

#### 2 Fazė: Pagrindinio Puslapio Transformacija ✅ ATLIKTA
- ✅ Hero sekcijos redesign
- ✅ Blog sekcijos Spotlight stilius
- ✅ Navigacijos sistema
- ✅ Šoninė juosta

#### 3 Fazė: Blog Sistema
- MDX integracijos
- Straipsnių puslapių redesign
- RSS feed generavimas
- Sharing funkcionalumas

#### 4 Fazė: Admin Dashboard
- MDX editor
- Preview funkcionalumas
- Analytics integracija
- Performance monitoring

#### 5 Fazė: Optimizacijos
- Performance tuning
- SEO optimizacijos
- Mobile experience
- Accessibility WCAG

### Rizikas ir Švelninimai

#### Techniniai Rizikai
- **MDX integracija:** Galimas performance impact
- **Sprendimas:** Incremental adoption, static generation

#### Dizaino Rizikai
- **Spotlight adaptation:** Gali neatitikti lietuvių rinkos
- **Sprendimas:** A/B testing, user feedback

#### Duomenų Rizikai
- **Schema changes:** Galimas downtime
- **Sprendimas:** Blue-green deployment, migration scripts

## Sėkmės Kriterijai

### Performance Metrics
- **Page Load Time:** < 2s pirmas apsilankymas
- **LCP:** < 2.5s
- **FID:** < 100ms
- **CLS:** < 0.1

### User Experience
- **Mobile usability:** 100% Google PageSpeed
- **Accessibility:** WCAG AA compliance
- **SEO Score:** 90+ Google Lighthouse

### Business Metrics
- **Bounce rate:** < 40%
- **Session duration:** > 3 minutes
- **Newsletter signups:** +50% augimas
- **Course inquiries:** +30% augimas

## Palaikymasis ir Plėtra

### Ateities Funkcionalumas
- **Komentarų sistema:** Straipsniams
- **Paieškos funkcionalumas:** Full-text search
- **Tamsus režimas:** UI toggle
- **Multilingual:** Anglų kalbos palaikymas

### Techninis Palaikymas
- **Monitoring:** Error tracking, performance monitoring
- **Backup:** Automatiniai database backups
- **Updates:** Regular dependency updates
- **Security:** Regular security audits

## Implementacijos Ataskaita

### Atlikti Darbai (2025-01-04)

#### 1 Fazė: Dizaino Sistema ✅ UŽBAIGTA
**Tailwind CSS Konfigūracijos Atnaujinimas:**
- ✅ Pridėta Spotlight spalvų paletė (primary: #0ea5e9, accent: #f59e0b, neutralūs pilkumai)
- ✅ Pridėti specifiniai spotlight spalvų variantai (spotlight-neutral, spotlight-accent, spotlight-blue)
- ✅ Implementuoti Spotlight gradientai (spotlight-gradient, spotlight-accent)
- ✅ Pridėti Inter šrifto palaikymas
- ✅ Sukurtos Spotlight animacijos (spotlight-float, spotlight-rotate, spotlight-scale)
- ✅ Pridėti spacing ir transform utility klasės

**Hero Sekcijos Transformacija:**
- ✅ Pakeistas layout į asmeninės svetainės formatą
- ✅ Pridėta "Sveiki, aš Ponas Obuolys" antraštė su spalvų akcentu
- ✅ Implementuota pasukta nuotrauka su hover efektais (6deg rotacija)
- ✅ Pridėti socialinių tinklų piktogramos
- ✅ Atnaujinti CTA mygtukai su Spotlight stilium
- ✅ Pridėti foniniai dekoro elementai (blur circles)
- ✅ Implementuota floating animacija nuotraukai

**Header Navigacijos Atnaujinimas:**
- ✅ Pakeistas į minimalistinį Spotlight dizainą
- ✅ Pridėtas backdrop-blur efektas
- ✅ Atnaujinti navigacijos stiliai su rounded corners
- ✅ Implementuoti active state su spotlight-accent spalva
- ✅ Atnaujinta mobile navigation su backdrop blur
- ✅ Pridėti smooth hover animacijos

**Pagrindinio Puslapio Layout ir Sekcijos:**
- ✅ Sukurtas Spotlight layout su sidebar
- ✅ FeaturedArticles sekcijos redesign su staggered animacijomis
- ✅ AI Tools sekcijos atnaujinimas (spotlight-blue akcentai)
- ✅ Courses sekcijos transformacija su placeholder kortėmis
- ✅ Newsletter forma sidebar su Supabase integracija
- ✅ About autoriaus kortelė sidebar
- ✅ Populiarių temų sekcija
- ✅ Footer redesign su Spotlight stilium

### Likusios Fazės

#### 2 Fazė: Pagrindinio Puslapio Transformacija ✅ UŽBAIGTA (2025-01-04)
**Atliktų darbų sąrašas:**
- ✅ Blog sekcijos Spotlight stilius
- ✅ Šoninė juosta su newsletter forma
- ✅ AI įrankių sekcijos redesign
- ✅ Kursų sekcijos redesign
- ✅ Footer atnaujinimas

#### 3 Fazė: Blog Sistema
- ⏳ MDX integracijos
- ⏳ Straipsnių puslapių redesign
- ⏳ RSS feed generavimas
- ⏳ Sharing funkcionalumas

### Techniniai Sprendimai

**Išlaikyti sprendimai:**
- React 18.3.1 + TypeScript
- Shadcn/UI komponentų struktūra
- Supabase duomenų bazės schema
- Vite build sistema

**Pridėti sprendimai:**
- Spotlight spalvų sistema
- Inter šrifto palaikymas
- Backdrop blur efektai
- Smooth animacijos ir hover efektai

**Sekantys žingsniai:**
1. ✅ Blog sekcijos transformacija (ATLIKTA)
2. ✅ Šoninės juostos implementacija (ATLIKTA)
3. ⏳ MDX integracijos
4. ⏳ Performance optimizacijos

### Pabaigos Ataskaita (2025-01-04)

**Sėkmingai užbaigtos fazės:**
- ✅ **1 Fazė: Dizaino Sistema** - Pilnai implementuota Spotlight spalvų paletė, animacijos ir komponentai
- ✅ **2 Fazė: Pagrindinio Puslapio Transformacija** - Pilnai transformuotas pagrindinis puslapis

**Pagrindiniai pasiekimai:**
- Svetainė transformuota į modernų asmeninės svetainės formatą pagal Spotlight principus
- Išlaikytas visas funkcionalumas ir duomenų bazės struktūra
- Implementuotas responsive dizainas su mobile-first principu
- Sukurta newsletter integracijos su Supabase
- Pridėti smooth animacijos ir hover efektai

**Techniniai sprendimai:**
- Spotlight spalvų sistema su amber ir sky blue akcentais
- Inter šrifto naudojimas optimizuotam skaitymo patirčiai
- Backdrop blur efektai moderniame navigacijoje
- Sticky sidebar su newsletter forma

## Išvados

Šis PRD apibrėžė visapusišką Obuolys svetainės transformaciją į modernų Spotlight asmeninės svetainės formatą. **2 iš 5 fazių sėkmingai užbaigtos 2025-01-04.** Svetainė dabar turi modernų, profesionalų dizainą, išlaikydama visą funkcionulumą ir duomenų bazės struktūrą. Likusios fazės (MDX integracijos, performance optimizacijos) gali būti implementuotos ateityje.