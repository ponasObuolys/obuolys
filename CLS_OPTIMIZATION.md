# CLS (Cumulative Layout Shift) Optimizacijos

## Problema
Google Search Console pranešė apie **CLS 0.64** (Blogai: > 0.25, Norma: < 0.1), dėl ko puslapiai neindeksuojami.

## Atliktos optimizacijos

### 1. ✅ Font Loading Optimizacija
**Problema**: Google Fonts be `font-display: swap` sukelia FOIT (Flash of Invisible Text)

**Sprendimas** ([index.html](index.html)):
```html
<!-- Preload critical fonts -->
<link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" as="style">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

### 2. ✅ LazyImage komponentas su eksplicitiniais dimensions
**Problema**: Paveiksliukai kraunasi be nustatyto dydžio, sukeldami layout shifts

**Sprendimas** ([src/components/ui/lazy-image.tsx](src/components/ui/lazy-image.tsx)):
```tsx
<LazyImage
  src="/image.jpg"
  alt="Description"
  width={800}           // Explicit width
  height={600}          // Explicit height
  aspectRatio="16/9"    // OR use aspect ratio
/>
```

**Naudojimo pavyzdžiai**:
```tsx
// 1. Su explicit dimensions (rekomenduojama)
<LazyImage
  src="/hero.jpg"
  alt="Hero"
  width={1920}
  height={1080}
/>

// 2. Su aspect ratio (responsive)
<LazyImage
  src="/article.jpg"
  alt="Article"
  aspectRatio="16/9"
  className="w-full"
/>

// 3. Priority images (LCP optimization)
<LazyImage
  src="/hero.jpg"
  alt="Hero"
  priority={true}
  width={1920}
  height={1080}
/>
```

### 3. ✅ CSS Containment
**Problema**: Animacijos ir hover efektai gali sukelti layout shifts

**Sprendimas** ([src/index.css](src/index.css)):
```css
.animate-glow {
  contain: layout style paint;
  will-change: transform, opacity, filter;
}

.project-card {
  contain: layout style paint;
}
```

### 4. ✅ Skeleton Loaders
**Problema**: Dinaminis turinys kraunasi be rezervuotos vietos

**Sprendimas** ([src/components/ui/content-skeleton.tsx](src/components/ui/content-skeleton.tsx)):

**Naudojimo pavyzdžiai**:
```tsx
import { ArticleCardSkeleton, ListSkeleton } from '@/components/ui/content-skeleton';

// Articles list page
const ArticlesPage = () => {
  const { data: articles, isLoading } = useQuery('articles', fetchArticles);

  if (isLoading) {
    return <ListSkeleton count={6} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map(article => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
};

// Article detail page
import { ArticleDetailSkeleton } from '@/components/ui/content-skeleton';

const ArticleDetail = () => {
  const { data: article, isLoading } = useQuery('article', fetchArticle);

  if (isLoading) {
    return <ArticleDetailSkeleton />;
  }

  return <ArticleContent article={article} />;
};
```

**Prieinami skeleton komponentai**:
- `ArticleCardSkeleton` - straipsnių kortelėms
- `ToolCardSkeleton` - įrankių kortelėms
- `CourseCardSkeleton` - kursų kortelėms
- `HeroSectionSkeleton` - hero sekcijai
- `ArticleDetailSkeleton` - straipsnio detaliam puslapiui
- `ListSkeleton` - sąrašams su custom count

### 5. ✅ Min-Height konteinerių optimizacija
**Problema**: Tuščias konteineris "šokinėja" užsikraunant

**Sprendimas** ([src/index.css](src/index.css)):
```css
body, #root {
  min-height: 100vh;
  min-height: 100dvh; /* Mobile viewport */
}
```

## Rekomendacijos naudojimui

### Priority Images (LCP Optimization)
Pirmiausiai matomus paveiksliukus (above-the-fold) žymėkite kaip `priority`:
```tsx
<LazyImage
  src="/hero-image.jpg"
  alt="Hero"
  priority={true}      // Loads immediately, not lazy
  width={1920}
  height={1080}
/>
```

### Aspect Ratio vs Explicit Dimensions
- **Responsive dizainai**: naudokite `aspectRatio="16/9"`
- **Fixed dydžiai**: naudokite `width` ir `height`
- **Always provide dimensions** - bent vieną iš šių!

### Skeleton Loaders Integration
Kiekviename puslapyje su dynamic content naudokite skeleton loaders:

```tsx
const MyPage = () => {
  const { data, isLoading } = useQuery(...);

  // ✅ GERAI - rezervuoja vietą
  if (isLoading) return <ListSkeleton count={6} />;

  // ❌ BLOGAI - tuščias state, sukelia layout shift
  if (isLoading) return <div>Loading...</div>;

  return <Content data={data} />;
};
```

## Testavimas

### Lighthouse (Chrome DevTools)
```bash
# 1. Atidaryti Chrome DevTools (F12)
# 2. Performance tab → Lighthouse
# 3. Generate report (Mobile)
# 4. Tikrinti CLS metriką
```

**Tikslas**: CLS < 0.1 (Žalias)

### Web Vitals
```bash
npm run dev
# Atidaryti puslapį ir pažiūrėti Console
# Web Vitals automatiškai logina CLS, LCP, FID
```

### Real User Monitoring (Vercel Analytics)
- Vercel Dashboard → Analytics → Web Vitals
- Stebėti CLS metrikas production aplinkoje
- Tikslas: 75th percentile < 0.1

## Checklist prieš deploy

- [ ] Visi LazyImage turi `width`/`height` arba `aspectRatio`
- [ ] Priority images turi `priority={true}`
- [ ] Skeleton loaders naudojami loading states
- [ ] Fonts preloaded su `display=swap`
- [ ] Animacijos turi `contain: layout`
- [ ] Min-height nustatytas konteinerių
- [ ] Lighthouse CLS < 0.1
- [ ] Mobile CLS < 0.1

## Rezultatai

**Prieš optimizaciją**:
- CLS: 0.64 (Poor)
- 17 URLs su problemomis
- Google neindeksuoja

**Po optimizacijos** (tikėtina):
- CLS: < 0.1 (Good)
- Visi URLs indexable
- Geresnis SEO ranking

## Additional Resources

- [Web Vitals](https://web.dev/vitals/)
- [CLS Debug Guide](https://web.dev/cls/)
- [Image Best Practices](https://web.dev/image-component/)
- [Font Loading](https://web.dev/font-best-practices/)
