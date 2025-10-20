# 📊 Analytics Feature - Setup Complete!

## ✅ Kas buvo padaryta

### 1. Duomenų Bazė (Supabase)
- ✅ Sukurta `page_views` lentelė puslapių peržiūroms sekti
- ✅ Sukurta `site_statistics` lentelė metų statistikai
- ✅ Sukurta `increment_site_stats()` trigger funkcija automatiniam statistikos atnaujinimui
- ✅ Sukurta `get_current_year_stats()` RPC funkcija statistikos gavimui
- ✅ Sukonfigūruoti indeksai greitam duomenų gavimui
- ✅ Sukonfigūruotos RLS (Row Level Security) policies
- ✅ Migracija sėkmingai paleista per Supabase MCP

### 2. TypeScript Tipai
- ✅ Atnaujinti Supabase tipai su naujomis lentelėmis ir funkcijomis
- ✅ Pridėti `page_views` ir `site_statistics` tipai
- ✅ Pridėtas `get_current_year_stats` funkcijos tipas

### 3. Frontend Komponentai
- ✅ **Service Layer**: `src/services/analytics.service.ts`
  - `trackPageView()` - Įrašo puslapio peržiūrą
  - `getCurrentYearStats()` - Gauna metų statistiką
  - `getArticleViewCount()` - Gauna straipsnio peržiūrų skaičių

- ✅ **Hooks**: `src/hooks/use-live-readers.ts`
  - Naudoja Supabase Realtime Presence API
  - Automatiškai seka realaus laiko skaitytojus

- ✅ **UI Components**:
  - `src/components/analytics/reader-stats.tsx` - Statistika detalaus puslapio
  - `src/components/ui/article-card.tsx` - Peržiūrų skaičius ant kortelių
  - `src/components/publications/related-articles.tsx` - Peržiūros susijusiose publikacijose

- ✅ **Hooks**:
  - `src/hooks/use-article-views.ts` - Hook peržiūrų skaičiui gauti

### 4. Integracija
- ✅ Integruota į `PublicationDetail.tsx` puslapį
- ✅ Integruota į `ArticleCard` komponentą
- ✅ Integruota į `RelatedArticles` komponentą
- ✅ Automatinis page view tracking kai publikacija užkraunama
- ✅ Kompaktiškas statistikos rodymas po metadata sekcijos
- ✅ Peržiūrų skaičius ant publikacijų kortelių
- ✅ Peržiūrų skaičius ant susijusių publikacijų

### 5. GDPR/BDAR Compliance
- ✅ `src/components/gdpr/cookie-consent.tsx` - Cookie consent banner
- ✅ Atitinka GDPR/BDAR reikalavimus
- ✅ Vartotojas gali pasirinkti tik būtinus arba visus slapukus

### 6. Integracija
- ✅ Integruota į `PublicationDetail.tsx` puslapį
- ✅ Integruota į `ArticleCard` komponentą
- ✅ Integruota į `RelatedArticles` komponentą
- ✅ Integruota į `App.tsx` (Cookie Consent)
- ✅ Automatinis page view tracking kai publikacija užkraunama
- ✅ Kompaktiškas statistikos rodymas po metadata sekcijos
- ✅ Peržiūrų skaičius ant publikacijų kortelių
- ✅ Peržiūrų skaičius ant susijusių publikacijų
- ✅ GDPR/BDAR atitiktis su consent banner

## 🚀 Kaip Testuoti

### 1. Paleisti Development Serverį

```bash
npm run dev
```

### 2. Atidaryti Publikacijas

#### A) Publikacijų sąrašas:
```
http://localhost:5173/publikacijos
```

Ant kiekvienos publikacijos kortelės turėtumėte matyti:
- 📅 Data
- ⏱️ Skaitymo laikas
- 👁️ Peržiūrų skaičius (mėlyna spalva)

#### B) Detalus publikacijos puslapis:
```
http://localhost:5173/publikacijos/[slug]
```

### 3. Ką Turėtumėte Matyti

**Ant kortelių** (sąraše):
```
📅 2025-01-20  |  ⏱️ 5 min skaitymo  |  👁️ 43
```

**Detalaus puslapio** metadata sekcijoje:

```
👁️ X skaito dabar  |  📈 Y peržiūrų
```

Kur:
- **X** - realiu laiku skaitančių tą pačią publikaciją skaičius (padaugintas 2x-4x)
- **Y** - bendras šios publikacijos peržiūrų skaičius (padaugintas 2x-4x)

**Pastaba**: 
- Daugiklis yra nuoseklus - ta pati publikacija visada turi tą patį daugiklį (2-4x)
- **Jei tik 1 žmogus skaito** - rodoma **1 skaito dabar** (be daugiklio)
- **Jei 2+ žmonės skaito** - taikomas daugiklis (pvz. 2 → 6-7 skaitytojų)
- **Peržiūros** visada padaugintos (pvz. 13 → 43 peržiūros)

### 4. Testuoti Live Readers

1. Atidaryti tą pačią publikaciją **keliuose skirtinguose naršyklės languose**
2. Skaičius "skaito dabar" turėtų padidėti
3. Uždarius langą, skaičius turėtų sumažėti po kelių sekundžių

### 5. Patikrinti Duomenų Bazėje

#### Per Supabase Dashboard:
```sql
-- Patikrinti page views
SELECT * FROM page_views ORDER BY viewed_at DESC LIMIT 10;

-- Patikrinti statistiką
SELECT * FROM site_statistics;

-- Patikrinti RPC funkciją
SELECT * FROM get_current_year_stats();
```

#### Per MCP (Windsurf):
```typescript
// Galite naudoti Supabase MCP tools:
mcp3_execute_sql({
  project_id: "jzixoslapmlqafrlbvpk",
  query: "SELECT * FROM page_views ORDER BY viewed_at DESC LIMIT 10"
})
```

## ✅ Pataisymai

### RLS Policy Fix (2025-10-20)
**Problema**: `401 Unauthorized` klaida bandant įrašyti page views.

**Sprendimas**: Pridėtas `SECURITY DEFINER` prie trigger ir RPC funkcijų, kad jos galėtų veikti nepaisant RLS policies:
- `increment_site_stats()` - trigger funkcija
- `get_current_year_stats()` - RPC funkcija

Funkcijos dabar veikia su elevated privileges ir gali įrašyti/skaityti `site_statistics` lentelę.

### Deduplikacija (2025-10-20)
**Problema**: Kiekvieną kartą perkraunant puslapį, peržiūrų skaičius didėjo +1, +2, +3, +4 (dėl daugiklio).

**Sprendimas**: Pridėta 30 minučių deduplikacijos logika:
- Naudojamas `localStorage` saugoti neseniai skaitytų publikacijų sąrašą
- Jei publikacija skaityta per pastaruosius 30 min - tracking praleistas
- Po 30 min - skaičiuojama kaip nauja peržiūra
- Automatinis senų įrašų valymas

**Rezultatas**: Refresh'inant puslapį peržiūrų skaičius nedidėja!

## 🔧 Troubleshooting

### Nematau statistikos

1. **Patikrinti browser console**:
   - Ar nėra JavaScript klaidų?
   - Ar Supabase prisijungimas veikia?

2. **Patikrinti Supabase Dashboard**:
   - Ar lentelės sukurtos?
   - Ar RLS policies teisingos?
   - Ar Realtime įjungtas?

3. **Patikrinti Network tab**:
   - Ar vyksta WebSocket connection?
   - Ar API calls sėkmingi?

### Live Readers nerodo skaičiaus

1. **Įjungti Realtime Supabase Dashboard**:
   - Database → Replication
   - Įsitikinti kad Realtime enabled

2. **Patikrinti WebSocket connection**:
   - Browser DevTools → Network → WS
   - Turėtų būti WebSocket connection prie Supabase

### TypeScript klaidos

Jei vis dar matote TypeScript klaidas:

```bash
# Perkrauti TypeScript serverį VS Code
# Ctrl+Shift+P → "TypeScript: Restart TS Server"

# Arba regeneruoti tipus rankiniu būdu
npx supabase gen types typescript --project-id jzixoslapmlqafrlbvpk > src/integrations/supabase/types.ts
```

## 📊 Kaip Veikia

### Page View Tracking (su Deduplikacija)

1. Vartotojas atidaro publikaciją
2. `PublicationDetail` komponentas kviečia `analyticsService.trackPageView(articleId)`
3. **Patikrinama** ar vartotojas neseniai (per 30 min) skaitė šią publikaciją
4. Jei **taip** - tracking praleistas (deduplikacija)
5. Jei **ne**:
   - Sukuriamas unikalus `session_id` (jei dar nėra)
   - Įrašas įrašomas į `page_views` lentelę
   - Trigger `increment_site_stats()` automatiškai atnaujina `site_statistics`
   - Publikacija pažymima kaip "neseniai skaityta" `localStorage`

### Live Readers

1. Komponentas mount'inasi ir kviečia `useLiveReaders` hook
2. Hook prisijungia prie Supabase Realtime kanalo `article:{articleId}`
3. Vartotojo presence įrašomas į kanalą
4. Kai kiti vartotojai prisijungia/atsijungia, `count` atsinaujina
5. Kai komponentas unmount'inamas, presence automatiškai pašalinamas

### Peržiūrų Skaičiavimas su Daugikliu

1. Funkcija `get_article_view_count(article_id)` skaičiuoja tikrą peržiūrų skaičių
2. Generuojamas nuoseklus daugiklis (2.0-4.0) pagal `article_id` hash
3. Tikras skaičius dauginamas iš daugiklio
4. Grąžinamas tiek tikras, tiek rodomas skaičius
5. **Svarbu**: Ta pati publikacija visada gauna tą patį daugiklį (nuoseklumas)

## 🎯 Sekantys Žingsniai

1. **Testuoti production aplinkoje**
2. **Stebėti performance**:
   - Ar indeksai veikia gerai?
   - Ar trigger funkcija greita?
3. **Pridėti daugiau analytics**:
   - Populiariausi straipsniai
   - Skaitymo laiko tracking
   - Geografinė statistika
4. **Sukurti admin dashboard** su detalesnėmis analytics

## 📝 Dokumentacija

Pilna dokumentacija: `docs/ANALYTICS_FEATURE.md`

## ✨ Funkcijos

- ✅ Realaus laiko skaitytojų skaičiavimas
- ✅ Metų lankytojų statistika
- ✅ Automatinis tracking
- ✅ RLS security
- ✅ Performance optimized
- ✅ Responsive UI
- ✅ TypeScript support

---

**Sukurta**: 2025-01-20  
**Projektas**: Ponas Obuolys  
**Technologijos**: React, TypeScript, Supabase, Realtime Presence API
