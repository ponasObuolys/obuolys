# Google Indexing Issues - Fix Plan

## 🔍 Problemos Google Search Console

### 1. **"Page with redirect"** (13 URLs)
URLs su redirects, kurie neindeksuojami:
- `http://ponasobuolys.lt/` → HTTPS redirect
- `https://ponasobuolys.lt/mokymai/` → Turi redirect į `/kursai`
- `https://ponasobuolys.lt/tag/...` → Senieji tag URL

### 2. **"Crawled - currently not indexed"** (9 URLs)
URLs, kuriuos Google rado, bet neindeksuoja:
- `https://www.ponasobuolys.lt/...` → WWW versions
- `/collections/kursai` → Senieji URL
- `/tag/...` → Senieji tag pages

### 3. **WWW vs Non-WWW Problema** 🔴 CRITICAL
**Sitemap.xml** naudoja: `https://www.ponasobuolys.lt`
**Google GSC** rodo: `https://ponasobuolys.lt`
**Rezultatas**: Duplicate content, split authority

---

## ❓ KLAUSIMAS: Jūsų canonical domain?

**Pasirinkite vieną** (labai svarbu):

### Option A: NON-WWW (rekomenduojama) ✅
```
Canonical: https://ponasobuolys.lt
Redirects: https://www.ponasobuolys.lt → https://ponasobuolys.lt
```

**Pros**:
- Trumpesnis URL
- Modernesnė praktika
- Sutampa su dabartiniais GSC URLs
- Greičiau sprendžiamas

**Cons**:
- Reikia atnaujinti sitemap.xml (lengva)

### Option B: WITH WWW
```
Canonical: https://www.ponasobuolys.lt
Redirects: https://ponasobuolys.lt → https://www.ponasobuolys.lt
```

**Pros**:
- Sutampa su dabartiniu sitemap.xml
- Traditional approach

**Cons**:
- Ilgesnis URL
- Reikia Vercel redirect config
- Sudėtingiau implementuoti

---

## ✅ Jau atlikti pakeitimai

### 1. **301 Redirects** (vercel.json)
```json
"/mokymai/:path*" → "/kursai/:path*"
"/collections/kursai" → "/kursai"
"/tag/:tag" → "/publikacijos"
```
**Rezultatas**: Senieji URLs redirect į naujus

### 2. **CLS Optimizacijos** (atlikta anksčiau)
- Font preload
- LazyImage dimensions
- Skeleton loaders
- CSS containment

---

## 🚀 Likę veiksmai (reikia jūsų patvirtinimo)

### Jei pasirinksite **NON-WWW** (OPTION A):

#### 1. Update sitemap.xml
```bash
# Replace all:
https://www.ponasobuolys.lt → https://ponasobuolys.lt
```

#### 2. Update robots.txt
```
Sitemap: https://ponasobuolys.lt/sitemap.xml
```

#### 3. Add canonical meta tags
Kiekviename puslapyje:
```html
<link rel="canonical" href="https://ponasobuolys.lt/current-page" />
```

#### 4. Vercel domain settings
Vercel Dashboard → Settings → Domains:
- Primary: `ponasobuolys.lt`
- Redirect: `www.ponasobuolys.lt` → `ponasobuolys.lt`

### Jei pasirinksite **WWW** (OPTION B):

#### 1. Keep sitemap.xml (as is)
Current sitemap jau naudoja WWW

#### 2. Add Vercel redirect
```json
{
  "source": "https://ponasobuolys.lt/:path*",
  "destination": "https://www.ponasobuolys.lt/:path*",
  "permanent": true
}
```

#### 3. Add canonical meta tags
```html
<link rel="canonical" href="https://www.ponasobuolys.lt/current-page" />
```

#### 4. Vercel domain settings
- Primary: `www.ponasobuolys.lt`
- Redirect: `ponasobuolys.lt` → `www.ponasobuolys.lt`

---

## 📋 Testavimo checklist (po fix)

- [ ] Check `https://ponasobuolys.lt` → redirects to canonical
- [ ] Check `https://www.ponasobuolys.lt` → redirects to canonical
- [ ] Check `http://ponasobuolys.lt` → redirects to HTTPS canonical
- [ ] Check `/mokymai/` → redirects to `/kursai`
- [ ] Check `/tag/something` → redirects to `/publikacijos`
- [ ] Check `/collections/kursai` → redirects to `/kursai`
- [ ] Sitemap.xml uses ONLY canonical URLs
- [ ] Robots.txt sitemap URL is canonical
- [ ] All pages have `<link rel="canonical">` tags

---

## 🎯 Expected results (po deployment)

### Google Search Console (1-2 savaitės)
- ✅ "Page with redirect": 0 (visi redirected properly)
- ✅ "Crawled - not indexed": 0 (canonical URLs indexed)
- ✅ CLS < 0.1 (Core Web Vitals improved)
- ✅ Visi svarbus content indexable

### Immediate benefits
- No duplicate content
- Clear canonical URLs
- All old URLs redirect to new structure
- Better SEO authority concentration

---

## ⚡ Action Required

**PLEASE CONFIRM**:

1. **Kurį domain nori naudoti?**
   - [ ] OPTION A: `https://ponasobuolys.lt` (non-WWW) ← REKOMENDACIJA
   - [ ] OPTION B: `https://www.ponasobuolys.lt` (with WWW)

2. **Ar turiu prieigą prie Vercel Dashboard?**
   - [ ] Taip - galiu configure domain redirects
   - [ ] Ne - man reikia instrukcijų

3. **Ar yra dar kitų senų URL struktūrų?**
   - [ ] Tik tie, kuriuos minėjai GSC
   - [ ] Yra daugiau (pasidalink)

---

## 🔄 Next steps (po jūsų patvirtinimo)

1. Update sitemap.xml su canonical URLs
2. Update robots.txt
3. Add canonical meta tags to all pages
4. Configure Vercel domain redirects
5. Test all redirects
6. Submit updated sitemap to Google Search Console
7. Request re-indexing for problem URLs

---

**Atsakyk į 3 klausimus viršuje, ir aš tęsiu su fixes! 🚀**
