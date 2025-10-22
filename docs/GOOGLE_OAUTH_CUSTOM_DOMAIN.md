# Google OAuth Custom Domain Setup

## Problema

Kai vartotojas prisijungia su Google, OAuth consent screen rodo:

```
You're signing back in to jzixoslapmlqafrlbvpk.supabase.co
```

Norime, kad rodytų:

```
You're signing in to ponasobuolys.lt
```

## Sprendimas

### 1. Google Cloud Console Konfigūracija

#### A. Atnaujinti Authorized Redirect URIs

1. Eikite į [Google Cloud Console](https://console.cloud.google.com/)
2. Pasirinkite projektą
3. Navigation menu → **APIs & Services** → **Credentials**
4. Pasirinkite savo OAuth 2.0 Client ID

5. **Authorized JavaScript origins** (TIK domain, be path):

   ```
   https://ponasobuolys.lt
   https://www.ponasobuolys.lt
   http://localhost:5173
   ```

6. **Authorized redirect URIs** (su path):

   ```
   https://ponasobuolys.lt/auth/callback
   https://www.ponasobuolys.lt/auth/callback
   https://jzixoslapmlqafrlbvpk.supabase.co/auth/v1/callback
   http://localhost:5173/auth/callback
   ```

7. Išsaugokite

⚠️ **Svarbu:** JavaScript origins negali turėti path arba baigtis `/` - tik domain!

#### B. OAuth Consent Screen

1. Navigation menu → **APIs & Services** → **OAuth consent screen**
2. **Application home page** - įveskite: `https://ponasobuolys.lt`
3. **Authorized domains** - pridėkite: `ponasobuolys.lt`
4. Išsaugokite

### 2. Supabase Custom Domain Setup

⚠️ **Svarbu:** Custom domain yra prieinamas tik **Pro** plane ir aukštesniuose.

#### A. DNS Konfigūracija

1. Eikite į savo DNS provider (pvz., Cloudflare, Namecheap)
2. Pridėkite CNAME record:
   ```
   Type: CNAME
   Name: auth (arba subdomain)
   Value: jzixoslapmlqafrlbvpk.supabase.co
   TTL: Auto
   ```

#### B. Supabase Dashboard

1. Eikite į [Supabase Dashboard](https://supabase.com/dashboard)
2. Pasirinkite projektą `jzixoslapmlqafrlbvpk`
3. Settings → **Custom Domains**
4. Pridėkite custom domain: `auth.ponasobuolys.lt` arba `ponasobuolys.lt`
5. Sekite instrukcijas SSL sertifikato patvirtinimui

### 3. Alternatyva: Naudoti Supabase su Custom Domain (Pilnas Setup)

Jei nenorite mokėti už Supabase Pro, galite:

#### Variantas A: Proxy per savo serverį

1. Sukurkite API endpoint savo serveryje: `https://ponasobuolys.lt/api/auth`
2. Proxy visus auth request'us į Supabase
3. Google OAuth matys tik `ponasobuolys.lt`

**Minusai:**

- Reikia palaikyti serverį
- Papildomas latency
- Sudėtingesnė konfigūracija

#### Variantas B: Naudoti Supabase be custom domain

Palikite kaip yra - `jzixoslapmlqafrlbvpk.supabase.co` yra visiškai saugus ir funkcionalus.

**Pliusai:**

- Nemokamai
- Jokios papildomos konfigūracijos
- Supabase palaiko SSL automatiškai

**Minusai:**

- OAuth consent screen rodo Supabase domain

### 4. Dabartinė Implementacija

Jūsų aplikacija dabar naudoja:

```typescript
// auth-context.hooks.ts
export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });
};
```

**Redirect flow:**

1. Vartotojas paspaudžia "Sign in with Google"
2. Nukreipiamas į Google OAuth
3. Po sėkmingo prisijungimo → `https://ponasobuolys.lt/auth/callback`
4. AuthCallback komponentas apdoroja callback
5. Redirect į `/` (home page)

### 5. Testavimas

1. Atidarykite `https://ponasobuolys.lt/auth`
2. Paspauskite "Prisijungti su Google"
3. Patikrinkite OAuth consent screen tekstą
4. Po prisijungimo turėtumėte būti nukreipti į home page

### 6. Troubleshooting

#### "Redirect URI mismatch" klaida

**Problema:** Google OAuth redirect URI neatitinka konfigūracijos.

**Sprendimas:**

1. Patikrinkite Google Cloud Console → Credentials
2. Įsitikinkite, kad `https://ponasobuolys.lt/auth/callback` yra authorized redirect URIs sąraše
3. Taip pat pridėkite Supabase callback URL:
   ```
   https://jzixoslapmlqafrlbvpk.supabase.co/auth/v1/callback
   ```

#### OAuth consent screen vis dar rodo Supabase domain

**Priežastis:** Naudojate Supabase Free plan be custom domain.

**Sprendimai:**

1. Upgrade į Supabase Pro ($25/mėn) ir setup custom domain
2. Arba palikite kaip yra - tai neturi įtakos funkcionalumui

#### Callback loop (begalinis redirect)

**Problema:** Po OAuth callback vartotojas grąžinamas atgal į `/auth/callback`.

**Sprendimas:**

1. Patikrinkite `AuthCallback.tsx` - ar teisingai redirect'ina į `/`
2. Patikrinkite browser console errors
3. Išvalykite browser cache ir cookies

## Rekomendacija

**Jei budget leidžia:** Upgrade į Supabase Pro ir setup custom domain.

**Jei ne:** Palikite dabartinę konfigūraciją - `jzixoslapmlqafrlbvpk.supabase.co` yra visiškai saugus ir profesionalus. Daugelis aplikacijų naudoja Supabase domain OAuth ir tai neturi neigiamos įtakos vartotojų patirčiai.

## Papildoma Informacija

- [Supabase Custom Domains](https://supabase.com/docs/guides/platform/custom-domains)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Auth Callbacks](https://supabase.com/docs/guides/auth/redirect-urls)
