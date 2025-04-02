# CORS problemos sprendimas su Vercel Serverless funkcijomis

Šis dokumentas aprašo, kaip naudoti Vercel serverless funkcijas kaip proxy serverius, siekiant apeiti CORS apribojimus.

## Problemos apžvalga

Daugelis išorinių API ir RSS šaltinių turi CORS (Cross-Origin Resource Sharing) apribojimus, kurie neleidžia tiesiogiai kreiptis į juos iš naršyklės JavaScript kodo. Dėl to gaunamos klaidos:

```
Access to fetch at 'https://api-free.deepl.com/v2/translate' has been blocked by CORS policy
Access to fetch at 'https://knowtechie.com/category/ai/feed/' has been blocked by CORS policy
```

## Sprendimas

Naudojame Vercel serverless funkcijas kaip proxy serverius, kurie perduoda užklausas į išorinius šaltinius ir grąžina atsakymus su tinkamomis CORS antraštėmis.

## Įdiegtos funkcijos

1. **RSS proxy serveris (`/api/rssfeed.js`)**
   - Perduoda užklausas į RSS šaltinius
   - Naudojamas URL: `/api/rssfeed?url=https://knowtechie.com/category/ai/feed/`

2. **DeepL API proxy serveris (`/api/translate.js`)**
   - Perduoda vertimo užklausas į DeepL API
   - Priima POST užklausas su tekstu, kurį reikia išversti

## Kaip naudoti

### 1. Aplinkos kintamieji

Jei naudojate Vercel, nustatykite šiuos aplinkos kintamuosius projekto nustatymuose:

```
REACT_APP_RSS_PROXY_URL=/api/rssfeed
REACT_APP_TRANSLATION_PROXY_URL=/api/translate
```

### 2. Programinė įranga jau yra pritaikyta

Mūsų RSS naujienų importavimo sistema automatiškai naudoja proxy serverius, jei aplinkos kintamieji yra nustatyti.

## Privalumai lyginant su Supabase Edge funkcijomis

1. **Paprastesnis diegimas**
   - Nereikia diegti papildomų įrankių (Supabase CLI)
   - Nereikia kurti ir valdyti atskiro Supabase projekto

2. **Automatinis diegimas**
   - Funkcijos diegiamos automatiškai su kitu kodu
   - Nereikia rankiniu būdu įkelti funkcijų

3. **Lengva priežiūra**
   - Visas kodas yra vienoje vietoje
   - Lengviau derinti, nes naudojama ta pati infrastruktūra

## Kaip tai veikia

1. **Kliento užklausa**
   - Vietoj tiesioginio kreipimosi į išorinį API, klientas kreipiasi į serverless funkciją
   - Pavyzdžiui: `/api/rssfeed?url=https://knowtechie.com/category/ai/feed/`

2. **Serverless funkcija**
   - Funkcija veikia Vercel serveryje
   - Ji perduoda užklausą į išorinį šaltinį
   - Gauna atsakymą ir prideda tinkamas CORS antraštes

3. **Atsakymas klientui**
   - Atsakymas grąžinamas klientui su tinkamomis CORS antraštėmis
   - Naršyklė leidžia priimti šį atsakymą

## Saugumo pastabos

1. **Atvira prieiga**
   - Šiuo metu serverless funkcijos leidžia prieigą iš bet kurio domeno
   - Produkciniame variante galite apriboti prieigą tik iš jūsų domeno

2. **Rate limiting**
   - Nepamirškite, kad per didelis užklausų kiekis į išorinius API gali viršyti jų limitus
   - Produkciniame variante rekomenduojama įdiegti "rate limiting" mechanizmą

## Išvados

Vercel serverless funkcijos yra paprastas ir efektyvus būdas apeiti CORS apribojimus. Jos leidžia naudoti išorinius API ir RSS šaltinius be papildomų įrankių ar infrastruktūros. 