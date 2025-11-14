# Stripe Kainų Pakeitimas: 97 EUR Visuomet

## Apžvalga

Pakeista kurso "KAIP PRADĖTI PROGRAMUOTI SU DI" kainų sistema iš daugelio kainų (97€, 117€, 137€, 147€) į **vieną fiksuotą kainą - 97 EUR**.

---

## ✅ Užbaigti Pakeitimai

### 1. **Supabase** (Duomenų bazė)
- ✅ Kurso kaina duomenų bazėje: **97.00 EUR**
- Jokių papildomų veiksmų nereikia

### 2. **Codebase** (Kodas)
Visi kodo pakeitimai atlikti:

#### Pakeisti failai:
1. ✅ `src/config/stripe.ts` - Supaprastinta į vieną kainą
2. ✅ `src/components/course/CoursePurchasePopup.tsx` - Pašalinti kainų grafikai
3. ✅ `src/components/course/CoursePurchaseCard.tsx` - Supaprastinta kortelė
4. ✅ `src/components/course/CourseHero.tsx` - Pašalinti "Sutaupai X€" badges
5. ✅ `src/components/course/ProgressivePurchaseHint.tsx` - Pašalinti pricing tiers
6. ✅ `src/components/course/ContentWithPurchaseHints.tsx` - Pašalinti savings logika
7. ✅ `src/pages/CourseDetail.tsx` - Atnaujinti price props

#### Rezultatai:
- ✅ TypeScript kompiliuojasi be klaidų
- ✅ Build sėkmingas
- ✅ Visi "Kaina pakils" pranešimai pašalinti
- ✅ Visi kainų grafikai pašalinti
- ✅ "Sutaupai X€" badges pašalinti

---

## ⚠️ REIKIA ATLIKTI RANKINIU BŪDU

### 3. **Stripe Dashboard** - Kainų Valdymas

Kadangi Stripe MCP neveikia, reikia rankiniu būdu atlikti šiuos veiksmus:

#### Dabartinės Stripe kainos:
```
Product: KAIP PRADĖTI PROGRAMUOTI SU DI (prod_TNxxapWX108lqE)

Kainos (Price IDs):
1. price_1SRC1QLP0H1tP3DjR1FRtzNX - 97 EUR   ← PALIKTI ACTIVE
2. price_1SRC2uLP0H1tP3DjZYEK5R7z - 117 EUR  ← DEACTIVATE arba ARCHIVE
3. price_1SRC2uLP0H1tP3Djb7k6VkSv - 137 EUR  ← DEACTIVATE arba ARCHIVE
4. price_1SRC2uLP0H1tP3DjybonjssY - 147 EUR  ← DEACTIVATE arba ARCHIVE
```

#### Veiksmai Stripe Dashboard:

**SVARBU:** Yra vienas pirkimas už 117 EUR, todėl **NEGALIMA IŠTRINTI** price_1SRC2uLP0H1tP3DjZYEK5R7z. Galima tik **DEACTIVATE**.

**Žingsniai:**

1. **Prisijungti prie Stripe Dashboard:**
   - Eiti į: https://dashboard.stripe.com/

2. **Eiti į Products:**
   - Menu: Products → Products
   - Rasti produktą: "KAIP PRADĖTI PROGRAMUOTI SU DI"

3. **Kainos Valdymas:**

   **PALIKTI ACTIVE:**
   - ✅ `price_1SRC1QLP0H1tP3DjR1FRtzNX` (97 EUR) - **ACTIVE**

   **DEACTIVATE (NE IŠTRINTI):**
   - ⚠️ `price_1SRC2uLP0H1tP3DjZYEK5R7z` (117 EUR) - **DEACTIVATE**
     - Priežastis: Yra vienas pirkimas už 117 EUR
     - Veiksmas: Deactivate, bet neištrinti

   - ⚠️ `price_1SRC2uLP0H1tP3Djb7k6VkSv` (137 EUR) - **DEACTIVATE arba ARCHIVE**
   - ⚠️ `price_1SRC2uLP0H1tP3DjybonjssY` (147 EUR) - **DEACTIVATE arba ARCHIVE**

4. **Kaip Deactivate kainą:**
   - Paspausti ant kainos (pvz., 117 EUR)
   - Viršuje rasti "⋯" (three dots menu)
   - Pasirinkti "Archive" arba "Deactivate"
   - Patvirtinti

5. **Patikrinti rezultatą:**
   - Produktas turi tik vieną ACTIVE kainą: 97 EUR
   - Kitos kainos: Archived arba Deactivated

---

## 📊 Pirkimų Istorija

**Svarbu žinoti:**
- Vienas pirkimas už **117 EUR** - todėl negalima ištrinti tos kainos
- Visi kiti pirkimai už **97 EUR**

**Rekomenduojama strategija:**
- **Archive** visas kitas kainas (117€, 137€, 147€)
- Palikti tik **97 EUR** kainą aktyvią
- Archived kainos išliks pirkimų istorijoje, bet nebus galima jų naudoti naujiem pirkimams

---

## 🧪 Testavimas Po Pakeitimų

1. **Patikrinti kursų puslapį:**
   - Eiti į: https://ponasobuolys.lt/kursai/kaip-pradeti-programuoti-su-di
   - Turi rodyti tik **97.00€**
   - Neturi būti "Kaina pakils" pranešimų
   - Neturi būti "Sutaupai X€" badges

2. **Patikrinti Stripe Checkout:**
   - Bandyti pirkti kursą
   - Stripe Checkout turi rodyti **97 EUR**
   - Mokėjimas turi sėkmingai veikti

3. **Patikrinti Supabase:**
   - Kurso kaina: 97.00 EUR
   - Pirkimų įrašai turi būti teisingi

---

## 🔄 Rollback Planas (Jei Reikia)

Jei kažkas neveikia ir reikia grįžti atgal:

1. **Git:**
   ```bash
   git log  # Rasti commit prieš pakeitimus
   git checkout <commit-hash>
   ```

2. **Stripe:**
   - Activate atgal 117 EUR, 137 EUR, 147 EUR kainas
   - Kodo pakeitimai automatiškai grįš su git checkout

---

## 📝 Santrauka

### ✅ Atlikta:
- Supabase: 97 EUR kaina
- Kodas: Visi pakeitimai atlikti
- TypeScript: Be klaidų
- Build: Sėkmingas

### ⚠️ Liko atlikti:
- **Stripe Dashboard:** Archive/Deactivate 117€, 137€, 147€ kainas
- **Testavimas:** Patikrinti kursų puslapį ir Stripe checkout

---

**Data:** 2025-11-15
**Autorius:** Claude Code
**Tikslai:** Supaprastinti kainų sistemą į vieną fiksuotą 97 EUR kainą
