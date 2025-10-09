# 🚀 Prerender.io Setup su Vercel

## ✅ Setup Steps

### 1. Pridėti Prerender Token į Vercel

Eikite į Vercel Dashboard → Settings → Environment Variables:

```
Key: PRERENDER_TOKEN
Value: D9EDsSifvfj3S7qLPh0T
```

### 2. Naudoti Vercel Headers Integration

Kadangi Vercel nepalaiko traditional middleware Vite projektams, naudosime **Cloudflare Workers arba simple HTML meta tag approach**.

---

## 🎯 GREIČIAUSIAS Sprendimas: Prerender.io CDN Integration

Naudoti Prerender.io per CDN (jei naudojate Cloudflare arba kitą CDN).

### Jei NENAUDOJATE CDN:

Naudokite **HTML `<meta>` tag** approach:

#### index.html

```html
<head>
  <!-- Prerender.io fragment meta tag -->
  <meta name="fragment" content="!">

  <!-- Existing meta tags -->
  ...
</head>
```

Tada Prerender.io automatiškai detektuos ir pre-renders pages su `#!` fragments.

---

## ✅ RECOMMENDED: Use Vercel Rewrites with Conditional Logic

Since we can't use middleware in Vite, we'll use a different approach:

### Create `api/_prerender.js`

```javascript
const PRERENDER_TOKEN = 'D9EDsSifvfj3S7qLPh0T';
const PRERENDER_URL = 'https://service.prerender.io';

const CRAWLERS = /googlebot|bingbot|yandex|baiduspider|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest|slackbot|vkshare|w3c_validator|whatsapp/i;

export default async function handler(req, res) {
  const ua = req.headers['user-agent'] || '';

  if (!CRAWLERS.test(ua)) {
    // Not a bot, serve normal SPA
    return res.redirect(307, '/');
  }

  // Bot detected, fetch from Prerender.io
  const url = `https://${req.headers.host}${req.url.replace('/api/_prerender', '')}`;

  try {
    const response = await fetch(`${PRERENDER_URL}/${url}`, {
      headers: {
        'X-Prerender-Token': PRERENDER_TOKEN,
      },
    });

    const html = await response.text();

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (error) {
    console.error('Prerender error:', error);
    return res.redirect(307, '/');
  }
}
```

### Update `vercel.json`

```json
{
  "rewrites": [
    {
      "source": "/publikacijos/:slug",
      "has": [
        {
          "type": "header",
          "key": "user-agent",
          "value": ".*(bot|crawler|spider|facebookexternalhit|twitterbot).*"
        }
      ],
      "destination": "/api/_prerender?url=/publikacijos/:slug"
    },
    {
      "source": "/kursai/:slug",
      "has": [
        {
          "type": "header",
          "key": "user-agent",
          "value": ".*(bot|crawler|spider|facebookexternalhit|twitterbot).*"
        }
      ],
      "destination": "/api/_prerender?url=/kursai/:slug"
    },
    {
      "source": "/irankiai/:slug",
      "has": [
        {
          "type": "header",
          "key": "user-agent",
          "value": ".*(bot|crawler|spider|facebookexternalhit|twitterbot).*"
        }
      ],
      "destination": "/api/_prerender?url=/irankiai/:slug"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 🔄 EASIEST: Use Prerender.io DNS/CDN Setup

Jei sunku integruoti per Vercel, naudokite Prerender.io **Cloudflare Workers** integration:

1. Eikite į Cloudflare Dashboard
2. Workers → Create Worker
3. Copy Prerender.io Worker script
4. Deploy

---

## 🧪 Testing

### 1. Test with curl (simulate Facebook bot)

```bash
curl -A "facebookexternalhit/1.1" https://www.ponasobuolys.lt/publikacijos/dirbtinio-intelekto-dalgis-pjauna-darbo-vietas
```

Turėtų grąžinti pre-rendered HTML su correct OG tags.

### 2. Facebook Debugger

```
https://developers.facebook.com/tools/debug/
```

Paste URL: `https://www.ponasobuolys.lt/publikacijos/dirbtinio-intelekto-dalgis-pjauna-darbo-vietas`

Click "Scrape Again"

---

## ✅ Recommended Path

**Greičiausias ir paprasčiausias**:

1. Setup Prerender.io account (jau turite)
2. Add domain to Prerender.io dashboard
3. Use Cloudflare Workers integration (if using Cloudflare)
4. OR: Deploy Vercel API function with rewrites (see above)

Norite, kad įgyvendinčiau konkretų sprendimą?
