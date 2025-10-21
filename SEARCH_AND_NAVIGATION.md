# Paieškos ir Navigacijos Sistema

## Apžvalga

Projekte įdiegtos dvi pagrindinės UX funkcijos:
1. **Globali Paieška** - visapusiška paieška po visą turinį su Command Palette interface
2. **Breadcrumbs Navigacija** - duonos trupiniai visiems turinio puslapiams

---

## 🔍 Globali Paieška (Global Search)

### Funkcionalumas

Globali paieškos sistema leidžia naudotojams greitai rasti:
- ✅ **Straipsnius** (articles)
- ✅ **Įrankius** (tools)
- ✅ **Kursus** (courses)

### Pagrindinės Savybės

- 🎨 **Command Palette UI** - modernus dialog interface
- ⌨️ **Keyboard Shortcut**: `Cmd+K` (Mac) / `Ctrl+K` (Windows/Linux)
- 🔄 **Real-time Search** - rezultatai atsinaujina rašant
- 🚀 **Debounced Queries** - optimizuotas našumas (300ms debounce)
- 📂 **Grupuoti Rezultatai** - pagal tipą (Straipsniai/Įrankiai/Kursai)
- ⚡ **Greita Navigacija** - Enter/Click → instant redirect
- 🎯 **Smart Matching** - ieško title, description ir content laukuose

### Komponentai

#### 1. GlobalSearch Component ([src/components/search/global-search.tsx](src/components/search/global-search.tsx))

Pagrindinis paieškos komponentas:

```tsx
import { GlobalSearch } from '@/components/search/global-search';

// Naudojimas
<GlobalSearch />
```

**Funkcijos:**
- Command Dialog su keyboard navigation
- Supabase full-text search su `ilike` operator
- Automat iškai grupuoja rezultatus
- Loading states ir error handling
- Navigacija per `react-router-dom`

#### 2. useDebounce Hook ([src/hooks/useDebounce.ts](src/hooks/useDebounce.ts))

Custom hook paieškos optimizavimui:

```tsx
import { useDebounce } from '@/hooks/useDebounce';

const debouncedValue = useDebounce(searchQuery, 300);
```

**Kodėl svarbu:**
- Sumažina API calls skaičių
- Pagerina našumą
- Geresnė UX (mažiau flicker'io)

### Integracijos

**Header Component** ([src/components/layout/Header.tsx](src/components/layout/Header.tsx)):
- Desktop: Tarp navigacijos ir theme toggle
- Mobile: Atskirame skyriuje mobile menu

```tsx
{/* Desktop */}
<div className="hidden lg:flex items-center space-x-4">
  <GlobalSearch />
  <ThemeToggle />
</div>

{/* Mobile */}
<div className="border-t border-border pt-4 mt-4">
  <div className="px-4 py-3">
    <GlobalSearch />
  </div>
</div>
```

### Paieškos Algoritmas

```typescript
// 1. Paieška straipsniuose
const { data: articles } = await supabase
  .from('articles')
  .select('id, title, slug, description, category')
  .eq('published', true)
  .or(`title.ilike.${searchTerm},description.ilike.${searchTerm},content.ilike.${searchTerm}`)
  .limit(5);

// 2. Paieška įrankiuose
const { data: tools } = await supabase
  .from('tools')
  .select('id, name, slug, description, category')
  .eq('published', true)
  .or(`name.ilike.${searchTerm},description.ilike.${searchTerm}`)
  .limit(5);

// 3. Paieška kursuose
const { data: courses } = await supabase
  .from('courses')
  .select('id, title, slug, description')
  .eq('published', true)
  .or(`title.ilike.${searchTerm},description.ilike.${searchTerm},content.ilike.${searchTerm}`)
  .limit(5);

// 4. Sujungti rezultatus
const combinedResults = [...articles, ...tools, ...courses];
```

### UI/UX Detales

**Search Trigger Button:**
```tsx
<button className="flex items-center gap-2 px-3 py-2 text-sm">
  <Search className="h-4 w-4" />
  <span className="hidden md:inline">Paieška...</span>
  <kbd className="hidden md:inline-flex">⌘K</kbd>
</button>
```

**Empty States:**
- Nieko neįrašyta → "Pradėkite rašyti..."
- Nieko nerasta → "Nieko nerasta. Pabandykite kitą užklausą."
- Loading → Loader2 spinner

**Result Item:**
```tsx
<CommandItem onSelect={() => navigate(url)}>
  <Icon className="h-4 w-4 mr-2" /> {/* FileText / Wrench / GraduationCap */}
  <div>
    <div className="font-medium">{title}</div>
    <div className="text-xs text-muted-foreground">{description}</div>
  </div>
  <ArrowRight className="h-4 w-4 ml-auto" />
</CommandItem>
```

### Performance

- **Debounce Delay**: 300ms
- **Max Results Per Type**: 5 (iš viso max 15)
- **Search Fields**: title, description, content
- **Index Status**: Published only

### Ateities Tobulinimas

- [ ] Full-text search su PostgreSQL `ts_vector`
- [ ] Search history persistence
- [ ] Recent searches display
- [ ] Search analytics tracking
- [ ] Fuzzy matching (typo tolerance)
- [ ] Search filters (category, date, type)
- [ ] Keyboard shortcuts ( ↑↓ navigation, Esc close)

---

## 🗺️ Breadcrumbs Navigacija

### Funkcionalumas

Breadcrumbs (duonos trupiniai) pagerina navigaciją ir SEO.

### Pagrindinės Savybės

- 🏠 **Home Icon** - grįžti į pradžią
- 🔗 **Clickable Links** - greita navigacija
- 📍 **Current Page Highlight** - aktyvus puslapis
- 📱 **Responsive** - prisitaiko mobile
- ♿ **Accessible** - `aria-label`, `aria-current`

### Komponentas

#### Breadcrumbs Component ([src/components/ui/breadcrumbs.tsx](src/components/ui/breadcrumbs.tsx))

```tsx
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

<Breadcrumbs
  items={[
    { label: 'Straipsniai', href: '/publikacijos' },
    { label: 'AI Naujienos', href: '/publikacijos' },
    { label: 'Straipsnio pavadinimas' }
  ]}
  showHome={true} // default: true
/>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `BreadcrumbItem[]` | required | Breadcrumb elementai |
| `showHome` | `boolean` | `true` | Rodyti Home ikoną |

**BreadcrumbItem:**
```typescript
interface BreadcrumbItem {
  label: string;  // Rodomas tekstas
  href?: string;  // Nuoroda (optional)
}
```

### Integracijos

**PublicationDetail** ([src/pages/PublicationDetail.tsx](src/pages/PublicationDetail.tsx)):
```tsx
<Breadcrumbs
  items={[
    { label: 'Straipsniai', href: '/publikacijos' },
    { label: publication.content_type === 'Naujiena' ? 'AI Naujienos' : 'Straipsniai', href: '/publikacijos' },
    { label: publication.title }
  ]}
/>
```

**ToolDetailPage** ([src/pages/ToolDetailPage.tsx](src/pages/ToolDetailPage.tsx)):
```tsx
<Breadcrumbs
  items={[
    { label: 'Įrankiai', href: '/irankiai' },
    { label: tool.category, href: '/irankiai' },
    { label: tool.name }
  ]}
/>
```

**CourseDetail** ([src/pages/CourseDetail.tsx](src/pages/CourseDetail.tsx)):
```tsx
<Breadcrumbs
  items={[
    { label: 'Kursai', href: '/kursai' },
    { label: course.level, href: '/kursai' },
    { label: course.title }
  ]}
/>
```

### Stilistika

```css
/* Pagrindinis breadcrumb container */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
}

/* Home icon ir links */
.breadcrumb a {
  transition: color 0.2s;
}

.breadcrumb a:hover {
  color: hsl(var(--foreground));
}

/* Aktyvus puslapis */
.breadcrumb [aria-current="page"] {
  color: hsl(var(--foreground));
  font-weight: 500;
}

/* Chevron separator */
.breadcrumb .chevron {
  flex-shrink: 0;
}
```

### SEO Nauda

**Schema.org Structured Data:**

Breadcrumbs jau turi structured data:
```typescript
generateBreadcrumbStructuredData([
  { name: 'Pradžia', url: 'https://ponasobuolys.lt' },
  { name: 'Straipsniai', url: 'https://ponasobuolys.lt/publikacijos' },
  { name: title, url: currentUrl }
])
```

**SEO Benefits:**
- ✅ Rich snippets Google rezultatuose
- ✅ Geresnė puslapio hierarchija
- ✅ Pagerina crawl efficiency
- ✅ Lower bounce rate (lengviau grįžti)

### Accessibility

**ARIA Attributes:**
- `aria-label="Breadcrumb"` - screen reader navigation
- `aria-current="page"` - žymi aktyvų puslapį
- Keyboard navigation su Tab

**Screen Reader Experience:**
```
"Navigation landmark: Breadcrumb"
"Link: Home"
"Separator"
"Link: Straipsniai"
"Separator"
"Current page: Straipsnio pavadinimas"
```

### Ateities Tobulinimas

- [ ] Breadcrumb schema automatas iš route config
- [ ] Breadcrumb collapse mobile (<3 items)
- [ ] Smooth scroll to top on breadcrumb click
- [ ] Dropdown navigation for middle items
- [ ] Local storage recent path history

---

## 🎨 UI Komponan Hierarchy

```
Header
├── GlobalSearch (trigger button)
│   └── CommandDialog
│       ├── CommandInput (search box)
│       └── CommandList
│           ├── CommandGroup (Straipsniai)
│           ├── CommandGroup (Įrankiai)
│           └── CommandGroup (Kursai)
│
Content Pages
└── Breadcrumbs
    ├── Home icon link
    ├── Intermediate links
    └── Current page (no link)
```

---

## 📊 Bundle Impact

**New Files:**
- `global-search.tsx`: ~5KB
- `useDebounce.ts`: ~0.5KB
- `breadcrumbs.tsx`: ~1.5KB

**Total Impact:** +~7KB (gzipped ~3KB)

**Chunk Changes:**
- `shared-components`: +19KB (255.61 KB total)
- No impact on initial bundle

---

## 🧪 Testing

### Manual Tests

**Global Search:**
1. ✅ Press `Cmd+K` → dialog opens
2. ✅ Type "AI" → results appear
3. ✅ Click result → navigates correctly
4. ✅ Press Esc → dialog closes
5. ✅ Empty query → shows helper text
6. ✅ No results → shows "Nieko nerasta"
7. ✅ Mobile → search button visible

**Breadcrumbs:**
1. ✅ Navigate to article → breadcrumbs show
2. ✅ Click "Straipsniai" → navigates to /publikacijos
3. ✅ Click Home icon → navigates to /
4. ✅ Current page not clickable
5. ✅ Mobile responsive
6. ✅ Screen reader friendly

### Automated Tests (Future)

```typescript
// Vitest unit test example
describe('GlobalSearch', () => {
  it('opens on Cmd+K', async () => {
    render(<GlobalSearch />);
    fireEvent.keyDown(document, { key: 'k', metaKey: true });
    expect(screen.getByPlaceholderText(/ieškoti/i)).toBeInTheDocument();
  });
});

// Playwright E2E test example
test('search navigates to result', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Meta+k');
  await page.fill('input[placeholder*="Ieškoti"]', 'ChatGPT');
  await page.click('text=ChatGPT');
  await expect(page).toHaveURL(/\/irankiai\//);
});
```

---

## 🔧 Troubleshooting

### Search Not Working

**Problem:** Keyboard shortcut neveikia

**Sprendimas:**
- Patikrinkite browser shortcut conflicts
- Kai kuriuose browsers `Cmd+K` used for location bar
- Mobile naudokite trigger button

### Breadcrumbs Not Showing

**Problem:** Breadcrumbs nerodomi

**Sprendimas:**
1. Patikrinkite ar komponentas importuotas
2. Užtikrinkite kad `items` prop ne tuščias
3. Patikrinkite console for errors

### Performance Issues

**Problem:** Paieška lėta

**Sprendimas:**
- Padidinkite debounce delay (300ms → 500ms)
- Sumažinkite results limit (5 → 3)
- Optimizuokite DB indexes:
```sql
CREATE INDEX idx_articles_title ON articles USING gin(to_tsvector('simple', title));
CREATE INDEX idx_tools_name ON tools USING gin(to_tsvector('simple', name));
```

---

## 📚 Susijusios Bylos

**Search:**
- [src/components/search/global-search.tsx](src/components/search/global-search.tsx)
- [src/hooks/useDebounce.ts](src/hooks/useDebounce.ts)
- [src/components/ui/command.tsx](src/components/ui/command.tsx)

**Breadcrumbs:**
- [src/components/ui/breadcrumbs.tsx](src/components/ui/breadcrumbs.tsx)

**Integration:**
- [src/components/layout/Header.tsx](src/components/layout/Header.tsx)
- [src/pages/PublicationDetail.tsx](src/pages/PublicationDetail.tsx)
- [src/pages/ToolDetailPage.tsx](src/pages/ToolDetailPage.tsx)
- [src/pages/CourseDetail.tsx](src/pages/CourseDetail.tsx)

---

## Changelog

### 2025-01-21 - Initial Release
- ✅ Įdiegta Global Search su Cmd+K
- ✅ Breadcrumbs komponentas
- ✅ Integruota į Header ir content pages
- ✅ Debounced search optimizacija
- ✅ Accessibility support
- ✅ SEO structured data
