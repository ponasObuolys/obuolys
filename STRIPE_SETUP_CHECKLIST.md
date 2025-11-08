# ✅ Stripe Mokėjimo Sistema - Setup Checklist

## 🎯 Kas buvo padaryta?

Sėkmingai integruota Stripe mokėjimo sistema kursui "KAIP PRADĖTI PROGRAMUOTI SU DI".

### ✅ Sukurti failai

```
src/
├── config/stripe.ts                      # Stripe konfigūracija ir kainų logika
├── hooks/useCoursePurchase.ts            # Custom hook Checkout sesijos kūrimui
├── components/course/
│   └── CoursePurchaseCard.tsx            # Pirkimo kortelė su dinamiškomis kainomis
├── pages/
│   └── CoursePaymentSuccess.tsx          # Sėkmingo mokėjimo puslapis

api/
└── create-checkout-session.js            # Vercel serverless API endpoint

docs/
├── STRIPE_INTEGRATION.md                 # Pilna techninė dokumentacija
└── STRIPE_SETUP_CHECKLIST.md            # Šis failas
```

### ✅ Atnaujinti failai

- `src/App.tsx` - pridėtas `/kursai/mokejimas-sekmingas` route
- `src/pages/CourseDetail.tsx` - integruotas `CoursePurchaseCard` komponentas

### ✅ Duomenų bazė

- Sukurta `course_purchases` lentelė su RLS politikomis
- 7 indeksai greičiui
- Trigger `updated_at` laukui

---

## 🚀 Setup Instrukcijos

### 1. Environment Variables

**Pridėkite į `.env` failą:**

```bash
# Stripe Frontend (Vite prefix būtinas!)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51SRBKQjLP0H1tP3DjYourPublishableKeyHere

# Stripe Backend (Vercel serverless funkcijoms)
STRIPE_SECRET_KEY=sk_live_51SRBKQjLP0H1tP3DjYourSecretKeyHere
```

**⚠️ SVARBU:**
- Frontend: Naudokite `VITE_` prefix!
- Backend: Be prefix
- Niekada necommit'inkite `.env` failo!

### 2. Vercel Deployment

**Nustatykite Production Environment Variables Vercel Dashboard:**

1. Eikite: https://vercel.com/your-project/settings/environment-variables
2. Pridėkite:
   - **Name:** `VITE_STRIPE_PUBLISHABLE_KEY`
   - **Value:** `pk_live_...` (iš Stripe Dashboard)
   - **Environment:** Production

3. Pridėkite:
   - **Name:** `STRIPE_SECRET_KEY`
   - **Value:** `sk_live_...` (iš Stripe Dashboard)
   - **Environment:** Production

4. **Redeploy** projektą Vercel, kad pritaikytų naujus kintamuosius

### 3. Stripe Dashboard Setup

**Patikrinkite ar Stripe Dashboard turi:**

✅ Produktą: "KAIP PRADĖTI PROGRAMUOTI SU DI" (`prod_TNxxapWX108lqE`)

✅ 4 Kainas:
1. `price_1SRC1QLP0H1tP3DjR1FRtzNX` - 97€ (Iki lapkričio 10 d.)
2. `price_1SRC2uLP0H1tP3DjZYEK5R7z` - 117€ (Lapkričio 11-17 d.)
3. `price_1SRC2uLP0H1tP3Djb7k6VkSv` - 137€ (Lapkričio 18-21 d.)
4. `price_1SRC2uLP0H1tP3DjybonjssY` - 147€ (Kurso dieną)

✅ Email notifikacijos įjungtos (Settings → Emails)

### 4. Testavimas

**Development Mode (Test):**

1. Naudokite test keys:
   - `pk_test_...`
   - `sk_test_...`

2. Test kortelė:
   - Numeris: `4242 4242 4242 4242`
   - CVC: `123`
   - Data: `12/34`

3. Testuokite srautą:
   ```
   /kursai/kaip-pradeti-programuoti-su-di
   → Spauskite "Įsigyti kursą"
   → Užpildykite test kortelę
   → Patikrinkite ar nukreipia į success puslapį
   → Patikrinkite ar nukreipia į Google Form
   ```

**Production Mode:**

1. Pakeiskite į live keys
2. Išbandykite su tikra kortele (mažą sumą)
3. Patikrinkite Stripe Dashboard transactions

---

## 📋 Pre-Launch Checklist

Prieš paleidžiant production, patikrinkite:

### Frontend
- [ ] `VITE_STRIPE_PUBLISHABLE_KEY` nustatytas `.env`
- [ ] `VITE_STRIPE_PUBLISHABLE_KEY` nustatytas Vercel
- [ ] Kurso ID teisingas: `3a107f1a-9c87-4291-bf90-6adf854b2116`
- [ ] Visos 4 kainos rodomos kortelėje
- [ ] Dabartinė kaina paženklinta (highlight)

### Backend
- [ ] `STRIPE_SECRET_KEY` nustatytas Vercel
- [ ] API endpoint `/api/create-checkout-session` veikia
- [ ] CORS headers sukonfigūruoti
- [ ] Success URL teisingas: `/kursai/mokejimas-sekmingas`

### Database
- [ ] `course_purchases` lentelė sukurta
- [ ] RLS politikos įjungtos
- [ ] Indeksai sukurti
- [ ] Service roleturi INSERT prieigą (webhook)

### Google Form
- [ ] Form URL teisingas: `https://forms.gle/WVZfhQbikxDcSxtS6`
- [ ] Form prieinamas (public)
- [ ] Automatinis redirect veikia po 5 sek

### Stripe
- [ ] Produktas aktyvus
- [ ] Visos 4 kainos aktyvios
- [ ] Email notifikacijos įjungtos
- [ ] Payment methods: Card enabled
- [ ] Billing address collection: enabled

### Testing
- [ ] Test mode veikia su test kortelėmis
- [ ] Success puslapis rodo teisingą informaciją
- [ ] Google Form redirect veikia
- [ ] Error handling veikia (atšaukus mokėjimą)

---

## 🔍 Kaip Patikrinti ar Veikia?

### 1. Kainų Logika

```bash
# Tiesiog atidarykite kurso puslapį
https://yourdomain.com/kursai/kaip-pradeti-programuoti-su-di

# Turėtumėte matyti:
# - Dabartinę kainą su badge (jei yra nuolaida)
# - "Kainų grafikas" su visomis 4 kainomis
# - Aktyvus periodas paženklinas
# - Praeję periodai perbraukti
```

### 2. Mokėjimo Srautas

```bash
# 1. Spauskite "Įsigyti kursą"
# 2. Turėtų nukreipti į Stripe Checkout
# 3. URL pradžia: https://checkout.stripe.com/c/pay/cs_...
# 4. Užpildykite kortelės duomenis
# 5. Po sėkmingo mokėjimo → /kursai/mokejimas-sekmingas
# 6. Po 5 sek → Google Form
```

### 3. Database Records

```sql
-- Patikrinkite ar pirkimas išsaugotas
SELECT * FROM course_purchases
WHERE course_id = '3a107f1a-9c87-4291-bf90-6adf854b2116'
ORDER BY created_at DESC
LIMIT 10;
```

---

## 🐛 Troubleshooting

### Klaida: "VITE_STRIPE_PUBLISHABLE_KEY is not defined"

**Sprendimas:**
```bash
# Patikrinkite .env failą
cat .env | grep STRIPE

# Turėtų būti:
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Jei nėra - pridėkite ir restart dev server
npm run dev
```

### Klaida: "Cannot create checkout session"

**Sprendimas:**
1. Patikrinkite Vercel logs: `vercel logs`
2. Patikrinkite ar `STRIPE_SECRET_KEY` nustatytas Vercel
3. Patikrinkite ar price ID teisingas `/src/config/stripe.ts`

### Klaida: "Payment succeeded but no redirect"

**Sprendimas:**
1. Patikrinkite Stripe Checkout session config
2. `success_url` turi būti: `{origin}/kursai/mokejimas-sekmingas?session_id={CHECKOUT_SESSION_ID}`
3. Patikrinkite ar route registruotas `src/App.tsx`

### Kurso puslapis rodo seną Patreon mygtuką

**Sprendimas:**
1. Patikrinkite kurso ID DB:
   ```sql
   SELECT id, title, slug FROM courses
   WHERE slug = 'kaip-pradeti-programuoti-su-di';
   ```
2. Atnaujinkite `CourseDetail.tsx` su teisingiu ID

### Google Form nesirodo

**Sprendimas:**
1. Patikrinkite URL: `https://forms.gle/WVZfhQbikxDcSxtS6`
2. Atidarykite formą naujame lange - ar veikia?
3. Atnaujinkite `GOOGLE_FORM_URL` `/src/pages/CoursePaymentSuccess.tsx`

---

## 📞 Pagalba

**Techninė dokumentacija:** `/STRIPE_INTEGRATION.md`

**Stripe Dashboard:** https://dashboard.stripe.com
**Stripe Docs:** https://stripe.com/docs/payments/checkout
**Vercel Dashboard:** https://vercel.com/dashboard
**Supabase Dashboard:** https://supabase.com/dashboard

---

**Status:** ✅ Implementacija baigta
**Data:** 2025-11-08
**Versija:** 1.0.0

## 🎉 Next Steps

1. ✅ Pridėkite environment variables
2. ✅ Deploy į Vercel
3. ✅ Testuokite su test kortelėmis
4. ✅ Testuokite su tikra kortele (mažą sumą)
5. ✅ Paleiskite production!

**Good luck! 🚀**
