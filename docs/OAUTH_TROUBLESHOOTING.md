# OAuth Troubleshooting Guide

## Problema 1: OAuth Consent Screen Rodo Supabase URL

### Simptomas:
Prisijungiant su Google, OAuth consent screen rodo:
```
You're signing back in to jzixoslapmlqafrlbvpk.supabase.co
```

Vietoj:
```
You're signing in to ponasobuolys.lt
```

### Priežastis:
Google OAuth cache arba Supabase Site URL nebuvo teisingai nustatytas.

### Sprendimas:

#### 1. Patikrinkite Supabase Site URL
1. Eikite į Supabase Dashboard
2. Authentication → URL Configuration
3. **Site URL** turi būti: `https://ponasobuolys.lt`
4. Išsaugokite

#### 2. Patikrinkite Google Cloud Console
1. Eikite į [Google Cloud Console](https://console.cloud.google.com/)
2. APIs & Services → OAuth consent screen
3. **Application home page**: `https://ponasobuolys.lt`
4. **Authorized domains**: `ponasobuolys.lt`
5. Išsaugokite

#### 3. Išvalykite Cache
1. Atsijunkite iš Google (sign out)
2. Išvalykite browser cache ir cookies
3. Bandykite incognito/private mode
4. Palaukite 5-10 minučių - Google cache gali užtrukti

#### 4. Jei vis dar nerodo teisingai
- **Normalu:** Jei neturite Supabase Pro plano su custom domain, OAuth consent screen gali rodyti Supabase URL
- **Tai nesaugumą:** Vartotojai vis tiek sėkmingai prisijungia
- **Sprendimas:** Upgrade į Supabase Pro ($25/mėn) ir setup custom domain

---

## Problema 2: Redirect Loop į Home Page

### Simptomas:
Po Google OAuth prisijungimo:
1. Nukreipia į `/auth/callback`
2. Tada į `/profilis`
3. Puslapis persikrauna
4. Grįžta į home page `/`

### Priežastis:
`useProfileManagement` hook redirect'ina į `/auth`, kai `user` dar neužkrautas po OAuth callback.

### Sprendimas:

#### AuthCallback.tsx pakeitimai:
```typescript
// Palaukti, kol Supabase apdoros OAuth callback
await new Promise(resolve => setTimeout(resolve, 1000));

// Gauti session
const { data: { session }, error } = await supabase.auth.getSession();

if (session) {
  // Palaukti, kol user context atsinaujins
  await new Promise(resolve => setTimeout(resolve, 500));
  // Redirect su replace: true (išvengti history loop)
  navigate('/', { replace: true });
}
```

#### useProfileManagement.ts pakeitimai:
```typescript
// Sumažinti dependency array, kad išvengti begalinio loop
useEffect(() => {
  if (!loading && !user) {
    navigate("/auth");
    return;
  }

  if (user) {
    loadProfileData();
    fetchSavedPublications();
    fetchEnrolledCourses();
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [user, loading]); // Tik user ir loading, ne funkcijos
```

---

## Problema 3: Avatar Nerodomas Po Google OAuth

### Simptomas:
Po Google OAuth prisijungimo profilio paveikslėlis nerodo, tik pirma raidė.

### Priežastis:
1. `avatar_url` nebuvo išsaugotas į `profiles` lentelę
2. Vartotojas prisijungė **prieš** trigger atnaujinimą

### Sprendimas:

#### Patikrinkite duomenis:
```sql
-- Patikrinkite profiles lentelę
SELECT id, username, avatar_url FROM profiles WHERE id = 'user-id';

-- Patikrinkite auth.users meta data
SELECT id, email, raw_user_meta_data FROM auth.users WHERE id = 'user-id';
```

#### Jei avatar_url yra null, paleiskite backfill:
```sql
UPDATE public.profiles p
SET avatar_url = COALESCE(
  u.raw_user_meta_data->>'avatar_url',
  u.raw_user_meta_data->>'picture'
)
FROM auth.users u
WHERE p.id = u.id
  AND p.avatar_url IS NULL
  AND (
    u.raw_user_meta_data->>'picture' IS NOT NULL 
    OR u.raw_user_meta_data->>'avatar_url' IS NOT NULL
  );
```

#### Perkraukite puslapį:
- F5 arba Ctrl+R
- Išvalykite cache
- Incognito mode

---

## Problema 4: "Redirect URI Mismatch" Klaida

### Simptomas:
Google OAuth grąžina klaidą:
```
Error: redirect_uri_mismatch
```

### Priežastis:
Google Cloud Console Authorized redirect URIs neatitinka Supabase redirect URL.

### Sprendimas:

#### Patikrinkite Supabase Redirect URLs:
```
https://ponasobuolys.lt/auth/callback
https://ponasobuolys.lt/
https://www.ponasobuolys.lt/auth/callback
https://www.ponasobuolys.lt/
http://localhost:5173/auth/callback
http://localhost:5173/
```

#### Patikrinkite Google Cloud Console:
```
https://ponasobuolys.lt/auth/callback
https://www.ponasobuolys.lt/auth/callback
https://jzixoslapmlqafrlbvpk.supabase.co/auth/v1/callback
http://localhost:5173/auth/callback
```

⚠️ **Svarbu:** URL turi būti **tiksliai** toks pats, įskaitant:
- `https://` vs `http://`
- `/auth/callback` vs `/callback`
- `www.` vs be `www.`

---

## Problema 5: Session Nepersistentuoja

### Simptomas:
Po Google OAuth prisijungimo, perkrovus puslapį, vartotojas atsijungia.

### Priežastis:
Supabase session storage problema arba cookie settings.

### Sprendimas:

#### Patikrinkite Supabase Client konfigūraciją:
```typescript
// src/integrations/supabase/client.ts
export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true, // Turi būti true
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
```

#### Patikrinkite Browser Settings:
- Cookies turi būti enabled
- Third-party cookies gali būti blokuojami (išjunkite ad blockers)
- Incognito mode gali blokuoti session storage

---

## Debug Checklist

Kai kyla OAuth problemos, patikrinkite:

- [ ] Supabase Site URL: `https://ponasobuolys.lt`
- [ ] Supabase Redirect URLs pridėti
- [ ] Google Authorized JavaScript origins (be path)
- [ ] Google Authorized redirect URIs (su path)
- [ ] Google OAuth consent screen Application home page
- [ ] Browser cache išvalytas
- [ ] Cookies enabled
- [ ] Ad blockers išjungti
- [ ] Incognito mode testuoti
- [ ] Console errors patikrinti
- [ ] Network tab patikrinti (redirect chain)

## Naudingos Komandos

### Patikrinti session:
```typescript
const { data: { session } } = await supabase.auth.getSession();
console.log('Session:', session);
```

### Patikrinti user:
```typescript
const { data: { user } } = await supabase.auth.getUser();
console.log('User:', user);
```

### Patikrinti profile:
```sql
SELECT * FROM profiles WHERE id = 'user-id';
```

### Patikrinti auth.users meta data:
```sql
SELECT raw_user_meta_data FROM auth.users WHERE id = 'user-id';
```
