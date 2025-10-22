# Susijusių publikacijų rekomendacijos

## Apžvalga

Ši funkcija rodo susijusias publikacijas po kiekvieno straipsnio, skatinant skaitytojus toliau naršyti svetainėje ir didina vartotojų įsitraukimą.

## Funkcionalumas

### Kaip veikia

1. **Kategorijų palyginimas**: Sistema parenka straipsnius, kurie turi bent vieną bendrą kategoriją su dabartiniu straipsniu
2. **Prioritetizavimas**: Straipsniai rūšiuojami pagal:
   - Bendrų kategorijų skaičių (daugiau bendrų kategorijų = aukštesnis prioritetas)
   - Publikavimo datą (naujesni straipsniai prioritetiniai)
3. **Filtravimas**: Rodomi tik publikuoti straipsniai, išskyrus dabartinį
4. **Limitas**: Pagal nutylėjimą rodomi 3 susijusiausi straipsniai

## Sukurti failai

### 1. Hook: `use-related-articles.ts`

**Vieta**: `src/hooks/use-related-articles.ts`

**Funkcionalumas**:

- Gauna susijusius straipsnius iš duomenų bazės
- Skaičiuoja atitikimo balą pagal bendras kategorijas
- Rūšiuoja rezultatus pagal relevantumą
- Grąžina loading būseną

**Naudojimas**:

```typescript
const { relatedArticles, loading } = useRelatedArticles({
  currentArticleId: publication.id,
  categories: publication.category,
  limit: 3,
});
```

**Parametrai**:

- `currentArticleId` (string): Dabartinio straipsnio ID (bus išfiltruotas)
- `categories` (string[]): Dabartinio straipsnio kategorijos
- `limit` (number, optional): Maksimalus rodomų straipsnių skaičius (default: 3)

### 2. Komponentas: `related-articles.tsx`

**Vieta**: `src/components/publications/related-articles.tsx`

**Funkcionalumas**:

- Rodo susijusių straipsnių grid'ą
- Responsive dizainas (1 stulpelis mobiliuose, 2 planšetėse, 3 desktop'e)
- Interaktyvūs hover efektai
- Rodo straipsnio paveikslėlį, kategorijas, pavadinimą, aprašymą ir metaduomenis

**Props**:

- `articles` (Article[]): Susijusių straipsnių masyvas
- `loading` (boolean, optional): Loading būsena

## Integracijos

### PublicationDetail.tsx

Komponentas integruotas į `PublicationDetail.tsx` puslapį:

```typescript
// Import'ai
import { RelatedArticles } from "@/components/publications/related-articles";
import { useRelatedArticles } from "@/hooks/use-related-articles";

// Hook naudojimas
const { relatedArticles, loading: relatedLoading } = useRelatedArticles({
  currentArticleId: publication?.id || "",
  categories: publication?.category || [],
  limit: 3,
});

// Renderinimas po straipsnio turinio
<RelatedArticles articles={relatedArticles} loading={relatedLoading} />
```

## Dizainas

### Vizualiniai elementai

- **Antraštė**: "Jums gali patikti" su aprašymu
- **Grid layout**: Responsive grid su 1-3 stulpeliais
- **Straipsnio kortelė**:
  - Paveikslėlis (aspect-ratio 16:9)
  - Kategorijų badge'ai (max 2 + counter)
  - Pavadinimas (max 2 eilutės)
  - Aprašymas (max 2 eilutės)
  - Metadata (data, skaitymo laikas)
  - "Skaityti daugiau" nuoroda su rodykle

### Hover efektai

- Border spalva keičiasi į primary
- Shadow efektas
- Paveikslėlis padidėja (scale 1.05)
- Rodyklė juda į dešinę
- Pavadinimas keičia spalvą į primary

### Responsive breakpoints

- **Mobile** (< 768px): 1 stulpelis
- **Tablet** (768px - 1024px): 2 stulpeliai
- **Desktop** (> 1024px): 3 stulpeliai

## SEO ir Performance

### Optimizacijos

1. **Lazy loading**: Naudojamas `LazyImage` komponentas paveikslėliams
2. **Efektyvus query**: Gauna tik reikalingus duomenis
3. **Client-side filtering**: Scoring ir rūšiavimas vyksta kliente
4. **Conditional rendering**: Komponentas nerodomas, jei nėra susijusių straipsnių

### SEO nauda

- **Vidinis susiejimas**: Pagerina svetainės struktūrą
- **Mažesnis bounce rate**: Skaitytojai lieka ilgiau svetainėje
- **Didesnis pages per session**: Skatina naršyti daugiau puslapių
- **Geresnė crawlability**: Padeda paieškos sistemoms atrasti susijusį turinį

## Konfigūracija

### Keisti rodomų straipsnių skaičių

Redaguokite `PublicationDetail.tsx`:

```typescript
const { relatedArticles, loading: relatedLoading } = useRelatedArticles({
  currentArticleId: publication?.id || "",
  categories: publication?.category || [],
  limit: 6, // Pakeiskite į norimą skaičių
});
```

### Keisti grid stulpelių skaičių

Redaguokite `related-articles.tsx`:

```typescript
// Pakeiskite className
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
```

### Keisti antraštę

Redaguokite `related-articles.tsx`:

```typescript
<h2 className="text-2xl md:text-3xl font-bold mb-2">
  Skaityti toliau // Arba bet kokį kitą tekstą
</h2>
```

## Testavimas

### 1. Patikrinkite su straipsniu, turinčiu kategorijas

1. Atidarykite bet kurią publikaciją
2. Slinkite žemyn iki straipsnio pabaigos
3. Turėtumėte matyti "Jums gali patikti" sekciją su 1-3 straipsniais

### 2. Patikrinkite su straipsniu be kategorijų

1. Atidarykite publikaciją be kategorijų
2. Rekomendacijų sekcija neturėtų būti rodoma

### 3. Patikrinkite responsive dizainą

1. Atidarykite publikaciją
2. Keiskite naršyklės dydį
3. Patikrinkite, kad grid'as keičiasi: 1 → 2 → 3 stulpeliai

### 4. Patikrinkite hover efektus

1. Užveskite pelę ant straipsnio kortelės
2. Turėtumėte matyti:
   - Border spalvos pasikeitimą
   - Shadow efektą
   - Paveikslėlio padidėjimą
   - Rodyklės judėjimą

## Galimi patobulinimai

### Ateityje galima pridėti:

1. **A/B testavimas**: Skirtingi antraščių variantai
2. **Personalizacija**: Remtis vartotojo skaitymo istorija
3. **Analytics**: Sekti, kurie straipsniai dažniausiai spaudžiami
4. **Infinite scroll**: Įkelti daugiau straipsnių scrollinant
5. **Filtravimas pagal content_type**: Rodyti tik naujienas arba tik straipsnius
6. **Trending articles**: Rodyti populiariausius straipsnius, jei nėra susijusių
7. **Manual recommendations**: Leisti administratoriams rankiniu būdu pasirinkti susijusius straipsnius

## Troubleshooting

### Problema: Nerodoma rekomendacijų sekcija

**Galimos priežastys**:

1. Straipsnis neturi kategorijų
2. Nėra kitų publikuotų straipsnių su tomis pačiomis kategorijomis
3. Visi kiti straipsniai su tomis pačiomis kategorijomis yra nepublikuoti

**Sprendimas**: Įsitikinkite, kad:

- Straipsnis turi bent vieną kategoriją
- Yra bent vienas kitas publikuotas straipsnis su ta pačia kategorija

### Problema: Rodomi netinkami straipsniai

**Sprendimas**: Patikrinkite kategorijų atitikimą duomenų bazėje:

```sql
SELECT id, title, category
FROM articles
WHERE published = true
ORDER BY date DESC;
```

### Problema: Lėtas įkėlimas

**Sprendimas**:

1. Patikrinkite, ar duomenų bazėje yra indeksas `category` stulpeliui
2. Sumažinkite `limit` parametrą
3. Optimizuokite paveikslėlius

## Performance metrikos

### Tikėtini rezultatai

- **Query laikas**: < 100ms
- **Rendering laikas**: < 50ms
- **Image loading**: Lazy loaded, neblokuoja puslapio
- **Bundle size**: ~2KB (minified)

### Monitoring

Galite stebėti performance naudojant:

```typescript
console.time('related-articles-fetch');
const { relatedArticles } = useRelatedArticles(...);
console.timeEnd('related-articles-fetch');
```
