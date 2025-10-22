# Migracijos instrukcija: Kelios kategorijos publikacijoms

## Apžvalga

Ši migracija leidžia publikacijoms turėti kelias kategorijas vietoj vienos. `articles.category` laukas pakeičiamas iš `text` į `text[]` (masyvas).

## Atlikti pakeitimai

### 1. Duomenų bazė

- **Migracijos failas**: `supabase/migrations/20250115_change_articles_category_to_array.sql`
- Pakeičia `category` lauką iš `text` į `text[]`
- Saugiai konvertuoja esamus duomenis (viena kategorija → masyvas su viena kategorija)

### 2. TypeScript tipai

- **Failas**: `src/integrations/supabase/types.ts`
- Atnaujinti `articles` tipai:
  - `Row.category: string[]`
  - `Insert.category: string[]`
  - `Update.category?: string[]`

### 3. Formos komponentai

- **Naujas komponentas**: `src/components/ui/multi-select.tsx`
  - Multi-select komponentas su checkbox'ais
  - Galimybė pridėti naujas kategorijas
  - Vizualus pasirinkimų atvaizdavimas su Badge komponentais

- **Atnaujintas**: `src/components/admin/publication-editor/form-fields/metadata-fields.tsx`
  - Naudoja naują `MultiSelect` komponentą
  - Pašalinta sena single-select logika

### 4. Duomenų apdorojimas

- **Failas**: `src/components/admin/publication-editor/publication-editor.hooks.ts`
  - `useCategories`: Flatten'ina kategorijas iš visų publikacijų
  - `usePublicationForm`: Default reikšmė `category: []`
  - `usePublicationData`: Konvertuoja senus duomenis į masyvą

- **Failas**: `src/components/admin/publication-editor/publication-editor.types.ts`
  - Zod schema: `category: z.array(z.string()).min(1)`

### 5. Vartotojo sąsaja

- **ArticleCard** (`src/components/ui/article-card.tsx`):
  - Rodo visas kategorijas atskirtas kableliais
  - Naudoja pirmą kategoriją spalvos pasirinkimui

- **PublicationDetail** (`src/pages/PublicationDetail.tsx`):
  - Rodo visas kategorijas kaip atskirus Badge komponentus

- **Filtravimas** (`src/pages/ArticlesPage.tsx`, `src/pages/PublicationsPage.tsx`):
  - Flatten'ina kategorijas filtrų sąrašui
  - Filtruoja publikacijas pagal bet kurią pasirinktą kategoriją

## Migracijos paleidimas

### Naudojant Supabase CLI (rekomenduojama)

```powershell
# 1. Įsitikinkite, kad esate prisijungę prie Supabase projekto
supabase link --project-ref jzixoslapmlqafrlbvpk

# 2. Paleiskite migraciją
supabase db push

# 3. Regeneruokite TypeScript tipus (jei reikia)
supabase gen types typescript --project-id jzixoslapmlqafrlbvpk > src/integrations/supabase/types.ts
```

### Naudojant Supabase Dashboard

1. Eikite į https://supabase.com/dashboard/project/jzixoslapmlqafrlbvpk
2. Pasirinkite **SQL Editor**
3. Nukopijuokite ir įklijuokite `supabase/migrations/20250115_change_articles_category_to_array.sql` turinį
4. Paspauskite **Run**

## Testavimas

### 1. Patikrinkite duomenų bazę

```sql
-- Patikrinkite, ar category yra masyvas
SELECT id, title, category
FROM articles
LIMIT 5;

-- Patikrinkite, ar visi įrašai turi masyvą
SELECT COUNT(*) as total,
       COUNT(CASE WHEN category IS NOT NULL AND array_length(category, 1) > 0 THEN 1 END) as with_categories
FROM articles;
```

### 2. Patikrinkite admin sąsają

1. Eikite į **Admin Dashboard → Publikacijos**
2. Sukurkite naują publikaciją
3. Pasirinkite kelias kategorijas
4. Išsaugokite ir patikrinkite, ar visos kategorijos išsaugotos

### 3. Patikrinkite vartotojo sąsają

1. Eikite į **/publikacijos**
2. Patikrinkite, ar kategorijų filtrai veikia
3. Patikrinkite, ar publikacijų kortelėse rodomos visos kategorijos
4. Atidarykite publikaciją ir patikrinkite, ar visos kategorijos rodomos

## Rollback (jei reikia)

Jei kažkas nepavyktų, galite grąžinti pakeitimus:

```sql
-- 1. Pridėti laikinąjį stulpelį
ALTER TABLE articles ADD COLUMN category_temp text;

-- 2. Konvertuoti masyvą atgal į string (paimti pirmą elementą)
UPDATE articles
SET category_temp = category[1]
WHERE category IS NOT NULL AND array_length(category, 1) > 0;

-- 3. Ištrinti masyvo stulpelį
ALTER TABLE articles DROP COLUMN category;

-- 4. Pervadinti laikinąjį stulpelį
ALTER TABLE articles RENAME COLUMN category_temp TO category;

-- 5. Nustatyti NOT NULL
ALTER TABLE articles ALTER COLUMN category SET NOT NULL;
```

## Pastabos

- Esami duomenys saugiai konvertuojami - viena kategorija tampa masyvu su vienu elementu
- Visi komponentai atnaujinti ir palaiko tiek senus (string), tiek naujus (string[]) duomenis
- Multi-select komponentas leidžia pridėti naujas kategorijas tiesiogiai iš formos
- Filtravimas veikia su bet kuria publikacijos kategorija

## Problemos ir sprendimai

### Problema: TypeScript klaidos po migracijos

**Sprendimas**: Regeneruokite tipus naudojant `supabase gen types typescript`

### Problema: Senos publikacijos nerodo kategorijų

**Sprendimas**: Patikrinkite, ar migracija buvo sėkmingai paleista. Visi seni įrašai turėtų būti automatiškai konvertuoti.

### Problema: Negaliu pasirinkti kelių kategorijų

**Sprendimas**: Išvalykite naršyklės cache ir perkraukite puslapį. Įsitikinkite, kad visi failai yra atnaujinti.
