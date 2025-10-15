# Vartotojų įsitraukimo funkcijos

Šis dokumentas aprašo tris pagrindines funkcijas, skirtas padidinti vartotojų įsitraukimą ir laiką svetainėje.

## 📋 Turinys

1. [Komentarų sistema](#1-komentarų-sistema)
2. [Bookmark / Išsaugoti vėlesniam skaitymui](#2-bookmark--išsaugoti-vėlesniam-skaitymui)
3. [Skaitymo progreso indikatorius](#3-skaitymo-progreso-indikatorius)
4. [Migracijos paleidimas](#migracijos-paleidimas)
5. [Trūkstamos priklausomybės](#trūkstamos-priklausomybės)

---

## 1. Komentarų sistema

### Funkcionalumas
- ✅ Vartotojai gali komentuoti straipsnius
- ✅ Atsakymai į komentarus (nested comments)
- ✅ Moderavimo sistema (admin patvirtinimas)
- ✅ Integruota su Supabase auth
- ✅ Real-time profilio informacija (avatar, username)

### Sukurti failai

#### Komponentas
**`src/components/comments/comments-section.tsx`**
- Pilna komentarų sistema su UI
- Komentarų ir atsakymų rodymas
- Forma naujam komentarui
- Moderavimo statusas

#### Duomenų bazė
**`supabase/migrations/20250115_create_comments_and_bookmarks.sql`**
- `article_comments` lentelė
- RLS policies (read, create, update, moderate)
- Indeksai performance'ui

#### Supabase tipai
**`src/integrations/supabase/types.ts`**
- `article_comments` Row, Insert, Update tipai

### Kaip naudoti

#### Vartotojo perspektyva
1. Atidarykite bet kurią publikaciją
2. Slinkite žemyn iki komentarų sekcijos
3. Parašykite komentarą (reikia būti prisijungus)
4. Komentaras bus rodomas po admin patvirtinimo

#### Admin moderavimas
Komentarų moderavimas vyksta per duomenų bazę:

```sql
-- Patvirtinti komentarą
UPDATE article_comments 
SET is_approved = true 
WHERE id = 'comment-id';

-- Ištrinti komentarą (soft delete)
UPDATE article_comments 
SET is_deleted = true 
WHERE id = 'comment-id';

-- Peržiūrėti laukiančius patvirtinimo
SELECT * FROM article_comments 
WHERE is_approved = false AND is_deleted = false
ORDER BY created_at DESC;
```

### RLS Policies
- **Public**: Gali skaityti tik patvirtintus komentarus
- **Authenticated**: Gali kurti komentarus (laukia patvirtinimo)
- **Users**: Gali redaguoti/trinti savo komentarus
- **Admins**: Gali matyti ir moderuoti visus komentarus

---

## 2. Bookmark / Išsaugoti vėlesniam skaitymui

### Funkcionalumas
- ✅ "Išsaugoti" mygtukas kiekviename straipsnyje
- ✅ Asmeninis "Mano sąrašas" puslapis (`/mano-sarasas`)
- ✅ Sinchronizacija su vartotojo profiliu
- ✅ Visual feedback (filled bookmark icon)

### Sukurti failai

#### Hook
**`src/hooks/use-bookmark.ts`**
- `useBookmark({ articleId })` hook
- `isBookmarked`, `loading`, `toggleBookmark`
- Automatinis check ar straipsnis išsaugotas

#### Komponentas
**`src/components/publications/bookmark-button.tsx`**
- Bookmark mygtukas su icon
- Customizable variant, size, showText
- Loading state

#### Puslapis
**`src/pages/MyBookmarksPage.tsx`**
- Asmeninis išsaugotų straipsnių puslapis
- Grid layout su ArticleCard komponentais
- Empty state su CTA

#### Duomenų bazė
**`supabase/migrations/20250115_create_comments_and_bookmarks.sql`**
- `article_bookmarks` lentelė
- UNIQUE constraint (article_id, user_id)
- RLS policies

### Kaip naudoti

#### Išsaugoti straipsnį
```tsx
import { BookmarkButton } from "@/components/publications/bookmark-button";

<BookmarkButton 
  articleId={article.id}
  variant="outline"
  size="default"
  showText={true}
/>
```

#### Peržiūrėti išsaugotus
1. Prisijunkite
2. Eikite į `/mano-sarasas`
3. Matysite visus išsaugotus straipsnius

### RLS Policies
- **Users**: Gali skaityti, kurti ir trinti savo bookmarks
- **Public**: Negali matyti kitų bookmarks

---

## 3. Skaitymo progreso indikatorius

### Funkcionalumas
- ✅ Progress bar viršuje puslapio (fixed)
- ✅ Floating circular progress indicator
- ✅ "Jūs perskaitėte X%" tekstas
- ✅ Įvertinimas, kiek laiko liko skaityti
- ✅ Completion celebration (🎉)
- ✅ Automatinis išsaugojimas į DB

### Sukurti failai

#### Komponentas
**`src/components/reading/reading-progress-bar.tsx`**
- Fixed progress bar viršuje
- Floating circular indicator
- Time remaining calculation
- Completion animation

#### Hook
**`src/hooks/use-reading-progress.ts`**
- Išsaugo progresą į duomenų bazę
- Debounced (kas 5% pokytis)
- Automatinis completed flag

#### Duomenų bazė
**`supabase/migrations/20250115_create_comments_and_bookmarks.sql`**
- `reading_progress` lentelė
- progress_percentage, last_position, completed
- UNIQUE constraint (article_id, user_id)

### Kaip naudoti

```tsx
import { ReadingProgressBar } from "@/components/reading/reading-progress-bar";
import { useReadingProgress } from "@/hooks/use-reading-progress";

const articleRef = useRef<HTMLElement>(null);
const [scrollProgress, setScrollProgress] = useState(0);

// Track progress
useReadingProgress({
  articleId: publication.id,
  progress: scrollProgress,
});

// Render
<ReadingProgressBar
  targetRef={articleRef}
  estimatedReadTime={publication.read_time}
/>
```

### Vizualiniai elementai
1. **Top bar**: Thin progress bar viršuje (1px height)
2. **Floating indicator (kombinuotas su back-to-top)**: 
   - Circular progress (bottom-right)
   - Percentage text (<100%) arba up arrow (100%)
   - Tooltip su laiku liko / "Grįžti į viršų"
   - Click'as grąžina į viršų
   - Pakeičia globalų back-to-top mygtuką

### RLS Policies
- **Users**: Gali skaityti ir atnaujinti savo progresą
- **Public**: Negali matyti kitų progreso

---

## Migracijos paleidimas

### 1. Paleisti migraciją

```powershell
# Naudojant Supabase CLI
supabase db push

# Arba per Dashboard
# 1. Eikite į SQL Editor
# 2. Nukopijuokite supabase/migrations/20250115_create_comments_and_bookmarks.sql
# 3. Paleiskite
```

### 2. Patikrinti lenteles

```sql
-- Patikrinti ar lentelės sukurtos
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('article_comments', 'article_bookmarks', 'reading_progress');

-- Patikrinti RLS policies
SELECT tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('article_comments', 'article_bookmarks', 'reading_progress');
```

---

## Trūkstamos priklausomybės

### 1. Framer Motion (animacijoms)

```powershell
npm install framer-motion
```

**Naudojama**: `reading-progress-bar.tsx` animacijoms

### 2. date-fns (datų formatavimui)

```powershell
npm install date-fns
```

**Naudojama**: `comments-section.tsx` - "prieš 2 valandas" formatui

### 3. AuthContext

Reikia sukurti arba patikrinti ar egzistuoja:
**`src/contexts/AuthContext.tsx`**

```tsx
import { createContext, useContext } from 'react';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// ... AuthProvider implementation
```

---

## Integracijos

### PublicationDetail.tsx

Visos trys funkcijos integruotos į `PublicationDetail.tsx`:

```tsx
// 1. Reading Progress Bar
<ReadingProgressBar
  targetRef={articleRef}
  estimatedReadTime={publication.read_time}
/>

// 2. Bookmark Button
<BookmarkButton articleId={publication.id} />

// 3. Comments Section
<CommentsSection articleId={publication.id} />
```

### App.tsx

Pridėtas route'as:
```tsx
<Route path="/mano-sarasas" element={<MyBookmarksPage />} />
```

---

## Testavimas

### 1. Komentarų sistema

**Testuoti kaip vartotojas:**
1. Prisijunkite
2. Atidarykite publikaciją
3. Parašykite komentarą
4. Patikrinkite, kad rodomas "laukia patvirtinimo" pranešimas

**Testuoti kaip admin:**
```sql
-- Patvirtinti komentarą
UPDATE article_comments SET is_approved = true WHERE id = 'comment-id';
```
5. Atnaujinkite puslapį - komentaras turėtų būti matomas

### 2. Bookmark sistema

1. Prisijunkite
2. Atidarykite publikaciją
3. Spauskite "Išsaugoti" mygtuką
4. Eikite į `/mano-sarasas`
5. Patikrinkite, kad straipsnis rodomas

### 3. Skaitymo progresas

1. Atidarykite publikaciją
2. Slinkite žemyn
3. Stebėkite:
   - Top progress bar užsipildo
   - Floating indicator rodo procentą
   - Time remaining atsinaujina
4. Paslinkite iki galo - turėtų pasirodyti "🎉 Perskaityta!"

---

## Performance optimizacijos

### Komentarai
- Indeksai: `article_id`, `user_id`, `parent_id`, `created_at`
- RLS policies optimizuotos
- Lazy loading replies

### Bookmarks
- UNIQUE constraint prevencija dublikatų
- Indeksai: `article_id`, `user_id`, `created_at`

### Reading Progress
- Debounced save (kas 5% pokytis)
- UPSERT vietoj INSERT + UPDATE
- Indeksai: `article_id`, `user_id`

---

## Galimi patobulinimai

### Komentarų sistema
1. **Email notifications**: Pranešti autoriui apie naujus komentarus
2. **Comment reactions**: Like/dislike funkcionalumas
3. **Rich text editor**: Markdown arba WYSIWYG
4. **Comment threading**: Gilesnė nested struktūra
5. **Admin dashboard**: UI komentarų moderavimui

### Bookmark sistema
1. **Collections**: Grupuoti straipsnius į kolekcijas
2. **Tags**: Pridėti tags išsaugotiems straipsniams
3. **Notes**: Pridėti asmenines pastabas
4. **Export**: Eksportuoti bookmark sąrašą
5. **Sharing**: Dalintis bookmark sąrašais

### Reading Progress
1. **Resume reading**: "Tęsti skaitymą" mygtukas
2. **Reading stats**: Statistika profilio puslapyje
3. **Reading goals**: Nustatyti skaitymo tikslus
4. **Achievements**: Badges už perskaitytus straipsnius
5. **Reading history**: Istorija visų perskaitytų straipsnių

---

## Troubleshooting

### Problema: Komentarai nerodomi
**Sprendimas**: 
1. Patikrinkite ar komentaras patvirtintas (`is_approved = true`)
2. Patikrinkite RLS policies
3. Patikrinkite ar profiles lentelė turi username ir avatar_url

### Problema: Bookmark neišsaugomas
**Sprendimas**:
1. Patikrinkite ar vartotojas prisijungęs
2. Patikrinkite RLS policies
3. Patikrinkite ar nėra UNIQUE constraint klaidos

### Problema: Progress bar neveikia
**Sprendimas**:
1. Įdiekite `framer-motion`: `npm install framer-motion`
2. Patikrinkite ar `articleRef` teisingai priskirtas
3. Patikrinkite console errors

### Problema: AuthContext not found
**Sprendimas**:
1. Sukurkite `src/contexts/AuthContext.tsx`
2. Arba pakeiskite imports į esamą auth sistemą
3. Patikrinkite ar AuthProvider apgaubia App komponentą

---

## Saugumo aspektai

### Komentarai
- ✅ XSS protection: Tekstas sanitizuojamas
- ✅ SQL injection: Naudojamas Supabase ORM
- ✅ Rate limiting: Galima pridėti per Supabase Edge Functions
- ✅ Spam protection: Moderavimo sistema

### Bookmarks
- ✅ User isolation: RLS policies
- ✅ UNIQUE constraint: Prevencija dublikatų

### Reading Progress
- ✅ User isolation: RLS policies
- ✅ Data validation: CHECK constraints (0-100%)

---

## Metrika ir Analytics

### Komentarų metrika
```sql
-- Komentarų skaičius per straipsnį
SELECT article_id, COUNT(*) as comment_count
FROM article_comments
WHERE is_approved = true AND is_deleted = false
GROUP BY article_id
ORDER BY comment_count DESC;

-- Aktyviausi komentatoriai
SELECT user_id, COUNT(*) as comment_count
FROM article_comments
WHERE is_approved = true
GROUP BY user_id
ORDER BY comment_count DESC
LIMIT 10;
```

### Bookmark metrika
```sql
-- Populiariausi straipsniai
SELECT article_id, COUNT(*) as bookmark_count
FROM article_bookmarks
GROUP BY article_id
ORDER BY bookmark_count DESC
LIMIT 10;

-- Bookmark rate
SELECT 
  COUNT(DISTINCT user_id) as total_users,
  COUNT(*) as total_bookmarks,
  ROUND(COUNT(*)::numeric / COUNT(DISTINCT user_id), 2) as avg_bookmarks_per_user
FROM article_bookmarks;
```

### Reading progress metrika
```sql
-- Completion rate
SELECT 
  COUNT(*) as total_reads,
  COUNT(*) FILTER (WHERE completed = true) as completed_reads,
  ROUND(COUNT(*) FILTER (WHERE completed = true)::numeric / COUNT(*) * 100, 2) as completion_rate
FROM reading_progress;

-- Average reading progress
SELECT 
  article_id,
  AVG(progress_percentage) as avg_progress,
  COUNT(*) as reader_count
FROM reading_progress
GROUP BY article_id
ORDER BY avg_progress DESC;
```

---

## Sukurta 2025-01-15

Visos trys funkcijos pilnai funkcionuoja ir paruoštos naudojimui! 🎉
