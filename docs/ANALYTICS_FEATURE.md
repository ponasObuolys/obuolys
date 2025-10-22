# 📊 Analytics & Live Readers Feature

## Apžvalga

Ši funkcija leidžia sekti ir rodyti:

1. **Bendrą metų lankytojų skaičių** svetainėje
2. **Realiu laiku skaitančių tą pačią publikaciją skaičių** (live readers)

## Funkcionalumas

### 1. Metų Statistika

- Automatiškai skaičiuoja unikalius lankytojus per metus
- Skaičiuoja bendrą puslapių peržiūrų skaičių
- Duomenys atnaujinami realiu laiku
- Rodoma kompaktiškai publikacijos puslapyje

### 2. Live Readers (Realaus Laiko Skaitytojai)

- Naudoja Supabase Realtime Presence API
- Rodo kiek žmonių šiuo metu skaito tą pačią publikaciją
- Automatiškai atsinaujina kai kas nors prisijungia/atsijungia
- Animuotas indikatorius kai yra aktyvių skaitytojų

## Architektūra

### Duomenų Bazė

#### Lentelės

**`page_views`** - Saugo visas puslapių peržiūras

```sql
- id: UUID (PK)
- article_id: UUID (FK -> articles)
- user_id: UUID (FK -> auth.users, nullable)
- session_id: TEXT (unikalus sesijos ID)
- viewed_at: TIMESTAMPTZ
- user_agent: TEXT
- ip_address: INET
```

**`site_statistics`** - Saugo agreguotą statistiką

```sql
- id: UUID (PK)
- year: INTEGER (UNIQUE)
- total_visitors: INTEGER
- total_page_views: INTEGER
- last_updated: TIMESTAMPTZ
```

#### Funkcijos

**`increment_site_stats()`** - Trigger funkcija

- Automatiškai atnaujina statistiką kai įrašoma nauja peržiūra
- Skaičiuoja unikalius lankytojus pagal session_id
- Veikia per trigger `trigger_increment_site_stats`

**`get_current_year_stats()`** - RPC funkcija

- Grąžina dabartinių metų statistiką
- Naudojama frontend'e statistikos rodymui

### Frontend Komponentai

#### 1. Service Layer

**`src/services/analytics.service.ts`**

- `trackPageView(articleId)` - Įrašo puslapio peržiūrą
- `getCurrentYearStats()` - Gauna metų statistiką
- `getArticleViewCount(articleId)` - Gauna konkretaus straipsnio peržiūrų skaičių

#### 2. Hooks

**`src/hooks/use-live-readers.ts`**

- Naudoja Supabase Realtime Presence API
- Automatiškai prisijungia prie kanalo kai komponentas mount'inamas
- Automatiškai atsijungia kai komponentas unmount'inamas
- Grąžina: `{ count, loading, error }`

#### 3. UI Components

**`src/components/analytics/reader-stats.tsx`**

- Rodo statistiką dviem variantais:
  - `default` - Pilnas kortelių vaizdas
  - `compact` - Kompaktiškas inline vaizdas
- Integruoja live readers ir metų statistiką

## Naudojimas

### Publikacijos Puslapyje

```tsx
import { ReaderStats } from "@/components/analytics/reader-stats";
import { analyticsService } from "@/services/analytics.service";

// Track page view
useEffect(() => {
  if (publication?.id) {
    analyticsService.trackPageView(publication.id);
  }
}, [publication?.id]);

// Display stats
<ReaderStats articleId={publication.id} variant="compact" className="mb-6" />;
```

### Standalone Naudojimas

```tsx
// Tik live readers
const { count, loading } = useLiveReaders({
  articleId: "article-uuid",
  enabled: true,
});

// Tik metų statistika
const stats = await analyticsService.getCurrentYearStats();
```

## Setup Instrukcijos

### 1. Paleisti Migraciją

```bash
# Jei naudojate Supabase CLI lokaliai
supabase migration up

# Arba per Supabase Dashboard
# SQL Editor -> Nukopijuoti ir paleisti migration failą
```

### 2. Atnaujinti TypeScript Tipus

```bash
npx supabase gen types typescript --project-id <your-project-id> > src/integrations/supabase/types.ts
```

### 3. Įjungti Realtime

Supabase Dashboard:

1. Eiti į **Database** -> **Replication**
2. Įsitikinti, kad Realtime yra įjungtas projektui

### 4. Patikrinti RLS Policies

Visos reikalingos RLS policies sukuriamos automatiškai per migraciją:

- `page_views` - Visi gali insert, tik savininkas/admin gali read
- `site_statistics` - Visi gali read, tik admin gali modify

## Saugumas

### Session Tracking

- Naudojamas `sessionStorage` unikaliam sesijos ID
- Session ID generuojamas tik kliento pusėje
- Nėra saugomas jokioje duomenų bazėje ilgam laikui

### Privacy

- IP adresai saugomi tik analytics tikslais
- User ID saugomas tik jei vartotojas prisijungęs
- Visi duomenys apsaugoti RLS policies

### Rate Limiting

- Viena peržiūra per sesijos ID
- Automatinis deduplikavimas per trigger funkciją

## Performance

### Optimizacijos

- Indeksai sukurti ant `article_id`, `viewed_at`, `session_id`
- Agregacija vyksta per trigger, ne per query
- Realtime Presence naudoja WebSocket (efektyviau nei polling)

### Skalabilumas

- Trigger funkcija optimizuota greitam įrašymui
- Statistika saugoma agreguota (ne skaičiuojama kiekvieną kartą)
- Presence API automatiškai valdo connection'us

## Troubleshooting

### Nematau live readers skaičiaus

1. Patikrinti ar Realtime įjungtas Supabase projekte
2. Patikrinti browser console ar nėra WebSocket klaidų
3. Patikrinti ar `articleId` teisingas

### Statistika nerodo duomenų

1. Patikrinti ar migracija sėkmingai paleista
2. Patikrinti ar RPC funkcija `get_current_year_stats` egzistuoja
3. Patikrinti browser console ar nėra klaidų

### TypeScript klaidos

1. Paleisti: `npx supabase gen types typescript --project-id <id> > src/integrations/supabase/types.ts`
2. Perkrauti TypeScript serverį VS Code

## Ateities Plėtros Galimybės

- [ ] Dashboard administratoriams su detalesnėmis analytics
- [ ] Populiariausių straipsnių TOP 10
- [ ] Geografinė statistika (iš IP)
- [ ] Skaitymo laiko tracking (kiek laiko praleista straipsnyje)
- [ ] A/B testing support
- [ ] Export į CSV/Excel
- [ ] Real-time notifications kai pasiekiami milestone'ai

## Licencija

Ši funkcija yra dalis Ponas Obuolys projekto ir naudoja tą pačią licenciją.
