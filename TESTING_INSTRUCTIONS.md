# CLS Optimizacijos testavimo instrukcijos

## ✅ Atlikti pakeitimai

### 1. **Font Loading Optimizacija**
- Pridėtas `font-display: swap` Google Fonts
- Preload critical fonts (Inter 400, 600)
- **Rezultatas**: Išvengta FOIT (Flash of Invisible Text)

### 2. **LazyImage su dimensions**
- Visi LazyImage naudojimai atnaujinti su `aspectRatio` arba `width/height`
- Hero paveiksliukas (logo) su `priority={true}` - LCP optimizacija
- **Rezultatas**: Paveiksliukai rezervuoja vietą prieš įkėlimą

### 3. **Skeleton Loaders**
- PublicationsPage naudoja `ListSkeleton`
- ToolsPage ir CoursesPage jau turėjo skeleton loaders
- **Rezultatas**: Loading states rezervuoja vietą, neleidžia content "šokinėti"

### 4. **CSS Containment**
- `.animate-glow` ir `.project-card` turi `contain: layout`
- **Rezultatas**: Animacijos nebegali sukelti layout shifts

### 5. **Min-Height konteinerių**
- `body` ir `#root` turi `min-height: 100vh/100dvh`
- **Rezultatas**: Išvengta empty state "šokinėjimo"

---

## 🧪 Kaip testuoti dabar

### Dev Server
```
http://localhost:8084
```

### 1. **Manual Visual Test** (5 min)

#### A. Atidaryti puslapį
1. Navigate to http://localhost:8084
2. **Atkreipti dėmesį** ar matot "šokinėjimą" content'o kraunantis

#### B. Patikrinti key pages:
```
http://localhost:8084/                 - Hero image (priority)
http://localhost:8084/publikacijos      - Articles with skeletons
http://localhost:8084/irankiai          - Tools with skeletons
http://localhost:8084/kursai            - Courses with skeletons
```

#### C. Ko ieškoti:
- ✅ **GERAI**: Turinys kraunasi sklandžiai, be "šokinėjimo"
- ✅ **GERAI**: Skeleton loaders atitinka galutinį content dydį
- ❌ **BLOGAI**: Matomas layout shift (elementai juda)
- ❌ **BLOGAI**: Tekstas "mirksi" fontams kraunantis

### 2. **Lighthouse Test** (5 min)

#### Chrome DevTools
1. Atidaryti http://localhost:8084
2. F12 → Lighthouse tab
3. Pasirinkti:
   - ✅ Performance
   - ✅ Best Practices
   - Device: **Mobile** (CLS worse on mobile!)
4. Click "Analyze page load"

#### Tikėtini rezultatai:
- **CLS**: < 0.1 ✅ (Prieš: 0.64 ❌)
- **LCP**: < 2.5s ✅
- **TBT**: < 200ms ⚠️

#### Jei CLS > 0.1:
1. Scroll down Lighthouse report
2. "Diagnostics" → "Avoid large layout shifts"
3. Click "View Trace" → Performance panel
4. Experience section → Layout Shifts
5. Pranešti man, kuris elementas sukelia problemą

### 3. **Performance Recording** (optional, jei matai problemas)

1. Chrome DevTools (F12)
2. Performance tab
3. Click Record (⚫)
4. Reload page (Ctrl+R)
5. Stop recording
6. Experience section → "Layout Shift" events (turėtų būti 0 arba artimi 0)

---

## 📊 Ką tikėtis

### Prieš optimizaciją
- CLS: 0.64 (Very Poor)
- Google neindeksuoja 17 URLs
- Paveiksliukai "šokinėja" kraunantis
- Tekstas "mirksi" fontams kraunantis

### Po optimizacijos (tikėtina)
- CLS: < 0.1 (Good)
- Visi URLs indexable
- Sklandus content loading
- Skeleton loaders rezervuoja vietą

---

## ⚠️ Jei kažkas neveikia

### TypeScript klaidos?
```bash
npm run type-check
```
Turėtų būti 0 klaidų.

### Dev server nekraunasi?
```bash
# Stop ir restart
Ctrl+C
npm run dev
```

### Matai CLS > 0.1?
1. Screenshot to ką matai
2. Lighthouse report screenshot
3. Pranešk man, kuriame puslapyje

### Matai layout shifts vizualiai?
1. Kuriame puslapyje?
2. Kuris elementas juda?
3. Mobile ar Desktop?

---

## 🚀 Sekantys žingsniai (po testavimo)

### Jei testas sėkmingas (CLS < 0.1):
1. ✅ **Commit pakeitimai**
   ```bash
   git add .
   git commit -m "fix: CLS optimization - skeleton loaders, image dimensions, font preload"
   ```

2. ✅ **Deploy to Vercel**
   ```bash
   git push origin main
   ```

3. ✅ **Monitor production**
   - Google Search Console (1-2 savaitės)
   - PageSpeed Insights
   - Vercel Analytics → Web Vitals

### Jei testas failed (CLS > 0.1):
1. ❌ **Pranešk man**:
   - Lighthouse screenshot
   - Kuris puslapis
   - Kokia CLS metrika
   - Ką matai vizualiai

2. ❌ **Aš debug'insiu**:
   - Performance recording analysis
   - Nustatysiu, kuris elementas problemiškas
   - Papildomi patches

---

## 📋 Testing Checklist

Prieš deploy, patikrink:

- [ ] Dev server veikia (http://localhost:8084)
- [ ] Homepage Hero image kraunasi be shift (priority image)
- [ ] /publikacijos rodo skeleton loaders loading state
- [ ] /irankiai rodo skeleton loaders
- [ ] /kursai rodo skeleton loaders
- [ ] Lighthouse CLS < 0.1 (Mobile)
- [ ] Lighthouse CLS < 0.05 (Desktop)
- [ ] Nėra TypeScript klaidų
- [ ] Nėra vizualių layout shifts kraunant puslapį

---

## ❓ Klausimai?

**Kaip patikrinti, ar priority image veikia?**
- Network tab → Throttling: "Slow 3G"
- Hero logo turėtų krautis pirmas
- Nematai empty state

**Kaip matyt, kad skeleton loaders veikia?**
- Network tab → Throttling: "Slow 3G"
- /publikacijos puslapyje matai pilkus "blokuose" vietoj tuščios vietos
- Skeleton dydis match'ina article cards

**Ar reikia testuoti visus puslapius?**
- **Must test**: Homepage, /publikacijos, /irankiai, /kursai
- **Optional**: Individual article/tool/course pages

---

## 🎯 Success Criteria

**Minimal (privaloma deploy'inti)**:
- ✅ CLS < 0.25 (Mobile)
- ✅ No visual layout shifts pastebimi

**Target (idealus rezultatas)**:
- ✅ CLS < 0.1 (Mobile)
- ✅ CLS < 0.05 (Desktop)
- ✅ LCP < 2.5s
- ✅ All Lighthouse Performance > 90

**Excellent (bonus)**:
- ✅ CLS < 0.05 (Mobile)
- ✅ All Core Web Vitals "Good"
- ✅ Google reindexes URLs within 1 week

---

Pradėk testavimą su **Lighthouse Mobile** test ant homepage! 🚀
