# Vercel Web Analytics naudojimo vadovas

## Apžvalga
Vercel Web Analytics suteikia išsamų vaizdą apie jūsų svetainės lankytojus. Ši analitikos sistema integruota į projektą leidžia sekti lankytojų elgesį ir gauti naudingų įžvalgų apie svetainės naudojimą.

## Integravimas
Vercel Web Analytics yra jau integruotas į mūsų projektą naudojant `@vercel/analytics` paketą. Analytics komponentas įdiegtas pagrindiniame App.tsx faile.

## Kaip peržiūrėti analitikos duomenis

1. Prisijunkite prie Vercel platformos (https://vercel.com/dashboard)
2. Eikite į projekto valdymo skydą
3. Pasirinkite "Analytics" skiltį kairiajame meniu
4. Peržiūrėkite lankytojų statistiką, puslapių peržiūras ir kitus duomenis

## Pagrindinės funkcijos

- **Lankytojai**: Realiu laiku stebėkite unikalių lankytojų skaičių
- **Puslapių peržiūros**: Sekite, kurie svetainės puslapiai yra populiariausi
- **Sesijos trukmė**: Analizuokite, kiek laiko lankytojai praleidžia jūsų svetainėje
- **Srautų analizė**: Stebėkite, iš kur ateina jūsų svetainės lankytojai
- **Įrenginių informacija**: Gaukite informaciją apie lankytojų naudojamus įrenginius

## Privatumas

Vercel Web Analytics yra pritaikytas laikytis ES BDAR (GDPR) ir kitų privatumo reglamentų. Sistema:

- Nerenka asmeninės lankytojų informacijos
- Nenaudoja slapukų
- Neseka lankytojų tarp svetainių

## Pastabos programuotojams

Jei kuriate naujus komponentus, kurie nėra maršrutizuojami per pagrindinį App.tsx, nereikia papildomai įtraukti Analytics komponento, nes jis jau yra įdiegtas pagrindinėje aplikacijoje.

## Tolimesni žingsniai

- Sukonfigūruokite papildomas analitikos funkcijas Vercel valdymo skyde
- Nustatykite įspėjimus apie neįprastą lankytojų srautą
- Analizuokite duomenis reguliariai, kad optimizuotumėte svetainės veikimą 