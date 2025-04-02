# Ponas Obuolys - Dirbtinio intelekto naujienų portalas

## Apie svetainę

Tai dirbtinio intelekto naujienų ir informacijos portalas lietuvių kalba. Svetainėje pateikiamos naujienos, straipsniai, įrankių apžvalgos ir kursai, susiję su dirbtinio intelekto technologijomis.

## Svetainės struktūra

1. **Naujienos** - trumpi pranešimai apie naujausias AI technologijų aktualijas
2. **Straipsniai** - išsamūs analitiniai straipsniai apie dirbtinį intelektą
3. **Įrankiai** - AI įrankių aprašymai, apžvalgos ir vertinimai
4. **Kursai** - mokomoji medžiaga apie dirbtinį intelektą

## Administravimo skydelis

Administravimo skydelis leidžia valdyti visą svetainės turinį:

1. **Naujienų valdymas** - rankiniu būdu pridėti, redaguoti ir šalinti naujienas
2. **Straipsnių valdymas** - kurti ir redaguoti išsamius straipsnius
3. **Įrankių valdymas** - pridėti naujus AI įrankius ir jų apžvalgas
4. **Kursų valdymas** - kurti ir publikuoti mokomuosius kursus
5. **Vartotojų valdymas** - administruoti svetainės vartotojus ir jų teises

## Techninė informacija

### Techninė architektūra

Svetainė sukurta naudojant šias technologijas:

1. **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI
2. **Backend**: Supabase (duomenų bazė ir autentifikacija)
3. **Saugykla**: Supabase Storage (failams, paveikslėliams)
4. **Diegimas**: Vercel

### Duomenų bazės struktūra

Pagrindinės duomenų bazės lentelės:

1. **news** - naujienos ir jų metaduomenys
2. **articles** - straipsniai ir jų turinys
3. **tools** - AI įrankių informacija ir vertinimai
4. **courses** - kursų duomenys ir struktūra
5. **profiles** - vartotojų profiliai ir rolės

## Turinio valdymas

### Naujienų įkėlimas

Naujienos įkeliamos rankiniu būdu per administravimo skydelį:

1. Eikite į **Administratoriaus valdymo skydelį**
2. Pasirinkite **Naujienos** skirtuką
3. Spauskite **Nauja naujiena**
4. Užpildykite reikiamus laukus:
   - Pavadinimas
   - Trumpas aprašymas
   - Turinys (su formatavimu)
   - Nuotrauka
   - Nuoroda į šaltinį (jei yra)
5. Paspauskite **Išsaugoti**

### Straipsnių kūrimas

Straipsniai kuriami naudojant integruotą redaktorių:

1. Administravimo skydelyje pasirinkite **Straipsniai**
2. Spauskite **Naujas straipsnis**
3. Naudokite teksto redaktorių su formatavimo galimybėmis
4. Pridėkite paveikslėlius, nuorodas ir kitus elementus
5. Nustatykite kategorijas ir žymas
6. Paspauskite **Publikuoti** arba **Išsaugoti kaip juodraštį**

## Vartotojų valdymas

- **Administratoriai** - pilna prieiga prie visų funkcijų
- **Redaktoriai** - gali kurti ir redaguoti turinį
- **Vartotojai** - gali skaityti turinį ir palikti komentarus

## Saugumo pastabos

- API raktai saugomi saugiai ir nėra matomi viešai
- Visi vartotojų duomenys yra šifruojami
- Rekomenduojama reguliariai atnaujinti slaptažodžius

## Tobulinimo galimybės

- Komentarų sistema straipsniams ir naujienoms
- Pažangesnė paieška su filtravimo galimybėmis
- Integracijos su socialiniais tinklais
- Prenumeratos sistema

## Pastaba dėl naujienų importavimo

**Svarbu**: Sprendžiant technines problemas, automatinis RSS naujienų importavimas buvo pašalintas iš sistemos. Visos naujienos dabar įkeliamos rankiniu būdu per administravimo skydelį. Ateityje planuojama įdiegti integracijas su MAKE.COM ar kitomis automatizavimo platformomis.
