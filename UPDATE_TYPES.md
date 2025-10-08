# Atnaujinti Supabase Types

## ⚠️ Problema: "command not found"

Jei gaunate klaidą `command not found` paleisdami `npx supabase`, turite du variantus:

---

## ✅ Variantas 1: Kopijuoti tipus iš Supabase Dashboard (GREIČIAUSIAS)

**Šis būdas veikia iškart be jokių įdiegimų:**

### Žingsniai:

1. **Atidarykite Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/jzixoslapmlqafrlbvpk/api
   ```

2. **Raskite TypeScript tipus:**
   - Kairėje meniu: **API Docs**
   - Viršuje tabs: **TypeScript**
   - Pamatysite sugeneruotą tipo kodą

3. **Nukopijuokite tipus:**
   - Paspauskite **"Copy"** mygtuką
   - Arba pažymėkite visą kodą ir Ctrl+C

4. **Įklijuokite į projektą:**
   - Atidarykite: `src/integrations/supabase/types.ts`
   - Pakeiskite **visą** failo turinį
   - Ctrl+V → Išsaugokite (Ctrl+S)

5. **Patikrinkite:**
   - Turėtumėte matyti naują `custom_tool_inquiries` tipą
   - VS Code automatiškai atpažins naują lentelę

---

## 🔧 Variantas 2: Įdiegti Supabase CLI

```bash
# Windows (PowerShell Administrator):
npm install -g supabase

# Arba naudoti npx su @latest:
npx supabase@latest login
npx supabase@latest gen types typescript --project-id jzixoslapmlqafrlbvpk > src/integrations/supabase/types.ts
```

---

## 📋 Kas bus atnaujinta:

Nauji tipai apims:
- ✅ `custom_tool_inquiries` (nauja lentelė verslo užklausoms)
- ✅ Visos egzistuojančios lentelės atnaujintos

## 💡 Pastaba:

`types.ts` failas yra **auto-generuojamas** - saugiai keiskite visą turinį!
