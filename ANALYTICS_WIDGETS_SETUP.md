# 📊 Naujos Analitikos Funkcijos - Setup Instrukcijos

## Kas Naujo?

Pridėtos dvi naujos analitikos funkcijos:

### 1. 🔥 Trending Articles (Populiariausi Straipsniai)

- Rodo TOP straipsnius pagal peržiūras per pasirinktą laikotarpį
- Integruota į pagrindinį puslapį ir Admin Dashboard
- Realaus laiko duomenys su 5 min cache

### 2. 📱 Device & Browser Stats (Įrenginių ir Naršyklių Statistika)

- Rodo, kokiais įrenginiais (Mobile/Desktop/Tablet) skaito vartotojai
- Rodo, kokiomis naršyklėmis (Chrome/Firefox/Safari/etc.) skaito
- Integruota į Admin Dashboard
- 10 min cache

---

## 🚀 Diegimo Žingsniai

### 1. Paleisti Supabase Migracijas

Migracija sukurta faile: `supabase/migrations/20250120_trending_and_device_stats.sql`

**Paleisti per Supabase CLI:**

```bash
# Prisijungti prie Supabase projekto
npx supabase login

# Susieti su projektu (jei dar nesusieta)
npx supabase link --project-ref <your-project-ref>

# Paleisti migracijas
npx supabase db push
```

**ARBA per Supabase Dashboard:**

1. Eiti į https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql
2. Nukopijuoti visą `20250120_trending_and_device_stats.sql` failo turinį
3. Įklijuoti į SQL Editor
4. Paspausti "Run"

### 2. Atnaujinti TypeScript Types (Rekomenduojama)

```bash
# Sugeneruoti naujus types iš Supabase schemos
npx supabase gen types typescript --local > src/integrations/supabase/types.ts

# ARBA jei naudojate remote projektą:
npx supabase gen types typescript --project-id <your-project-id> > src/integrations/supabase/types.ts
```

**Pastaba:** Jei negeneruosite naujų types, kodas vis tiek veiks, bet bus TypeScript warnings. Naudojame `as any` type assertions kaip temporary workaround.

### 3. Patikrinti, ar Veikia

**Trending Articles:**

- Atidaryti pagrindinį puslapį (/)
- Turėtumėte matyti sekciją "Populiariausia šią savaitę" po featured straipsniais

**Device Stats:**

- Prisijungti kaip admin
- Eiti į Admin Dashboard
- Overview tab'e turėtumėte matyti įrenginių ir naršyklių statistiką

---

## 📁 Sukurti Failai

### SQL Migracija:

- `supabase/migrations/20250120_trending_and_device_stats.sql`

### Hooks:

- `src/hooks/use-trending-articles.ts`
- `src/hooks/use-device-stats.ts`

### Komponentai:

- `src/components/widgets/trending-articles.tsx`
- `src/components/widgets/device-stats.tsx`

### Atnaujinti Puslapiai:

- `src/pages/Index.tsx` - pridėtas TrendingArticles
- `src/pages/AdminDashboard.tsx` - pridėti abu widget'ai

---

## 🎨 Naudojimo Pavyzdžiai

### Trending Articles Komponentas

```tsx
import { TrendingArticles } from '@/components/widgets/trending-articles';

// Default versija (pilnas widget)
<TrendingArticles days={7} limit={5} />

// Kompaktiška versija (šoniniam barui)
<TrendingArticles days={7} limit={3} variant="compact" />

// Mėnesio populiariausi
<TrendingArticles days={30} limit={10} />
```

### Device Stats Komponentas

```tsx
import { DeviceStats } from '@/components/widgets/device-stats';

// Default - 30 dienų statistika
<DeviceStats />

// Pastarųjų 7 dienų
<DeviceStats days={7} />

// Su custom className
<DeviceStats days={30} className="my-custom-class" />
```

---

## 🔧 Konfigūracija

### SQL Funkcijų Parametrai

**get_trending_articles:**

- `since_date` (TIMESTAMPTZ) - Nuo kada skaičiuoti peržiūras (default: 7 dienos)
- `limit_count` (INT) - Kiek straipsnių grąžinti (default: 10)

**get_device_breakdown:**

- `since_date` (TIMESTAMPTZ) - Nuo kada skaičiuoti statistiką (default: 30 dienų)

### React Query Cache

**Trending Articles:**

- staleTime: 5 minutės
- Automatiškai atsinaujina kas 5 min

**Device Stats:**

- staleTime: 10 minučių
- Automatiškai atsinaujina kas 10 min

---

## 🐛 Troubleshooting

### Problema: "Function get_trending_articles does not exist"

**Sprendimas:** Migracija dar nepaleista. Paleiskite migracijas pagal 1 žingsnį.

### Problema: TypeScript klaidos apie RPC funkcijas

**Sprendimas:**

1. Paleiskite migracijas
2. Sugeneruokite naujus types (žr. 2 žingsnį)
3. ARBA ignoruokite - kodas veiks su `as any` assertions

### Problema: Nėra duomenų widget'uose

**Galimos priežastys:**

1. Dar nėra page_views duomenų duomenų bazėje
2. Visi straipsniai nepublikuoti (published = false)
3. Nėra peržiūrų per pasirinktą laikotarpį

**Sprendimas:** Patikrinkite duomenų bazėje:

```sql
-- Patikrinti, ar yra page_views
SELECT COUNT(*) FROM page_views;

-- Patikrinti, ar yra publikuotų straipsnių
SELECT COUNT(*) FROM articles WHERE published = true;

-- Testuoti trending funkciją
SELECT * FROM get_trending_articles(NOW() - INTERVAL '30 days', 10);
```

---

## 📊 Duomenų Struktūra

### TrendingArticle Interface

```typescript
{
  id: string;
  title: string;
  slug: string;
  views: number;
  image_url: string | null;
  category: string[];
}
```

### DeviceStatsData Interface

```typescript
{
  devices: Array<{
    type: string; // 'Mobile' | 'Desktop' | 'Tablet'
    count: number;
    percentage: number;
  }>;
  browsers: Array<{
    name: string; // 'Chrome' | 'Firefox' | 'Safari' | etc.
    count: number;
    percentage: number;
  }>;
}
```

---

## 🎯 Ateities Plėtros Galimybės

1. **Realtime Updates** - Naudoti Supabase Realtime subscriptions
2. **Export funkcionalumas** - CSV/PDF eksportas
3. **Laiko intervalų pasirinkimas** - UI elementas laiko intervalui keisti
4. **Geografinė statistika** - Šalių/miestų breakdown
5. **Engagement metrics** - Scroll depth, reading time
6. **Comparison view** - Palyginti skirtingus laikotarpius

---

## 📝 Pastabos

- ✅ GDPR/BDAR atitiktis - naudojami tik anoniminiai duomenys
- ✅ Optimizuota - naudojamas query caching
- ✅ Responsive - veikia visuose įrenginiuose
- ✅ Accessible - keyboard navigation, screen readers
- ✅ Error handling - graceful degradation jei nėra duomenų

---

**Sukūrimo data:** 2025-10-20
**Versija:** 1.0
