# SEO Optimizacijos Planas - Ponas Obuolys

**Projektas:** ponasObuolys - AI Naujienos Lietuvoje
**Sukurta:** 2025-10-01
**Paskutinis atnaujinimas:** 2025-10-01
**Statusas:** Phase 1 - Vykdoma (Meta Tags & Structured Data: 70% baigta)

---

## 🔴 KRITINIAI SEO PAGEINIMAI (Aukščiausias prioritetas)

### 1. Meta Tags & Structured Data
**Tikslas:** Pagerinti puslapių indeksavimą ir socialinį dalijimąsi

- [x] **Dinaminiai meta title/description kiekvienam puslapiui** ✅
  - [x] Home page meta tags
  - [ ] Articles page meta tags (reikia dar list page)
  - [x] Individual article meta tags
  - [ ] Tools page meta tags (reikia dar list page)
  - [ ] Individual tool meta tags (partial - reikia SEOHead integration)
  - [ ] Courses page meta tags (reikia dar list page)
  - [ ] Individual course meta tags (partial - reikia SEOHead integration)
  - [ ] About page meta tags
  - [ ] Contact page meta tags
  - **Failai sukurti:** ✅ `src/utils/seo.ts` su SEO helper funkcijomis

- [x] **OpenGraph & Twitter Cards** ✅
  - [x] OG tags komponento sukūrimas
  - [x] Twitter Card meta tags
  - [x] OG image support (1200x630px)
  - [x] Fallback images kiekvienam content tipui
  - **Failai sukurti:** ✅ `src/components/SEO/OpenGraphTags.tsx`

- [x] **JSON-LD Structured Data** ✅
  - [x] Organization schema (ponas Obuolys brand)
  - [x] Article schema (news articles)
  - [x] Course schema (AI kursams)
  - [x] BreadcrumbList schema
  - [x] WebSite schema su search action
  - [x] Person schema (author markup)
  - **Failai sukurti:** ✅ `src/components/SEO/StructuredData.tsx`

- [x] **Canonical URLs** ✅
  - [x] Canonical link tag kiekviename puslapyje
  - [x] Duplicate content prevencija
  - **Failai:** ✅ Integruota į `src/components/SEO/MetaTags.tsx`

- [x] **Robots Meta Tags** ✅
  - [x] Index/noindex strategija
  - [x] Follow/nofollow nustatymai
  - [x] Admin puslapių noindex support
  - **Failai:** ✅ `src/utils/seo.ts` (generateRobotsContent funkcija)

---

### 2. Sitemap & Robots.txt
**Tikslas:** Palengvinti Google crawling ir indeksavimą

- [x] **XML Sitemap Generavimas** ✅
  - [x] Dinaminis sitemap.xml generavimas
  - [x] Įtraukti visus straipsnius iš DB
  - [x] Įtraukti visus įrankius
  - [x] Įtraukti visus kursus
  - [x] Priority ir changefreq nustatymai
  - [x] Lastmod datos iš DB
  - **Failai sukurti:** ✅ `src/utils/sitemapGenerator.ts`
  - **TODO:** Reikia deploy sitemap.xml į public/ arba setup serverless function

- [x] **robots.txt Failas** ✅
  - [x] Sukurti robots.txt
  - [x] Disallow admin paths
  - [x] Allow public content
  - [x] Sitemap location
  - **Failas atnaujintas:** ✅ `public/robots.txt`

- [ ] **Google Search Console** (Laukia deployment)
  - [ ] Sitemap submission
  - [ ] Domain verification
  - [ ] Index coverage monitoring
  - [ ] Search performance tracking

---

### 3. Core Web Vitals Optimizacija
**Tikslas:** Pagerinti puslapio greičio rodiklius (LCP, FID, CLS)

- [ ] **Image Optimization**
  - [ ] WebP format conversion (fallback PNG/JPG)
  - [ ] Responsive image sizes (`srcset`, `sizes`)
  - [ ] Priority loading hero images (fetchpriority="high")
  - [ ] Lazy loading below-fold images
  - [ ] Image compression (TinyPNG/ImageOptim)
  - [ ] Next-gen formats (AVIF jei įmanoma)
  - Failai: Atnaujinti `src/components/ui/lazy-image.tsx`

- [ ] **Code Splitting Optimizacija**
  - [ ] Route-based code splitting audit
  - [ ] Component-level lazy loading review
  - [ ] Third-party library chunking
  - [ ] Dynamic imports optimization
  - Failai: `vite.config.ts`, komponentų lazy imports

- [ ] **CSS/JS Minifikacija & Compression**
  - [ ] Vite build optimizacija
  - [ ] Gzip/Brotli compression (Vercel)
  - [ ] Unused CSS removal (PurgeCSS)
  - [ ] Critical CSS extraction
  - Failai: `vite.config.ts`

- [ ] **Font Optimization**
  - [ ] Font preload strategija
  - [ ] font-display: swap
  - [ ] Subsetting (tik reikalingi characters)
  - [ ] Self-hosting fonts
  - Failai: `index.html`, CSS font-face

- [ ] **Remove Unused CSS/JS**
  - [ ] Bundle analyzer naudojimas
  - [ ] Tree-shaking audit
  - [ ] Unused dependencies šalinimas
  - [ ] Code coverage analysis
  - Komandos: `npm run build -- --analyze`

---

## 🟡 SVARBŪS SEO PAGEINIMAI

### 4. Content SEO
**Tikslas:** Semantic HTML ir content struktūra SEO draugiškai

- [ ] **Semantic HTML5 Struktūra**
  - [ ] `<header>` elemento naudojimas
  - [ ] `<nav>` navigacijai
  - [ ] `<main>` pagrindiniam content
  - [ ] `<article>` straipsniams
  - [ ] `<aside>` šoniniam content
  - [ ] `<footer>` footer elementui
  - [ ] `<section>` logical sections
  - Failai: `src/components/layout/Layout.tsx`, page components

- [ ] **Heading Hierarchy**
  - [ ] H1 tik vienas per puslapį
  - [ ] H2-H6 tvarkinga struktūra
  - [ ] Heading audit visame projekte
  - [ ] Keywords į headings
  - Failai: Visi page komponentai

- [ ] **Alt Text Visiems Paveikslėliams**
  - [ ] Alt text audit
  - [ ] Descriptive alt texts
  - [ ] Keywords į alt texts (natūraliai)
  - [ ] Empty alt="" decorative images
  - Failai: LazyImage komponentas, content

- [ ] **Internal Linking Strategija**
  - [ ] Related articles komponentas
  - [ ] Footer navigation optimizacija
  - [ ] Breadcrumbs implementacija
  - [ ] Link depth reduction
  - Failai: Naujas komponentas `src/components/RelatedContent.tsx`

- [ ] **Rich Snippets**
  - [ ] FAQ schema (jei reikia)
  - [ ] HowTo schema kursams
  - [ ] Rating schema (jei bus reviews)
  - [ ] Event schema (jei bus events)
  - Failai: `src/components/SEO/StructuredData.tsx`

---

### 5. Performance Optimization
**Tikslas:** Puslapio greitis ir UX pagerinimas

- [ ] **Lazy Loading Pagerinimas**
  - [ ] Intersection Observer optimizacija
  - [ ] Loading skeleton states
  - [ ] Progressive image loading (blur-up)
  - [ ] Component lazy loading audit
  - Failai: `src/components/ui/lazy-image.tsx`

- [ ] **Prefetch/Preload Strategija**
  - [ ] Critical resources preload
  - [ ] Route prefetching (hover intent)
  - [ ] DNS prefetch third-party
  - [ ] Preconnect strategija
  - Failai: `index.html`, routing

- [ ] **Service Worker (PWA)**
  - [ ] Service Worker setup
  - [ ] Offline functionality
  - [ ] Cache-first strategija
  - [ ] Background sync
  - [ ] Web App Manifest
  - Failai: `src/sw.ts`, `public/manifest.json`

- [ ] **Caching Strategija**
  - [ ] HTTP cache headers (Vercel)
  - [ ] Browser caching optimization
  - [ ] API response caching
  - [ ] Static asset versioning
  - Failai: `vercel.json`, Supabase cache config

- [ ] **CDN Setup**
  - [x] Vercel CDN (jau naudojamas)
  - [ ] Supabase Storage CDN
  - [ ] Image CDN optimization
  - Status: Vercel CDN aktyvus

---

### 6. Mobile & Accessibility
**Tikslas:** Mobile-first ir prieinamumas

- [ ] **Mobile-First Responsive Design Audit**
  - [ ] Viewport breakpoints review
  - [ ] Touch-friendly UI elements
  - [ ] Mobile navigation optimization
  - [ ] Text readability mobile
  - Failai: Tailwind config, komponentai

- [ ] **Touch Target Sizes**
  - [ ] Minimum 48x48px buttons/links
  - [ ] Spacing tarp clickable elementų
  - [ ] Mobile menu optimization
  - Failai: UI komponentai

- [ ] **Accessibility Audit**
  - [ ] ARIA labels visuose interactive elements
  - [ ] Keyboard navigation testing
  - [ ] Focus states visibility
  - [ ] Screen reader compatibility
  - [ ] Color contrast ratios (WCAG AA)
  - [ ] Skip to content link
  - Įrankiai: axe DevTools, Lighthouse

- [ ] **Viewport Configuration**
  - [ ] Meta viewport tag
  - [ ] Responsive images
  - [ ] Flexible layouts
  - Failas: `index.html`

---

## 🟢 PAPILDOMI PAGEINIMAI

### 7. Technical SEO
**Tikslas:** Technical best practices

- [ ] **404 Puslapio Optimizacija**
  - [ ] Custom 404 page
  - [ ] Navigation 404 page
  - [ ] Search functionality
  - [ ] Related content suggestions
  - Failas: `src/pages/NotFound.tsx`

- [ ] **Redirect Management**
  - [ ] 301 permanent redirects
  - [ ] 302 temporary redirects
  - [ ] Redirect chains audit
  - Failas: `vercel.json` redirects

- [ ] **URL Structure Optimization**
  - [ ] Clean URLs (no query params)
  - [ ] Keyword-rich URLs
  - [ ] Lowercase URLs
  - [ ] Hyphens vs underscores
  - Failai: Routing config

- [ ] **Hreflang Tags**
  - [ ] Multi-language support (ateityje)
  - [ ] Language alternates
  - Status: N/A dabar (tik LT)

- [ ] **Security Headers**
  - [ ] Content-Security-Policy
  - [ ] X-Frame-Options
  - [ ] X-Content-Type-Options
  - [ ] Strict-Transport-Security (HSTS)
  - [ ] Referrer-Policy
  - Failas: `vercel.json` headers

---

### 8. Analytics & Monitoring
**Tikslas:** SEO performance tracking

- [ ] **Google Search Console Integration**
  - [ ] Domain verification
  - [ ] Sitemap submission
  - [ ] Coverage monitoring
  - [ ] Performance tracking
  - [ ] Mobile usability
  - [ ] Core Web Vitals

- [ ] **Performance Monitoring Setup**
  - [ ] Lighthouse CI integration
  - [ ] Real User Monitoring (RUM)
  - [ ] Web Vitals tracking
  - [ ] Speed monitoring alerts
  - Įrankiai: web-vitals library

- [ ] **Error Tracking**
  - [ ] Sentry setup (optional)
  - [ ] 404 tracking
  - [ ] JavaScript errors
  - [ ] API errors
  - Failas: `src/utils/errorTracking.ts`

- [ ] **SEO Metrics Dashboard**
  - [ ] Rankings tracking
  - [ ] Traffic monitoring
  - [ ] Conversion tracking
  - [ ] Keyword positions
  - Įrankiai: Google Analytics 4, Search Console

---

### 9. Content Strategy
**Tikslas:** Content marketing SEO

- [ ] **Blog Posting Frequency**
  - [ ] 2-3 straipsniai per savaitę (minimum)
  - [ ] Consistent publishing schedule
  - [ ] Content calendar
  - Dokumentas: Content planning spreadsheet

- [ ] **Keyword Research Integration**
  - [ ] Lithuanian AI keywords
  - [ ] Long-tail keywords
  - [ ] Competitor analysis
  - [ ] Search intent mapping
  - Įrankiai: Google Keyword Planner, Ahrefs/SEMrush

- [ ] **Content Freshness Strategy**
  - [ ] Update old articles
  - [ ] Add "Last Updated" dates
  - [ ] Refresh outdated info
  - [ ] Republish best content
  - Failai: Article update workflow

- [ ] **Comment System**
  - [ ] Disqus integration (arba custom)
  - [ ] User engagement
  - [ ] Social proof
  - [ ] User-generated content
  - Failas: `src/components/Comments.tsx`

---

## 📊 SPECIFIŠKI PAGEINIMAI "PONAS OBUOLYS" BRAND'UI

### 10. Brand Optimization
**Tikslas:** "Ponas Obuolys" brand stiprinimas

- [ ] **"Ponas Obuolys" Keyword Optimization**
  - [ ] Brand mentions content'e
  - [ ] Meta tags su brand name
  - [ ] Alt texts su brand
  - [ ] Schema markup su brand
  - Target: "Ponas Obuolys AI", "Ponas Obuolys naujienos"

- [ ] **AI Naujienos Lietuvoje - Targeted Content**
  - [ ] "AI naujienos Lietuvoje" landing page
  - [ ] Lithuanian AI industry focus
  - [ ] Local AI events coverage
  - [ ] Lithuanian AI startups
  - Target keywords: "AI naujienos Lietuvoje", "dirbtinis intelektas Lietuva"

- [ ] **Local SEO (Lithuania Focused)**
  - [ ] LocalBusiness schema
  - [ ] Lithuanian language emphasis
  - [ ] .lt domain benefits
  - [ ] Local citations
  - [ ] Google My Business (jei reikia)

- [ ] **Author Schema Markup**
  - [ ] Person schema "Ponas Obuolys"
  - [ ] Author bio pages
  - [ ] Social profile links
  - [ ] Author authority building
  - Failas: `src/components/SEO/AuthorSchema.tsx`

- [ ] **Social Proof Integration**
  - [ ] Testimonials section
  - [ ] Social media follower count
  - [ ] Article share counts
  - [ ] Trust badges
  - Failas: `src/components/SocialProof.tsx`

---

## 📋 IMPLEMENTAVIMO TVARKA

### Phase 1: Greitas Efektas (1-2 savaitės)
**Prioritetas: 🔴 Kritiniai**

1. ✅ Meta tags & Structured Data (#1)
2. ✅ Sitemap & robots.txt (#2)
3. ✅ Image optimization (#3 - dalis)
4. ✅ Semantic HTML (#4 - dalis)

**Expected Impact:** +20-30% organic traffic per 2-3 mėnesius

---

### Phase 2: Vidutinis Efektas (2-4 savaitės)
**Prioritetas: 🟡 Svarbūs**

5. ✅ Performance optimization (#5)
6. ✅ Mobile & Accessibility (#6)
7. ✅ Google Search Console (#8 - dalis)
8. ✅ Brand optimization (#10 - dalis)

**Expected Impact:** +15-25% organic traffic, geresnė engagement

---

### Phase 3: Ilgalaikis (1-3 mėnesiai)
**Prioritetas: 🟢 Papildomi**

9. ✅ Technical SEO (#7)
10. ✅ Content strategy (#9)
11. ✅ Analytics & monitoring (#8 - full)
12. ✅ PWA implementation (#5 - dalis)

**Expected Impact:** Stabilus organic traffic augimas, brand authority

---

## 📊 SUCCESS METRICS

### KPIs Tracking
- **Organic Traffic:** +50% per 6 mėnesius
- **Keyword Rankings:** Top 3 "AI naujienos Lietuvoje"
- **Page Speed:** <2s LCP, >90 Lighthouse score
- **Impressions:** +100% Google Search Console
- **CTR:** >3% organic search results
- **Bounce Rate:** <40%

### Tools
- Google Search Console
- Google Analytics 4
- Lighthouse CI
- PageSpeed Insights
- Ahrefs/SEMrush (optional)

---

## 🔄 ATNAUJINIMŲ LOG

| Data | Atlikta | Autorius | Pastabos |
|------|---------|----------|----------|
| 2025-10-01 | Sukurtas SEO planas | Claude | Pradinis dokumentas |
| 2025-10-01 | **Phase 1 pradėta - 70% baigta** | Claude | Meta Tags & Structured Data implementation |

### Detali Progress Summary (2025-10-01)

#### ✅ COMPLETED (Phase 1 - 70%)

**Infrastructure sukurta:**
- ✅ `src/utils/seo.ts` - SEO utility funkcijos (400+ lines)
  - Dynamic meta tag generation
  - Structured data generators (Article, Course, Organization, WebSite, Person, Breadcrumb)
  - URL & image helpers
  - Keywords & robots meta generation
- ✅ `src/components/SEO/` directory su 5 komponentais:
  - `MetaTags.tsx` - Basic meta tags (title, description, canonical, robots)
  - `OpenGraphTags.tsx` - OG & Twitter Card tags
  - `StructuredData.tsx` - JSON-LD wrapper
  - `SEOHead.tsx` - Main wrapper komponentas
  - `index.ts` - Exports

**Pages Integration:**
- ✅ Home Page (`src/pages/Index.tsx`)
  - Organization & WebSite structured data
  - Dynamic meta tags
  - OpenGraph & Twitter Cards
- ✅ PublicationDetail (`src/pages/PublicationDetail.tsx`)
  - Article structured data
  - Breadcrumb navigation schema
  - Dynamic article meta tags
  - Social sharing optimization

**SEO Configuration:**
- ✅ `public/robots.txt` - Updated with proper rules
  - Disallow admin & auth paths
  - Allow all public content
  - Sitemap reference
- ✅ `src/utils/sitemapGenerator.ts` - Dynamic sitemap generator
  - Auto-fetches articles, tools, courses from Supabase
  - Priority & changefreq settings
  - Lastmod dates from DB

**Testing:**
- ✅ TypeScript compilation passed (`npm run type-check`)
- ✅ No breaking changes

#### 🔄 IN PROGRESS

**Remaining Pages needing SEO integration:**
- ⏳ ToolDetailPage - has old Helmet, needs SEOHead migration
- ⏳ CourseDetail - has old Helmet, needs SEOHead migration
- ⏳ PublicationsPage (list view) - needs meta tags
- ⏳ ToolsPage (list view) - needs meta tags
- ⏳ CoursesPage (list view) - needs meta tags
- ⏳ ContactPage - needs meta tags
- ⏳ SupportPage - needs meta tags

#### 📋 NEXT STEPS (Phase 1 completion)

1. **Complete remaining page integrations** (2-3 hours)
   - Migrate ToolDetailPage & CourseDetail to SEOHead
   - Add SEO to all list pages
   - Add SEO to Contact & Support pages

2. **Sitemap Deployment** (1 hour)
   - Option A: Generate static sitemap.xml to public/
   - Option B: Create Vercel serverless function for dynamic sitemap
   - Test sitemap.xml accessibility

3. **Google Search Console Setup** (1 hour)
   - Domain verification
   - Submit sitemap
   - Monitor indexing

4. **Phase 2 preparation** (planning)
   - Image optimization strategy
   - Performance audit with Lighthouse
   - Semantic HTML review

---

## 📝 NOTES

- **Prioritetas:** Pradėti nuo Phase 1 - greičiausias ROI
- **Timeline:** Phase 1 būtina iki 2025-10-15
- **Resources:** 1 developer, part-time SEO consultant (optional)
- **Budget:** Minimal (tools already available)

---

**Paskutinis update:** 2025-10-01
**Next Review:** Po Phase 1 completion
**Document Owner:** Development Team
