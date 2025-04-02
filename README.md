# Ponas Obuolys - RSS Naujienų Importavimo Sistema

## Apie sistemą

Ši sistema leidžia automatiškai importuoti naujienas iš išorinių RSS šaltinių, išversti jas į lietuvių kalbą ir išsaugoti svetainės naujienų skiltyje.

## Pagrindinės funkcijos

1. **Automatinis RSS naujienų importavimas**
   - Periodinis naujienų atnaujinimas (viena naujiena per dieną)
   - Pasirinktas atnaujinimo intervalas
   - Rankinis atnaujinimo inicijavimas

2. **Naujienų vertimas**
   - Automatinis vertimas iš anglų į lietuvių kalbą
   - Naudojamas DeepL API (aukštos kokybės vertimai)

3. **Paveikslėlių išsaugojimas**
   - Automatinis paveikslėlių parsisiuntimas iš originalių šaltinių
   - Paveikslėlių įkėlimas į Supabase saugyklą

## Sistemos naudojimas

### Administratoriaus valdymo skydelyje

1. Eikite į **Administratoriaus valdymo skydelį**
2. Pasirinkite **RSS** skirtuką
3. Įveskite reikalingą informaciją:
   - RSS šaltinio URL (pvz., https://knowtechie.com/category/ai/feed/)
   - DeepL API raktas (API raktas jau sukonfigūruotas formoje)
   - Atnaujinimo intervalą (valandomis)
4. Įjunkite **Automatinis atnaujinimas** funkciją, jei norite, kad naujienos būtų atnaujinamos periodiškai
5. Paspauskite **Išsaugoti nustatymus**

### Rankinis atnaujinimas

Jei norite atnaujinti naujienas rankiniu būdu:

1. Administratoriaus valdymo skydelyje eikite į **RSS** skirtuką
2. Paspauskite **Atnaujinti dabar** mygtuką

### Naujienų limitai

Sistema automatiškai importuoja **tik vieną naujieną per dieną**. Tai yra apsauga nuo svetainės perkrovimo turiniu. Jei norite pridėti daugiau naujienų, galite:

1. Rankinio būdu pridėti naujienas naudodami **Naujienos** skirtuką administravimo skydelyje
2. Palaukti kitos dienos, kai sistema vėl automatiškai importuos dar vieną naujieną

## Techninė informacija

### Reikalavimai

- Supabase projektas su sukonfigūruota `news` lentele
- DeepL API raktas (nemokama versija pakankama)
- Veikianti interneto prieiga

### Sistemos architektūra

Sistemą sudaro šios pagrindinės dalys:

1. **RssFeedService** - atsakingas už RSS naujienų parsisiuntimą, vertimą ir saugojimą
2. **RssSchedulerService** - atsakingas už periodinį atnaujinimą
3. **RssSettingsPanel** - administratoriaus sąsaja nustatymų valdymui
4. **Proxy serveriai** - peržengti CORS apribojimus:
   - **Vercel Serverless funkcijos** (`/api/rssfeed.js` ir `/api/translate.js`)
   - **Supabase Edge funkcijos** (alternatyvus sprendimas)

### Duomenų srautai

1. Naujienos gaunamos iš RSS šaltinio per proxy serverį (Vercel arba Supabase)
2. Ištraukiama reikalinga informacija (pavadinimas, aprašymas, turinys, nuorodos, paveikslėliai)
3. Patikrinama, ar jau pasiektas dienos limitas (1 naujiena per dieną)
4. Turinys verčiamas į lietuvių kalbą naudojant DeepL API per proxy serverį
5. Paveikslėliai parsiunčiami ir įkeliami į Supabase saugyklą
6. Sukuriamas naujas įrašas 'news' lentelėje

## Pastabos

- Sistema prieš įkeliant naują naujiena patikrina, ar ji jau neegzistuoja (pagal originalią nuorodą)
- Paveikslėliai išsaugomi su unikaliais pavadinimais, kad būtų išvengta konfliktų
- DeepL API nemokama versija leidžia versti iki 500,000 simbolių per mėnesį
- Dėl sistemos limitų, naujienos importuojamos tik po vieną per dieną

## DeepL API informacija

- DeepL API dokumentacija: [https://www.deepl.com/docs-api](https://www.deepl.com/docs-api)
- DeepL API raktą galite gauti užsiregistravę: [https://www.deepl.com/pro#developer](https://www.deepl.com/pro#developer)
- Nemokama versija leidžia versti iki 500,000 simbolių per mėnesį
- API palaiko HTML turinio vertimą, išsaugant visus formatavimo žymėjimus

## CORS problemų sprendimas

### Problema

Tiek DeepL API, tiek išoriniai RSS šaltiniai turi CORS apribojimus, kurie neleidžia tiesiogiai kreiptis į juos iš naršyklės kodo. Dėl šios priežasties tiesioginis vertimas ir RSS gavimas gali neveikti svetainėje.

### Sprendimas: Jau įdiegti proxy serveriai

Sistemoje jau yra **įdiegti ir sukonfigūruoti** du sprendimai, kaip apeiti CORS apribojimus:

1. **Vercel Serverless funkcijos (pagrindinis sprendimas)**
   - Jau integruotos į projektą (`/api/translate.js` ir `/api/rssfeed.js`)
   - Patobulinti: 
     - Išsamesnis klaidų apdorojimas ir logavimas
     - Geresnis HTTP antraščių valdymas
     - Didelių tekstų skaidymas vertimui
     - RSS šaltinio duomenų optimizuotas gavimas

2. **Supabase Edge funkcijos (alternatyvus sprendimas)**
   - DeepL API: funkcijos kodas direktorijoje `/supabase/functions/translate/`
   - RSS šaltiniui: funkcijos kodas direktorijoje `/supabase/functions/rssfeed/`

### Aplinkos kintamieji

Sistemoje jau nustatyti šie aplinkos kintamieji:

```
REACT_APP_RSS_PROXY_URL=/api/rssfeed
REACT_APP_TRANSLATION_PROXY_URL=/api/translate
```

Šie kintamieji nurodo sistemai naudoti Vercel serverless funkcijas kaip proxy serverius. Jie jau sukonfigūruoti ir turėtų veikti be papildomų nustatymų.

### Ką daryti, jei vis tiek yra CORS klaidų?

Jei vis tiek pastebite CORS klaidas:

1. **Patikrinkite, ar Vercel aplinka turi teisingus aplinkos kintamuosius**:
   ```
   REACT_APP_RSS_PROXY_URL=/api/rssfeed
   REACT_APP_TRANSLATION_PROXY_URL=/api/translate
   ```

2. **Patikrinkite Vercel serverless funkcijų veikimą**:
   - Bandykite atidaryti `/api/rssfeed?url=https://knowtechie.com/category/ai/feed/` naršyklėje
   - Turėtumėte matyti RSS turinį XML formatu

3. **Įjunkite Supabase Edge funkcijas kaip alternatyvą**:
   - Jei Vercel sprendimas neveikia, sekite instrukcijas `RssSettingsPanel` skyriuje
   - Nustatykite aplinkos kintamuosius į Supabase Edge funkcijų URL

### Patobulinimai naujoje versijoje

1. **Išplėstinis klaidų apdorojimas**:
   - Detalesni klaidų pranešimai ir logavimas
   - Klaidų kategorijos pagal DeepL API dokumentaciją

2. **Teksto skaidymas**:
   - Didelių tekstų automatinis skaidymas į mažesnes dalis
   - Optimizuotas HTML turinio apdorojimas

3. **Geresnė vartotojo informacija**:
   - Aiškesni pranešimai apie proxy serverių statusą
   - Instrukcijos konfigūracijai

## Saugumo pastabos

- API raktai perduodami tik per serverio proxy
- RSS duomenys apdorojami per saugius proxy serverius
- Rekomenduojama apriboti prieigą prie administravimo skydelio tik autorizuotiems vartotojams

## Tobulinimo galimybės

- Vertimo šaltinio pasirinkimas (Google, Microsoft, DeepL ir kt.)
- Vertimo kalbos pasirinkimas
- Daugiau RSS šaltinių valdymas
- Naujienų kategorijų automatinis nustatymas
- Konfigūruojamas naujienų limitų nustatymas per administravimo sąsają
