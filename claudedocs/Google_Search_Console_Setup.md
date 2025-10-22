# Google Search Console Setup Guide

**Projektas:** ponas Obuolys - AI Naujienos
**Domain:** https://www.ponasobuolys.lt
**Data:** 2025-10-01

---

## 🎯 OVERVIEW

Google Search Console (GSC) yra nemokamas Google įrankis, kuris padeda:

- Stebėti kaip Google mato jūsų svetainę
- Pateikti sitemap.xml indeksavimui
- Sekti search performance (traffic, clicks, rankings)
- Identifikuoti ir taisyti indeksavimo problemas
- Stebėti Core Web Vitals
- Gauti pranešimus apie saugumo ar indexing issues

---

## 📋 SETUP ŽINGSNIAI

### Žingsnis 1: Prisijungti prie Google Search Console

1. Eikite į: https://search.google.com/search-console/
2. Prisijunkite su Google account (rekomenduojama business/professional)
3. Pasirinkite **"Add Property"** arba **"Pridėti svetainę"**

---

### Žingsnis 2: Property Tipas

**Du pasirinkimai:**

#### **Option A: Domain Property (Rekomenduojama)** ✅

- **Domain:** `ponasobuolys.lt`
- **Privalumai:**
  - Apima visus subdomain'us (www, m, blog, etc.)
  - Apima http ir https
  - Viena property visam domain'ui
- **Trūkumai:**
  - Reikia DNS verification (žr. Žingsnis 3A)

#### **Option B: URL Prefix Property**

- **URL:** `https://www.ponasobuolys.lt`
- **Privalumai:**
  - Lengviau patvirtinti (HTML file upload arba meta tag)
  - Specifinis subdomain + protocol
- **Trūkumai:**
  - Reikia atskiros property www vs non-www
  - Neapima subdomain'ų

**Rekomendacija:** Pasirinkite **Domain Property** (ponasobuolys.lt)

---

### Žingsnis 3A: Domain Verification (DNS Method)

**Jei pasirinkote Domain Property:**

1. Google pateiks **TXT record** kodą, pvz.:

   ```
   google-site-verification=abc123xyz456...
   ```

2. **Pridėti TXT Record į DNS:**
   - Eikite į savo domain registrar (pvz., Hostinger, Cloudflare, GoDaddy)
   - Atidarykite DNS settings
   - Pridėkite naują **TXT record:**
     - **Type:** TXT
     - **Name/Host:** @ (arba root domain)
     - **Value:** `google-site-verification=abc123xyz456...`
     - **TTL:** Default (arba 3600)

3. **Palaukti DNS Propagation:**
   - DNS pakeitimai gali užtrukti 5-60 min
   - Galite patikrinti su: https://dnschecker.org/

4. **Verify Google Search Console:**
   - Grįžkite į GSC
   - Paspauskite **"Verify"**
   - Jei sėkminga, matysite ✅ "Ownership verified"

**Pastaba:** TXT record turi likti DNS visam laikui - neištrinkite!

---

### Žingsnis 3B: URL Prefix Verification (Alternative)

**Jei pasirinkote URL Prefix Property:**

**Metodas 1: HTML File Upload** (Lengviausias su Vercel)

1. Google pateiks HTML failą, pvz., `google1234567890abcdef.html`
2. Atsisiųskite failą
3. Upload į `public/` directory projekto:
   ```
   public/google1234567890abcdef.html
   ```
4. Commit ir push į GitHub
5. Vercel automatiškai deploy'ins
6. Verify GSC: https://www.ponasobuolys.lt/google1234567890abcdef.html

**Metodas 2: HTML Meta Tag**

1. Google pateiks meta tag, pvz.:
   ```html
   <meta name="google-site-verification" content="abc123..." />
   ```
2. Pridėkite į `index.html` `<head>` sekcijoje
3. Deploy
4. Verify GSC

**Metodas 3: Google Analytics**

- Jei jau naudojate Google Analytics, galite verify per GA

---

### Žingsnis 4: Submit Sitemap.xml

**Po sėkmingos verification:**

1. GSC dashboard → **"Sitemaps"** (kairėje navigacijoje)
2. **"Add a new sitemap"**
3. Įveskite: `sitemap.xml`
4. Paspauskite **"Submit"**

**Jūsų sitemap URL:**

```
https://www.ponasobuolys.lt/sitemap.xml
```

**Ką tikėtis:**

- Google pradės crawl'inti sitemap per 24-48h
- Status pasikeis į "Success" kai indexuojama
- Matysite "Discovered URLs" skaičių (turėtų būti ~66)

---

### Žingsnis 5: Pradinis Monitoringas

Po sitemap submission, stebėkite:

1. **Coverage Report** (Aprėptis)
   - Path: GSC → "Coverage"
   - Matysite: Valid, Errors, Warnings, Excluded
   - Tikslas: 66 valid indexed pages

2. **URL Inspection Tool**
   - Test individualius URL: įveskite URL ir "Test live URL"
   - Matysite ar Google gali indeksuoti

3. **Performance Report** (Veikla)
   - Atsiras po kelių dienų
   - Total clicks, impressions, average position
   - Queries (search terms)

4. **Core Web Vitals**
   - Path: GSC → "Core Web Vitals"
   - LCP (Largest Contentful Paint)
   - FID (First Input Delay)
   - CLS (Cumulative Layout Shift)

---

## 📊 KĄ STEBĖTI PO SETUP

### Pirma Savaitė:

- ✅ Coverage: 66 URLs discovered
- ✅ Coverage: Pradinis indexing (bent 50% per 7 dienas)
- ✅ No critical errors

### Pirmas Mėnuo:

- ✅ Coverage: 90%+ URLs indexed
- ✅ Performance: Impressions didėja
- ✅ Core Web Vitals: "Good" rating (>75% pages)
- ✅ Mobile Usability: No errors

### Nuolatinis Monitoringas:

- **Weekly:** Performance trends (clicks, impressions)
- **Weekly:** Coverage status (errors/warnings)
- **Monthly:** Core Web Vitals trends
- **Monthly:** Mobile usability check
- **Quarterly:** Full audit (errors, penalties, opportunities)

---

## 🚨 COMMON ISSUES & SOLUTIONS

### Issue 1: "Sitemap couldn't be read"

**Sprendimas:**

- Patikrinkite ar sitemap.xml accessible: https://www.ponasobuolys.lt/sitemap.xml
- Patikrinkite XML syntax (validator: https://www.xml-sitemaps.com/validate-xml-sitemap.html)
- Palaukite 24h ir retry

### Issue 2: "Submitted URL not found (404)"

**Sprendimas:**

- Patikrinkite ar URL egzistuoja
- Patikrinkite robots.txt (ar neblokuoja)
- URL Inspection Tool → Request indexing

### Issue 3: "Coverage: Discovered - currently not indexed"

**Sprendimas:**

- Normalu pradžioje (Google crawl'ina palaipsniui)
- URL Inspection → Request indexing priority URLs
- Palaukite 7-14 dienų

### Issue 4: "Crawled - currently not indexed"

**Sprendimas:**

- Google matė, bet nenusprendė indexuoti
- Patobulinkite content quality
- Pridėkite internal links
- Request indexing

---

## ✅ VERIFICATION CHECKLIST

**Pre-Setup:**

- [ ] Domain/URL pasirinktas
- [ ] Prisijungta su tinkamu Google account
- [ ] Turima prieiga prie DNS arba website files

**Verification:**

- [ ] Verification method pasirinktas
- [ ] TXT record/HTML file pridėtas
- [ ] Ownership verified ✅

**Sitemap Submission:**

- [ ] sitemap.xml accessible (https://www.ponasobuolys.lt/sitemap.xml)
- [ ] Sitemap submitted į GSC
- [ ] Status: "Success" arba "Pending"

**Initial Monitoring:**

- [ ] Coverage report checked (po 24-48h)
- [ ] URL Inspection tested (2-3 key URLs)
- [ ] No critical errors

**Ongoing Setup:**

- [ ] Email alerts enabled
- [ ] Users/permissions configured (jei team)
- [ ] Integrated su Google Analytics (optional)

---

## 🔗 USEFUL LINKS

**Google Search Console:**

- Main Dashboard: https://search.google.com/search-console/
- Help Center: https://support.google.com/webmasters/
- Learn SEO: https://developers.google.com/search/docs

**Verification Help:**

- Domain Verification: https://support.google.com/webmasters/answer/9008080
- URL Prefix Verification: https://support.google.com/webmasters/answer/9008080

**Sitemap Help:**

- Sitemap Guide: https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview
- Sitemap Validator: https://www.xml-sitemaps.com/validate-xml-sitemap.html

**Testing Tools:**

- Rich Results Test: https://search.google.com/test/rich-results
- Mobile-Friendly Test: https://search.google.com/test/mobile-friendly
- PageSpeed Insights: https://pagespeed.web.dev/

**DNS Checking:**

- DNS Checker: https://dnschecker.org/
- What's My DNS: https://www.whatsmydns.net/

---

## 📈 SUCCESS METRICS

**Short-term (1-2 mėnesiai):**

- 90%+ pages indexed
- 0 critical errors
- Core Web Vitals: "Good" rating
- Organic impressions: +50-100%

**Medium-term (3-6 mėnesiai):**

- Top 10 rankings: "AI naujienos Lietuvoje"
- Organic clicks: +100-200%
- Average position: <20 target keywords
- CTR: >3% organic search

**Long-term (6-12 mėnesių):**

- Top 3 rankings: "AI naujienos Lietuvoje", "ponas Obuolys"
- Organic traffic: +200-500%
- Brand search queries: +300%
- Featured snippets: 5-10 keywords

---

## 💡 PRO TIPS

1. **Priority Indexing:**
   - Po verification, naudokite URL Inspection Tool
   - Request indexing priority pages (homepage, top articles)
   - Limit: ~10 URLs per day

2. **Regular Content Updates:**
   - Google mėgsta fresh content
   - Update old articles → Request re-indexing
   - Publish consistently (2-3x/week)

3. **Fix Errors Quickly:**
   - GSC emails apie errors - reaguokite per 24-48h
   - Coverage errors mažina trust signal

4. **Use Performance Data:**
   - Identify high-impression, low-click queries
   - Optimize meta descriptions for CTR
   - Find keyword opportunities

5. **Monitor Competitors:**
   - Analyze top-ranking competitors
   - Identify content gaps
   - Target their keyword weaknesses

---

**Paskutinis update:** 2025-10-01
**Autorius:** Claude
**Status:** Ready for implementation
