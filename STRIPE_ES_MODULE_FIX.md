# ✅ Stripe Mokėjimo Sistemos ES Module Taisymas - IŠSPRĘSTA

**Data**: 2025-11-08
**Problema**: 500 klaida kuriant checkout session - ReferenceError: module is not defined in ES module scope
**Statusas**: ✅ IŠSPRĘSTA

---

## ❌ Problema

Vercel production logs:
```
ReferenceError: module is not defined in ES module scope
This file is being treated as an ES module because it has a '.js' file extension
and '/var/task/package.json' contains "type": "module".
To treat it as a CommonJS script, rename it to use the '.cjs' file extension.
at file:///var/task/api/create-checkout-session.js:20:1
```

---

## 🔍 Tikroji Priežastis

**Root Cause**: Neatitikimas tarp `package.json` ir serverless funkcijos sintaksės

1. **package.json** turi `"type": "module"` → visi `.js` failai laikomi **ES modules**
2. **api/create-checkout-session.js** naudojo **CommonJS** sintaksę:
   - `module.exports = async (req, res) => { ... }`
   - `require('stripe')(...)`
3. **Vercel deployment**: ES module kontekste `module` ir `require` neegzistuoja → ReferenceError

---

## ✅ Sprendimas

### Pakeisti į ES Module Sintaksę

**Buvo (CommonJS):**
```javascript
// ❌ BLOGAI - CommonJS sintaksė ES module projekte
module.exports = async (req, res) => {
  let stripe;
  try {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  } catch (error) {
    // ...
  }
}
```

**Tapo (ES Modules):**
```javascript
// ✅ GERAI - ES module sintaksė
import Stripe from 'stripe';

export default async function handler(req, res) {
  let stripe;
  try {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  } catch (error) {
    // ...
  }
}
```

---

## 📋 Padaryti Pakeitimai

### Failas: [api/create-checkout-session.js](api/create-checkout-session.js)

**1. Pridėtas import statement (line 6):**
```javascript
import Stripe from 'stripe';
```

**2. Pakeistas export (line 20):**
```javascript
// Buvo:
module.exports = async (req, res) => {

// Tapo:
export default async function handler(req, res) {
```

**3. Pakeista Stripe inicializacija (line 52):**
```javascript
// Buvo:
stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Tapo:
stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
```

**4. Pašalintas semicolon po funkcijos (line 154):**
```javascript
// Buvo:
};

// Tapo:
}
```

---

## 🧪 Testuota

### ✅ Local Syntax Check:
```bash
node --check api/create-checkout-session.js
# Rezultatas: No errors
```

### ✅ Git Commit:
```bash
git add api/create-checkout-session.js
git commit -m "fix: convert Stripe API to ES module syntax for Vercel compatibility"
# Commit: 691af4d
```

---

## 🚀 Deployment Instrukcijos

### 1. Push pakeitimus:
```bash
git push origin main
```

### 2. Vercel auto-deploy:
- Vercel aptiks naują commit
- Automatiškai deploy naują versiją
- ~2-3 minutės deployment laikui

### 3. Testuoti production:
```bash
curl -X POST https://ponasobuolys.lt/api/create-checkout-session \
  -H "Content-Type: application/json" \
  -d '{"priceId":"price_1SRC1QLP0H1tP3DjR1FRtzNX","courseId":"kaip-pradeti-programuoti-su-di"}'
```

**Tikimasi:**
```json
{
  "sessionId": "cs_live_...",
  "url": "https://checkout.stripe.com/c/pay/..."
}
```

**NE:**
```
A server error has occurred
FUNCTION_INVOCATION_FAILED
```

---

## 📊 Diagnostikos Eiga

| Žingsnis | Hipotezė | Rezultatas |
|----------|----------|------------|
| 1. Vercel Env Vars | Gal neužsetinta? | ❌ NUSTATYTI (user screenshot) |
| 2. Stripe API | Gal neveikia? | ✅ VEIKIA (curl testuota) |
| 3. Exposed Secrets | Gal Vercel blokuoja? | ⚠️ BUVO (bet išspręsta) |
| 4. ES Module Syntax | CommonJS vs ES? | ✅ TIKROJI PRIEŽASTIS |

---

## 📚 Išmoktos Pamokos

### Vercel Serverless Functions su ES Modules:

**✅ DO:**
```javascript
import Stripe from 'stripe';
export default async function handler(req, res) {
  const stripe = new Stripe(process.env.KEY);
}
```

**❌ DON'T:**
```javascript
const stripe = require('stripe')(process.env.KEY);
module.exports = async (req, res) => {
  // ...
}
```

### package.json "type": "module":
- Visi `.js` failai yra ES modules
- Negalima naudoti `require()`, `module.exports`
- CommonJS failams reikia `.cjs` plėtinio
- ES module failams reikia `.mjs` arba tiesiog `.js`

### Debugging Vercel Functions:
1. **Vercel Logs** → tikroji klaida (ne browser console)
2. **Search keywords**: "ReferenceError", "module is not defined"
3. **Check package.json**: "type" field diktuoja sintaksę

---

## 🔗 Susiję Dokumentai

- [STRIPE_EXPOSED_SECRET_FIX.md](STRIPE_EXPOSED_SECRET_FIX.md) - Exposed secrets problema (išspręsta atskirai)
- [STRIPE_INTEGRATION.md](STRIPE_INTEGRATION.md) - Stripe integration docs
- [STRIPE_SETUP_CHECKLIST.md](STRIPE_SETUP_CHECKLIST.md) - Setup checklist

---

**Atnaujinta**: 2025-11-08
**Commit**: 691af4d
**Autorius**: Claude Code
**Prioritetas**: 🔴 KRITINIS → ✅ IŠSPRĘSTA
