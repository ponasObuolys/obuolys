# 🔧 Facebook Sharing Fix - SPA OG Tags problema

## 🎯 Problema

Facebook scraper **negali skaityti** React dynamic meta tags, nes:
1. SPA aplikacija naudoja client-side rendering
2. Facebook bot nemato JavaScript generated content
3. React-Helmet meta tags neveikia botams

**Rezultatas**: Facebook share rodo default OG tags iš `index.html`, ne specific content.

---

## ✅ Sprendimas 1: Vercel Bot Detection + Pre-rendering (REKOMENDUOJAMAS)

### Veikimo principas

Sukurti Vercel Edge Middleware, kuris:
1. Detektuoja Facebook/Social bot User-Agent
2. Pre-renders HTML su correct OG tags
3. Grąžina static HTML su metadata

### Implementacija

#### 1. Sukurti `api/_middleware.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';

const SOCIAL_BOTS = [
  'facebookexternalhit',
  'Facebot',
  'Twitterbot',
  'LinkedInBot',
  'WhatsApp',
];

export async function middleware(req: NextRequest) {
  const ua = req.headers.get('user-agent') || '';
  const isBot = SOCIAL_BOTS.some(bot => ua.includes(bot));

  if (!isBot) return NextResponse.next();

  // Generate pre-rendered HTML
  const url = new URL(req.url);
  const response = await fetch(`${url.origin}/api/prerender${url.pathname}`);
  const html = await response.text();

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}
```

#### 2. Sukurti `api/prerender.ts`

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const path = req.query.path as string;

  // Fetch content from Supabase
  const content = await fetchContent(path);

  if (!content) {
    return res.status(404).send('Not found');
  }

  // Generate HTML with OG tags
  const html = `<!DOCTYPE html>
<html lang="lt">
<head>
  <meta charset="UTF-8">
  <meta property="og:title" content="${content.title}">
  <meta property="og:description" content="${content.description}">
  <meta property="og:image" content="${content.image_url}">
  <meta property="og:url" content="https://ponasobuolys.lt${path}">
  <meta property="og:type" content="article">
  <meta name="twitter:card" content="summary_large_image">
  <title>${content.title}</title>
</head>
<body>
  <script>window.location.href = "https://ponasobuolys.lt${path}";</script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
}
```

---

## ✅ Sprendimas 2: Prerender.io Integration (GREIČIAUSIAS)

### Setup

```bash
npm install prerender-node
```

### vercel.json

```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/api/prerender?path=$1"
    }
  ]
}
```

### api/prerender.js

```javascript
const prerender = require('prerender-node');

prerender.set('prerenderToken', process.env.PRERENDER_TOKEN);

module.exports = (req, res) => {
  if (prerender.shouldShowPrerenderedPage(req)) {
    prerender.prerenderRequest(req, res);
  } else {
    // Serve normal SPA
    res.sendFile('dist/index.html');
  }
};
```

---

## ✅ Sprendimas 3: React-Snap (BUILD-TIME PRE-RENDERING)

### Install

```bash
npm install --save-dev react-snap
```

### package.json

```json
{
  "scripts": {
    "postbuild": "react-snap"
  },
  "reactSnap": {
    "include": [
      "/",
      "/publikacijos/*",
      "/kursai/*",
      "/irankiai/*"
    ],
    "puppeteerArgs": ["--no-sandbox"],
    "waitFor": 1000
  }
}
```

---

## ✅ Sprendimas 4: Manual OG Image Generation (WORKAROUND)

Jei negalime įdiegti pre-rendering, galime naudoti:

### Vercel OG Image Generation

Sukurti dynamic OG images per Vercel Edge Functions.

#### api/og-image.tsx

```tsx
import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') || 'ponas Obuolys';
  const description = searchParams.get('description') || 'AI naujienos';

  return new ImageResponse(
    (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '40px',
      }}>
        <h1 style={{ fontSize: '64px', color: 'white' }}>{title}</h1>
        <p style={{ fontSize: '32px', color: '#f0f0f0' }}>{description}</p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
```

#### index.html meta tags

```html
<meta property="og:image" content="https://ponasobuolys.lt/api/og-image?title=...&description=...">
```

---

## 🚀 Rekomenduojamas implementacijos kelias

### Greičiausias (5 min):
**Sprendimas 4** - OG Image Generation

### Geriausias long-term (30 min):
**Sprendimas 2** - Prerender.io

### DIY Solution (2h):
**Sprendimas 1** - Custom Edge Middleware

---

## 🧪 Testavimas

### Facebook Debugger

```
https://developers.facebook.com/tools/debug/
```

1. Įveskite URL: `https://ponasobuolys.lt/publikacijos/dirbtinio-intelekto-dalgis-pjauna-darbo-vietas`
2. Spauskite "Scrape Again"
3. Patikrinkite ar OG tags teisingi

### Manual curl test

```bash
curl -A "facebookexternalhit/1.1" https://ponasobuolys.lt/publikacijos/dirbtinio-intelekto-dalgis-pjauna-darbo-vietas
```

Turėtų grąžinti HTML su correct OG tags.

---

## 📊 Sprendimų palyginimas

| Sprendimas | Sudėtingumas | Laikas | SEO | Cost |
|------------|--------------|--------|-----|------|
| **Prerender.io** | ⭐ | 5 min | ⭐⭐⭐⭐⭐ | $$ |
| **React-Snap** | ⭐⭐ | 15 min | ⭐⭐⭐⭐ | Free |
| **Custom Middleware** | ⭐⭐⭐⭐ | 2h | ⭐⭐⭐⭐⭐ | Free |
| **OG Image Only** | ⭐ | 5 min | ⭐⭐⭐ | Free |

---

## ❓ Kurį sprendimą pasirinkti?

**Dabar tuojau pat**: Sprendimas 4 (OG Image)
**Production long-term**: Sprendimas 2 (Prerender.io)

Norite, kad įgyvendinčiau vieną iš šių sprendimų?
