# Temos Sistema (Light/Dark Theme)

## Apžvalga

Projekte įdiegta visapusiška light/dark temos sistema su automatinio prisitaikymo prie sistemos nustatymų galimybe.

## Funkcionalumas

### Temos Režimai
- **🌞 Šviesi (Light)** - Šviesus fonas su tamsiu tekstu, geresnė skaitomybė dienos metu
- **🌙 Tamsi (Dark)** - Tamsus fonas su šviesiu tekstu, mažiau vargina akis tamsioje aplinkoje
- **💻 Sistema (System)** - Automatiškai prisitaiko prie įrenginio sistemos nustatymų

### Pagrindinės Savybės
- ✅ Vartotojo pasirinkimas išsaugomas `localStorage`
- ✅ Automatinis prisitaikymas prie sistemos temos keitimo
- ✅ Sklandus perjungimas tarp temų be puslapio perkrovimo
- ✅ Visi komponentai adaptuoti abiem temoms
- ✅ WCAG AA kontrastingumo standartai

## Architektūra

### 1. Theme Context ([src/context/ThemeContext.tsx](src/context/ThemeContext.tsx))

Pagrindinis temos būsenos valdymas:

```typescript
interface ThemeContextType {
  theme: "light" | "dark" | "system";
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark"; // Faktiškai pritaikyta tema
}
```

**Funkcionalumas:**
- Temos būsenos saugojimas `localStorage` su raktu `obuolys-theme-preference`
- Sistema temos nustatymo aptikimas per `window.matchMedia`
- Sistemos temos pasikeitimų klausymas ir automatinis atnaujinimas
- Temos pritaikymas į `<html>` elemento klasę (`light` arba `dark`)

### 2. Theme Toggle Component ([src/components/ui/theme-toggle.tsx](src/components/ui/theme-toggle.tsx))

Temos perjungimo mygtukas su dropdown meniu:

```tsx
<ThemeToggle />
```

**Funkcijos:**
- Dropdown meniu su 3 pasirinkimais (Šviesi/Tamsi/Sistema)
- Animuoti saulės/mėnulio ikonos
- Pažymėjimas aktyvios temos
- Lietuviška sąsaja

**Integruota:**
- Desktop: Header navigacijoje tarp įrankių ir "Paremti" mygtuko
- Mobile: Atskirame skyriuje mobile menu su "Tema" antrašte

### 3. CSS Variables ([src/index.css](src/index.css))

#### Dark Theme (Default)
```css
:root {
  --background: 220 13% 8%;      /* Tamsus fonas */
  --foreground: 210 40% 96%;     /* Šviesus tekstas */
  --card: 220 13% 12%;           /* Kortelių fonas */
  --primary: 262 83% 58%;        /* Purple accent */
  --accent: 142 76% 36%;         /* Green accent */
  /* ... kitos spalvos */
}
```

#### Light Theme
```css
.light {
  --background: 0 0% 98%;        /* Šviesus fonas */
  --foreground: 222.2 47.4% 11.2%; /* Tamsus tekstas */
  --card: 0 0% 100%;             /* Baltas kortelių fonas */
  --border: 220 13% 91%;         /* Šviesios kraštinės */
  /* ... kitos spalvos */
}
```

### 4. Tailwind Configuration ([tailwind.config.ts](tailwind.config.ts))

```typescript
export default {
  darkMode: ["class"], // Naudojama klasių strategija
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        // ... kitos dinaminės spalvos
      }
    }
  }
}
```

## Spalvų Sistema

### Semantinės Spalvos

| Tailwind Klasė | Paskirtis | Dark Mode | Light Mode |
|----------------|-----------|-----------|------------|
| `bg-background` | Pagrindinis fonas | Tamsus | Šviesus |
| `bg-card` | Kortelių fonas | Tamsesnis | Baltas |
| `bg-muted` | Antraeiliai elementai | Vidutinis | Pilkas |
| `text-foreground` | Pagrindinis tekstas | Šviesus | Tamsus |
| `text-muted-foreground` | Antraeilis tekstas | Pilkas | Tamsesnis pilkas |
| `border-border` | Kraštinės | Tamsi | Šviesiai pilka |

### Spalvų Naudojimas

```tsx
// ✅ Teisingai - naudoja semantines spalvas
<div className="bg-card text-foreground border-border">
  <h1 className="text-foreground">Antraštė</h1>
  <p className="text-foreground/90">Tekstas su 90% opacity</p>
</div>

// ❌ Neteisingai - hardcoded spalvos
<div className="bg-gray-900 text-white">
  <h1 className="text-gray-100">Antraštė</h1>
</div>
```

## Komponentų Pritaikymas

### Pritaikyta (16 failų)

**Homepage Komponentai:**
- [src/components/home/Hero.tsx](src/components/home/Hero.tsx)
- [src/components/home/FeaturedArticles.tsx](src/components/home/FeaturedArticles.tsx)
- [src/components/home/AITools.tsx](src/components/home/AITools.tsx)
- [src/components/home/CallToAction.tsx](src/components/home/CallToAction.tsx)

**UI Komponentai:**
- [src/components/ui/article-card.tsx](src/components/ui/article-card.tsx)
- [src/components/ui/tool-card.tsx](src/components/ui/tool-card.tsx)
- [src/components/ui/course-card.tsx](src/components/ui/course-card.tsx)
- [src/components/ui/tool-detail-card.tsx](src/components/ui/tool-detail-card.tsx)

**Layout:**
- [src/components/layout/Header.tsx](src/components/layout/Header.tsx) - su theme toggle
- [src/components/layout/Footer.tsx](src/components/layout/Footer.tsx)

**Puslapiai:**
- [src/pages/ArticlesPage.tsx](src/pages/ArticlesPage.tsx)
- [src/pages/CoursesPage.tsx](src/pages/CoursesPage.tsx)
- [src/pages/ToolDetailPage.tsx](src/pages/ToolDetailPage.tsx)
- [src/components/widgets/trending-articles.tsx](src/components/widgets/trending-articles.tsx)

**Sistema:**
- [src/index.css](src/index.css)
- [src/App.tsx](src/App.tsx)

### Liko Nepritaikyta (Admin panelė)

Admin komponentai bus pritaikomi atskirai, nes jie:
- Pasiekiami tik administratoriams
- Mažesnė įtaka vartotojų patirčiai
- Reikia atskirų testavimų

## Naudojimas Kode

### useTheme Hook

```tsx
import { useTheme } from '@/hooks/useTheme';

function MyComponent() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <div>
      <p>Dabartinė tema: {theme}</p>
      <p>Pritaikyta tema: {resolvedTheme}</p>

      <button onClick={() => setTheme('light')}>Šviesi</button>
      <button onClick={() => setTheme('dark')}>Tamsi</button>
      <button onClick={() => setTheme('system')}>Sistema</button>
    </div>
  );
}
```

### Sąlyginės Klasės

```tsx
import { useTheme } from '@/hooks/useTheme';

function ConditionalStyling() {
  const { resolvedTheme } = useTheme();

  return (
    <div className={resolvedTheme === 'dark' ? 'shadow-lg' : 'shadow-md'}>
      Skirtingas šešėlis tamsiai ir šviesiai temai
    </div>
  );
}
```

## Testavimas

### Rankiniai Testai

1. **Theme Toggle Testas:**
   - Atidarykite puslapį
   - Paspauskite theme toggle mygtuką
   - Patikrinkite, ar tema pasikeičia sklandžiai

2. **Persistence Testas:**
   - Pakeiskite temą
   - Perkraukite puslapį
   - Tema turėtų išlikti pasirinkta

3. **System Theme Testas:**
   - Pasirinkite "Sistema" režimą
   - Pakeiskite OS temos nustatymus
   - Puslapis turėtų automatiškai atsinaujinti

4. **Visual Regression:**
   - Peržiūrėkite visus puslapius šviesoje ir tamsoje temoje
   - Patikrinkite kontrastingumą ir skaitomumą

### Automatiniai Testai

```typescript
// Pavyzdys Vitest testui
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@/context/ThemeContext';
import MyComponent from './MyComponent';

describe('Theme System', () => {
  it('applies light theme correctly', () => {
    render(
      <ThemeProvider>
        <MyComponent />
      </ThemeProvider>
    );

    expect(document.documentElement).toHaveClass('light');
  });
});
```

## Browser Support

- ✅ Chrome/Edge 88+
- ✅ Firefox 85+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Android)

**Media Query Support:**
- Modern browsers: `addEventListener` API
- Legacy browsers: `addListener` API (fallback)

## Performance

- **Bundle Size:** ~21KB (theme-CvaZdMms.js)
- **Initial Load:** Tema pritaikoma iš karto (no flash)
- **localStorage:** Minimalus poveikis
- **Re-renders:** Optimizuotas Context su React.memo

## Accessibility

- ✅ Klaviatūros navigacija (Tab, Enter)
- ✅ Screen reader support (`sr-only` labels)
- ✅ WCAG AA kontrastas abiejose temose
- ✅ Prefers-color-scheme palaikymas
- ✅ Fokuso indikatoriai

## Troubleshooting

### Flash of Unstyled Content (FOUC)

**Problem:** Puslapyje matomas trumpas nesuformatuotos temos šviesos blyksnis.

**Sprendimas:** ThemeProvider pritaikomas temas iš karto montavimo metu per `useEffect`.

### localStorage Not Working

**Problem:** Tema nėra išsaugoma tarp sesijų.

**Sprendimas:** Patikrinkite browser privacy settings (localStorage enabled).

### System Theme Not Detected

**Problem:** "Sistema" režimas neatpažįsta OS temos.

**Sprendimas:**
- Patikrinkite browser support (Chrome 76+, Firefox 67+)
- Įsitikinkite, kad OS turi temos nustatymus

## Ateities Tobulinimas

- [ ] Pridėti daugiau spalvų schemų (pvz., "High Contrast")
- [ ] Admin panelės komponentų pritaikymas
- [ ] Temos peržiūra admin settings
- [ ] Automatinis temos keitimas pagal laiką (sunset/sunrise)
- [ ] Custom accent spalvos pasirinkimas

## Susijusios Bylos

- [src/context/theme-context.ts](src/context/theme-context.ts) - Type definitions
- [src/context/ThemeContext.tsx](src/context/ThemeContext.tsx) - Provider implementation
- [src/hooks/useTheme.ts](src/hooks/useTheme.ts) - Custom hook
- [src/components/ui/theme-toggle.tsx](src/components/ui/theme-toggle.tsx) - Toggle component
- [tailwind.config.ts](tailwind.config.ts) - Tailwind configuration
- [src/index.css](src/index.css) - CSS variables

## Changelog

### 2025-01-21 - Initial Release
- ✅ Įdiegta ThemeContext sistema
- ✅ Sukurtas ThemeToggle komponentas
- ✅ Pritaikyti visi user-facing komponentai
- ✅ Pridėtas localStorage persistance
- ✅ Pridėtas system theme detection
- ✅ Atnaujintos CSS variables šviesiai temai
