# Supabase URL Configuration

## Site URL

✅ Jau nustatyta: `https://ponasobuolys.lt`

## Redirect URLs

Pridėkite šiuos URL į **Authentication → URL Configuration → Redirect URLs**:

```
https://ponasobuolys.lt/auth/callback
https://ponasobuolys.lt/
https://www.ponasobuolys.lt/auth/callback
https://www.ponasobuolys.lt/
http://localhost:5173/auth/callback
http://localhost:5173/
```

### Paaiškinimas:

- `https://ponasobuolys.lt/auth/callback` - OAuth callback production
- `https://ponasobuolys.lt/` - Fallback redirect production
- `https://www.ponasobuolys.lt/*` - Su www subdomain
- `http://localhost:5173/*` - Development/testing

## Google Cloud Console

Taip pat atnaujinkite Google Cloud Console:

### Authorized JavaScript origins (TIK domain, be path):

```
https://ponasobuolys.lt
https://www.ponasobuolys.lt
http://localhost:5173
```

⚠️ **Svarbu:** JavaScript origins negali turėti path (`/auth/callback`) arba baigtis `/`

### Authorized redirect URIs (su path):

```
https://ponasobuolys.lt/auth/callback
https://www.ponasobuolys.lt/auth/callback
https://jzixoslapmlqafrlbvpk.supabase.co/auth/v1/callback
http://localhost:5173/auth/callback
```

## Testavimas

Po šių pakeitimų:

1. Atidarykite `https://ponasobuolys.lt/auth`
2. Paspauskite "Prisijungti su Google"
3. OAuth consent screen turėtų rodyti: **"You're signing in to ponasobuolys.lt"**
4. Po prisijungimo turėtumėte būti nukreipti į home page
5. Header turėtų rodyti jūsų Google avatar

## Svarbu

- Supabase **Site URL** nustato, koks domain bus rodomas OAuth consent screen
- **Redirect URLs** nustato, į kur vartotojas bus nukreiptas po OAuth
- Abi reikšmės turi būti teisingos, kad OAuth veiktų

## Jei vis dar rodo Supabase domain

Jei OAuth consent screen vis dar rodo `jzixoslapmlqafrlbvpk.supabase.co`:

1. Išvalykite browser cache
2. Išsiregistruokite iš Google (sign out)
3. Bandykite incognito/private mode
4. Palaukite 5-10 minučių - Google cache gali užtrukti

## Troubleshooting

### "Redirect URI mismatch"

Patikrinkite:

- Supabase Redirect URLs turi `https://ponasobuolys.lt/auth/callback`
- Google Cloud Console Authorized redirect URIs turi tą patį URL
- Nėra typo (pvz., `/callback` vs `/auth/callback`)

### OAuth loop

Jei po callback grįžta atgal į `/auth/callback`:

- Patikrinkite `AuthCallback.tsx` - ar redirect'ina į `/`
- Išvalykite cookies ir cache
- Patikrinkite browser console errors
