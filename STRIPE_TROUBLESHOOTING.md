# Stripe 500 Klaidos Sprendimas

## Problema
API endpoint `/api/create-checkout-session` grąžina 500 klaidą.

## Tikėtina Priežastis
**Vercel deployment'e neįkelti environment variables.**

Nors `.env` faile yra Stripe raktai, Vercel platformoje juos reikia nustatyti atskirai.

## Sprendimas: Nustatyti Vercel Environment Variables

### 1. Vercel Dashboard Setup

1. Eikite į: https://vercel.com/[your-username]/obuolys/settings/environment-variables

2. Pridėkite šiuos kintamuosius:

#### Frontend (su VITE_ prefix)
```
Name: VITE_STRIPE_PUBLISHABLE_KEY
Value: pk_live_51SRBK4LP0H1tP3DjprmpxTOHAiX9hItshZSsqAH3LgZgzysdumvq20R6VQvSeQLTkAZp9MHCpKn9LW7hvFBprkCd00FSvprkvu
Environment: Production, Preview, Development
```

#### Backend (BE prefix)
```
Name: STRIPE_SECRET_KEY
Value: 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
Environment: Production, Preview, Development
```

3. **SVARBU**: Po environment variables pridėjimo, reikia **Redeploy** projektą:
   - Eikite į Deployments tab
   - Pasirinkite paskutinį deployment
   - Spauskite "Redeploy" mygtuką

### 2. Lokalus Testavimas

Prieš tikrinant Vercel, patikrinkite ar veikia lokaliame serveryje:

```bash
# 1. Paleiskite dev serverį
npm run dev

# 2. Naršyklėje atidarykite:
http://localhost:8080/kursai/kaip-pradeti-programuoti-su-di

# 3. Spauskite "Įsigyti kursą" mygtuką

# 4. Patikrinkite Console (F12):
# - Turėtumėte matyti redirect į Stripe Checkout
# - Jei klaida, pamatysite detalų error message
```

### 3. Tikrinti Vercel Logs

Jei lokaliai veikia, bet Vercel deployment'e ne:

```bash
# Paleiskite Vercel CLI (jei turite įdiegę)
vercel logs obuolys --follow

# Arba per Dashboard:
# https://vercel.com/[your-username]/obuolys/logs
```

Ieškokite klaidos pranešimų, kuriuose minimas:
- `STRIPE_SECRET_KEY`
- `stripe.checkout.sessions.create`
- `Invalid API Key`

## Dažniausios Klaidos

### Klaida: "Invalid API Key provided"
**Priežastis**: Neteisingas arba neegzistuojantis Stripe secret key

**Sprendimas**:
1. Patikrinkite Stripe Dashboard: https://dashboard.stripe.com/apikeys
2. Nukopijuokite teisingą `sk_live_...` raktą
3. Atnaujinkite Vercel environment variable
4. Redeploy projektą

### Klaida: "No such price: 'price_...'"
**Priežastis**: Neteisingas price ID arba kaina neaktyvi Stripe Dashboard

**Sprendimas**:
1. Patikrinkite Stripe Dashboard → Products → Prices
2. Patikrinkite ar visos 4 kainos aktyvios:
   - `price_1SRC1QLP0H1tP3DjR1FRtzNX` (97€)
   - `price_1SRC2uLP0H1tP3DjZYEK5R7z` (117€)
   - `price_1SRC2uLP0H1tP3Djb7k6VkSv` (137€)
   - `price_1SRC2uLP0H1tP3DjybonjssY` (147€)
3. Jei kainos inactive, suaktyvinkite jas
4. Jei price ID neteisingas, atnaujinkite [src/config/stripe.ts](src/config/stripe.ts)

### Klaida: "CORS policy error"
**Priežastis**: CORS headers nesukonfigūruoti

**Sprendimas**: API endpoint jau turi CORS headers (lines 8-13), bet patikrinkite ar:
1. Vercel configuration leidžia CORS
2. Request ateina iš teisingo origin

## Patikrinimo Checklist

Prieš testavimą Production:

- [ ] Vercel environment variables nustatyti (VITE_STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY)
- [ ] Projektas redeploy'intas po environment variables pridėjimo
- [ ] Lokaliai testas pavyko (redirect į Stripe Checkout)
- [ ] Stripe Dashboard visos 4 kainos aktyvios
- [ ] Product ID teisingas: `prod_TNxxapWX108lqE`
- [ ] Success URL route registruotas App.tsx: `/kursai/mokejimas-sekmingas`

## Test Flow

### 1. Development Mode Test (su test kortelėmis)

Jei norite išbandyti su Stripe test mode:

1. Pakeiskite `.env` į test keys:
```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

2. Test kortelė:
```
Numeris: 4242 4242 4242 4242
CVC: 123
Data: 12/34
```

3. Testuokite pilną flow:
```
Kurso puslapis → Įsigyti kursą → Stripe Checkout → Užpildyti test kortelę → Success → Google Form
```

### 2. Production Mode Test

**⚠️ SVARBU**: Naudokite tikrą kortelę tik kai viskas veikia test mode!

1. Pakeiskite atgal į live keys
2. Redeploy Vercel
3. Testuokite su maža suma (pvz., early bird kaina)

## Debug Workflow

Jei vis dar klaida po visų žingsnių:

1. **Check Browser Console** (F12):
   - Ar rodoma detali klaida?
   - Ar API response turi `details` field?

2. **Check Network Tab** (F12 → Network):
   - Raskite `/api/create-checkout-session` request
   - Preview → Response → Pažiūrėkite error message

3. **Check Vercel Logs**:
   - Ieškokite Stack trace
   - Raskite konkrečią Stripe API klaidos priežastį

4. **Test Stripe Keys**:
```bash
# Testuokite Stripe API su curl
curl https://api.stripe.com/v1/checkout/sessions \
  -u sk_live_51SRBK4LP0H1tP3Dj...: \
  -d "mode=payment" \
  -d "line_items[0][price]=price_1SRC1QLP0H1tP3DjR1FRtzNX" \
  -d "line_items[0][quantity]=1" \
  -d "success_url=https://obuolys.lt/success" \
  -d "cancel_url=https://obuolys.lt/cancel"

# Jei grąžina error, tai Stripe konfigūracijos problema
```

## Pagalba

Jei problema išlieka:

1. **Stripe Dashboard Logs**: https://dashboard.stripe.com/logs
   - Matysite visus API requests ir klaidas

2. **Vercel Support**: https://vercel.com/support
   - Gali padėti su deployment/environment variable klausimais

3. **Stripe Support**: https://support.stripe.com/
   - Gali padėti su API/product/price klausimais

## Greitas Test

Paprasčiausias būdas patikrinti ar viskas veikia:

```bash
# 1. Atidarykite kurso puslapį
https://obuolys.lt/kursai/kaip-pradeti-programuoti-su-di

# 2. Atidarykite Console (F12)

# 3. Spauskite "Įsigyti kursą"

# 4. Turėtumėte pamatyti:
# ✅ Console: "Creating checkout session..."
# ✅ Redirect į: https://checkout.stripe.com/c/pay/cs_...
# ❌ Console error: Reiškia API problema
```

---

**Atnaujinta**: 2025-01-08
**Versija**: 1.0.0
