# Stripe Mokėjimo Integracija

## Apžvalga

Projektas integruotas su Stripe mokėjimų sistema kurso "KAIP PRADĖTI PROGRAMUOTI SU DI" pirkimui.

### Savybės

✅ Automatinis kainų valdymas pagal datą
✅ Stripe Checkout integracija
✅ Saugus mokėjimo srautas
✅ Automatinis nukreipimas į Google Forms po pirkimo
✅ Mokėjimų saugojimas Supabase duomenų bazėje
✅ Kainų grafikas su countdown

---

## Techninė Architektūra

### 1. **Stripe Produktas ir Kainos**

**Produktas:** `KAIP PRADĖTI PROGRAMUOTI SU DI`
**Product ID:** `prod_TNxxapWX108lqE`

**Kainos:**

| Periodas | Data | Kaina | Price ID | Nuolaida |
|----------|------|-------|----------|----------|
| Early Bird | Iki lapkričio 10 d. | 97€ | `price_1SRC1QLP0H1tP3DjR1FRtzNX` | -50€ |
| Mid Bird | Lapkričio 11-17 d. | 117€ | `price_1SRC2uLP0H1tP3DjZYEK5R7z` | -30€ |
| Late Bird | Lapkričio 18-21 d. | 137€ | `price_1SRC2uLP0H1tP3Djb7k6VkSv` | -10€ |
| Kurso diena | Lapkričio 22 d. | 147€ | `price_1SRC2uLP0H1tP3DjybonjssY` | 0€ |

### 2. **Duomenų Bazė**

**Lentelė:** `course_purchases`

```sql
CREATE TABLE course_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id),
  user_id UUID REFERENCES auth.users(id),

  -- Stripe
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  stripe_customer_id TEXT,

  -- Pirkimas
  amount_paid INTEGER NOT NULL, -- centais
  currency TEXT DEFAULT 'eur',
  price_tier TEXT NOT NULL,

  -- Klientas
  customer_email TEXT NOT NULL,
  customer_name TEXT,

  -- Statusas
  payment_status TEXT DEFAULT 'pending',

  -- Google Form
  google_form_submitted BOOLEAN DEFAULT false,
  google_form_submitted_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**RLS Politikos:**
- Vartotojai mato tik savo pirkimus
- Adminai mato visus pirkimus
- Service role gali įrašyti (webhook)

### 3. **Frontend Komponentai**

#### `/src/config/stripe.ts`
- Stripe konfigūracija
- Kainų valdymas pagal datą
- `getCurrentPrice()` - grąžina aktyvią kainą

#### `/src/hooks/useCoursePurchase.ts`
- Custom hook Checkout sesijos kūrimui
- API kvietimas į `/api/create-checkout-session`

#### `/src/components/course/CoursePurchaseCard.tsx`
- Pirkimo kortelė su kainų grafiku
- Countdown iki kitos kainos
- Stripe Checkout mygtukas

#### `/src/pages/CoursePaymentSuccess.tsx`
- Sėkmingo mokėjimo puslapis
- Automatinis nukreipimas į Google Forms po 5 sek
- Google Form URL: `https://forms.gle/WVZfhQbikxDcSxtS6`

#### `/src/pages/CourseDetail.tsx`
- Kurso detalių puslapis
- Sąlyginė logika: jei `course.id === '3a107f1a-9c87-4291-bf90-6adf854b2116'`
- Rodo `CoursePurchaseCard` vietoj senojo Patreon mygtuko

### 4. **Backend API**

#### `/api/create-checkout-session.js`
Vercel Serverless funkcija Stripe Checkout sesijos kūrimui.

**Request:**
```json
{
  "priceId": "price_1SRC1QLP0H1tP3DjR1FRtzNX",
  "courseId": "3a107f1a-9c87-4291-bf90-6adf854b2116",
  "userId": "uuid-or-null",
  "customerEmail": "user@example.com",
  "customerName": "Jonas Jonaitis"
}
```

**Response:**
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/c/pay/cs_test_..."
}
```

---

## Setup Instrukcijos

### 1. **Environment Variables**

Pridėkite į `.env` failą:

```bash
# Stripe (Frontend - Vite prefix)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Stripe (Backend - Vercel serverless)
STRIPE_SECRET_KEY=sk_live_...
```

⚠️ **SVARBU:** Niekada necommit'inkite `.env` failo su tikrais raktais!

### 2. **Vercel Deployment**

Nustatykite Vercel Environment Variables:

1. Eikite į Vercel Dashboard → Settings → Environment Variables
2. Pridėkite:
   - `VITE_STRIPE_PUBLISHABLE_KEY` (Production)
   - `STRIPE_SECRET_KEY` (Production)

### 3. **Stripe Webhook Setup** (Ateityje)

Jei norite automatiškai išsaugoti pirkimus į DB:

1. Sukurkite Stripe Webhook endpoint: `/api/stripe-webhook`
2. Klausykite `checkout.session.completed` event
3. Išsaugokite pirkimą į `course_purchases` lentelę

---

## Mokėjimo Srautas

```
1. Vartotojas → Kurso puslapis (/kursai/kaip-pradeti-programuoti-su-di)
   ↓
2. Pasirenka "Įsigyti kursą" mygtuką
   ↓
3. Frontend → POST /api/create-checkout-session
   ↓
4. Backend → Stripe API (create checkout session)
   ↓
5. Backend → Grąžina checkout URL
   ↓
6. Frontend → Nukreipia į Stripe Checkout
   ↓
7. Vartotojas → Užpildo mokėjimo informaciją Stripe
   ↓
8. Stripe → Apdoroja mokėjimą
   ↓
9. Stripe → Nukreipia į /kursai/mokejimas-sekmingas?session_id=...
   ↓
10. Success puslapis → Rodo sėkmės pranešimą
    ↓
11. Success puslapis → Po 5 sek nukreipia į Google Forms
    ↓
12. Vartotojas → Užpildo Google registracijos formą
```

---

## Testavimas

### Development Mode

Naudokite Stripe Test Mode:

1. Test Publishable Key: `pk_test_...`
2. Test Secret Key: `sk_test_...`
3. Test kortelė: `4242 4242 4242 4242` (Visa)
4. CVC: bet kokie 3 skaičiai
5. Data: bet kuri ateities data

### Production Mode

Prieš paleisdami production:

✅ Patikrinkite visus 4 price IDs
✅ Patikrinkite Google Form URL
✅ Išbandykite visą mokėjimo srautą
✅ Patikrinkite Stripe Dashboard notifikacijas

---

## Kainos Keitimas

Kainų logika automatiškai pasirenka tinkamą kainą pagal `new Date()`.

**Failas:** `/src/config/stripe.ts`

```typescript
export function getCurrentPrice() {
  const now = new Date();

  if (now <= COURSE_PRICES.earlyBird.endDate) {
    return COURSE_PRICES.earlyBird;
  }
  // ... ir t.t.
}
```

### Kaip Pridėti Naują Kainą?

1. Sukurkite naują kainą Stripe Dashboard
2. Pridėkite į `COURSE_PRICES` objektą `/src/config/stripe.ts`
3. Atnaujinkite `getCurrentPrice()` logiką

---

## Troubleshooting

### Klaida: "Cannot connect to Stripe"

**Sprendimas:**
- Patikrinkite ar `STRIPE_SECRET_KEY` nustatytas Vercel
- Patikrinkite ar API endpoint veikia: `/api/create-checkout-session`

### Klaida: "Invalid price ID"

**Sprendimas:**
- Patikrinkite ar price ID yra teisingas `/src/config/stripe.ts`
- Patikrinkite ar kaina aktyvi Stripe Dashboard

### Mokėjimas pavyko, bet neveikia redirect

**Sprendimas:**
- Patikrinkite Stripe Checkout `success_url` parametrą
- Turi būti: `{origin}/kursai/mokejimas-sekmingas?session_id={CHECKOUT_SESSION_ID}`

### Google Form nepasiekiamas

**Sprendimas:**
- Patikrinkite URL: `https://forms.gle/WVZfhQbikxDcSxtS6`
- Atnaujinkite `GOOGLE_FORM_URL` `/src/pages/CoursePaymentSuccess.tsx`

---

## Saugumo Praktikos

✅ **Frontend:**
- Tik publishable key (pk_...)
- Niekada secret key frontend kode

✅ **Backend:**
- Secret key tik serverless funkcijoje
- CORS apsauga
- Request validacija

✅ **Database:**
- RLS policies įjungtos
- Service role tik webhook'ams

✅ **Stripe:**
- Webhook signature verification (ateityje)
- HTTPS privalomas

---

## Pagrindiniai Failai

```
src/
├── config/
│   └── stripe.ts                    # Stripe konfigūracija
├── hooks/
│   └── useCoursePurchase.ts         # Checkout hook
├── components/
│   └── course/
│       └── CoursePurchaseCard.tsx   # Pirkimo kortelė
├── pages/
│   ├── CourseDetail.tsx             # Kurso puslapis
│   └── CoursePaymentSuccess.tsx     # Success puslapis
api/
└── create-checkout-session.js       # Serverless API
```

---

## Kontaktai ir Pagalba

**Stripe Dashboard:** https://dashboard.stripe.com
**Stripe Docs:** https://stripe.com/docs/payments/checkout
**Google Form:** https://forms.gle/WVZfhQbikxDcSxtS6

---

**Paskutinis atnaujinimas:** 2025-11-08
**Versija:** 1.0.0
