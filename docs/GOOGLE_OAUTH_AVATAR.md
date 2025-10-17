# Google OAuth Avatar Integration

## Apžvalga

Kai vartotojas prisijungia su Google paskyra, jo profilio paveikslėlis automatiškai rodomas:
- Header meniu "Profilis" mygtuke
- Mobile meniu "Profilio nustatymai" punkte
- Profilio puslapyje (Nustatymai → Profilio informacija)

## Kaip tai veikia

### 1. Google OAuth Konfigūracija

`signInWithGoogle()` funkcija (`auth-context.hooks.ts`) prašo Google profilio informacijos:

```typescript
const { error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/`,
    queryParams: {
      access_type: 'offline',
      prompt: 'consent',
    },
  },
});
```

### 2. Automatinis Profilio Kūrimas

Kai naujas vartotojas prisijungia, Supabase trigger `on_auth_user_created` automatiškai iškviečia `handle_new_user()` funkciją:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    new.id,
    COALESCE(
      new.raw_user_meta_data->>'username',
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1)
    ),
    COALESCE(
      new.raw_user_meta_data->>'avatar_url',
      new.raw_user_meta_data->>'picture'
    )
  );
  RETURN new;
END;
$$;
```

**Svarbūs laukai:**
- `username` - imamas iš Google `full_name`, `name`, arba el. pašto
- `avatar_url` - imamas iš Google `picture` lauko (Google OAuth standartinis laukas)

### 3. Avatar Rodymas Header

Header komponentas (`Header.tsx`) naudoja `getUserProfile()` metodą iš AuthContext:

```typescript
const [profileData, setProfileData] = useState<{ username?: string; avatarUrl?: string } | null>(null);
const { user, getUserProfile } = useAuth();

useEffect(() => {
  const loadProfile = async () => {
    if (user) {
      const profile = await getUserProfile();
      setProfileData(profile);
    }
  };
  loadProfile();
}, [user, getUserProfile]);
```

Avatar komponentas:
```tsx
<Avatar className="h-6 w-6">
  <AvatarImage src={profileData?.avatarUrl || ''} alt={profileData?.username || 'User'} />
  <AvatarFallback>
    {profileData?.username?.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
  </AvatarFallback>
</Avatar>
```

### 4. Avatar Rodymas Profilio Puslapyje

Profilio puslapis (`ProfileInformationTab.tsx`) jau naudoja `avatarUrl`:

```tsx
<Avatar className="h-24 w-24">
  <AvatarImage
    src={profileData?.avatarUrl || ""}
    alt={profileData?.username || "Vartotojas"}
  />
  <AvatarFallback>
    {profileData?.username?.charAt(0).toUpperCase() || "V"}
  </AvatarFallback>
</Avatar>
```

## Google OAuth Meta Data Struktūra

Kai vartotojas prisijungia su Google, Supabase `raw_user_meta_data` turi:

```json
{
  "iss": "https://accounts.google.com",
  "sub": "123456789...",
  "email": "user@gmail.com",
  "email_verified": true,
  "name": "John Doe",
  "picture": "https://lh3.googleusercontent.com/a/...",
  "given_name": "John",
  "family_name": "Doe",
  "locale": "en"
}
```

**Svarbu:** `picture` laukas yra Google profilio paveikslėlio URL.

## Testavimas

1. Prisijunkite su Google paskyra
2. Patikrinkite, ar Header "Profilis" mygtuke matosi jūsų Google avatar
3. Eikite į Nustatymai → Profilio informacija
4. Turėtumėte matyti tą patį Google avatar

## Migracija: Backfill Esamų Vartotojų

Jei vartotojai prisijungė su Google **prieš** trigger atnaujinimą, jų `avatar_url` bus `null`. Paleiskite šią migracją:

```sql
-- Backfill avatar_url for existing Google OAuth users
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

**Rezultatas:** Visi esami Google OAuth vartotojai gaus savo profilio paveikslėlius.

## Troubleshooting

### Avatar nerodomas

1. **Patikrinkite Supabase Dashboard:**
   - Eikite į Authentication → Users
   - Pasirinkite vartotoją
   - Patikrinkite `raw_user_meta_data` → ar yra `picture` laukas

2. **Patikrinkite profiles lentelę:**
   ```sql
   SELECT id, username, avatar_url FROM profiles WHERE id = 'user-id';
   ```
   
   Jei `avatar_url` yra `null`, bet `auth.users` turi `picture`, paleiskite backfill migracią.

3. **Patikrinkite trigger:**
   ```sql
   SELECT * FROM information_schema.triggers 
   WHERE trigger_name = 'on_auth_user_created';
   ```

### Avatar neatsinaujina

Jei pakeitėte Google profilio paveikslėlį:
1. Atsijunkite ir prisijunkite iš naujo
2. Arba rankiniu būdu atnaujinkite `profiles.avatar_url`:
   ```sql
   UPDATE profiles 
   SET avatar_url = 'new-url' 
   WHERE id = 'user-id';
   ```

## Saugumas

- Avatar URL yra viešas (Google CDN)
- RLS policies leidžia vartotojams atnaujinti tik savo `avatar_url`
- `handle_new_user()` funkcija naudoja `SECURITY DEFINER` - vykdoma su owner teisėmis
