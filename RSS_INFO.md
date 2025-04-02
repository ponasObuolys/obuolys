# RSS Naujienų Importavimo Sistema - Dokumentacija

## Sistemos apžvalga

RSS Naujienų Importavimo Sistema sukurta automatizuoti naujienų importavimą iš išorinių šaltinių, jų vertimą į lietuvių kalbą ir publikavimą "Ponas Obuolys" svetainėje. Sistema sukurta taip, kad būtų lengvai plečiama ir pritaikoma įvairiems RSS šaltiniams.

## Komponentai

### 1. RssFeedService

Tai yra pagrindinis komponentas, atsakingas už:

- RSS feed duomenų gavimą iš nurodytų šaltinių
- Straipsnių turinio apdorojimą
- Vertimą į lietuvių kalbą
- Paveikslėlių parsisiuntimą ir įkėlimą į Supabase
- Duomenų išsaugojimą duomenų bazėje
- Naujienų limitų kontroliavimą (1 naujiena per dieną)

#### Pagrindiniai metodai:

- `fetchRssItems()`: Gauna ir analizuoja RSS srautą
- `translateText()`: Verčia tekstą naudojant DeepL API
- `uploadImage()`: Parsiunčia ir įkelia paveikslėlius
- `createNewsItem()`: Sukuria naują įrašą duomenų bazėje
- `getNewsCountForToday()`: Patikrina, kiek naujienų jau buvo importuota šiandien
- `processRssFeeds()`: Pagrindinis metodas, kuris organizuoja visą procesą

### 2. RssSchedulerService

Atsakingas už periodinį naujienų atnaujinimą pagal nustatytą grafiką.

- `startScheduler()`: Pradeda periodinį atnaujinimą
- `stopScheduler()`: Sustabdo periodinį atnaujinimą
- `updateNews()`: Atlieka atnaujinimą iškvieisdamas RssFeedService

### 3. RssSettingsPanel

Administratoriaus sąsajos komponentas, kuris leidžia:

- Konfigūruoti RSS šaltinius
- Nustatyti atnaujinimo intervalą
- Įvesti API raktus vertimui
- Rankinio atnaujinimo inicijavimą
- Įjungti/išjungti automatinį atnaujinimą

## Duomenų struktūra

### RSS elemento duomenų struktūra

```typescript
interface RssItem {
  title: string;       // Straipsnio pavadinimas
  description: string; // Trumpas aprašymas
  link: string;        // Nuoroda į originalų straipsnį
  pubDate: string;     // Publikavimo data
  content: string;     // Pilnas straipsnio turinys
  imageUrl?: string;   // Pagrindinė paveikslėlio nuoroda (jei yra)
}
```

### Išsaugomo straipsnio struktūra (Supabase duomenų bazėje)

Naujienos išsaugomos 'news' lentelėje su šiais pagrindiniais laukais:

- `title`: Išverstas straipsnio pavadinimas
- `description`: Išverstas straipsnio aprašymas
- `content`: Išverstas straipsnio turinys + originali nuoroda
- `slug`: Automatiškai sugeneruotas URL-draugiškas identifikatorius
- `date`: Straipsnio publikavimo data
- `author`: "RSS" (nurodant, kad tai automatiškai importuota naujiena)
- `published`: true (publikuojama iš karto)
- `image_url`: Įkelto paveikslėlio URL (jei paveikslėlis buvo rastas)

## Naujienų limitavimas

Sistema konfigūruota automatiškai importuoti tik **vieną naują naujieną per dieną**. Šis apribojimas įdiegtas, kad būtų išvengta:

1. Per didelio kiekio naujienų vienu metu
2. Perteklinio vertimo API naudojimo
3. Perkrautų vartotojo sąsajos naujienų sąrašų

### Limitavimo mechanizmas

- `getNewsCountForToday()` metodas patikrina, kiek šiandien jau yra importuota naujienų
- Jei rastas maksimalus leistinas kiekis (1), importavimas stabdomas
- Kitu atveju importuojama naujausia RSS srauto naujiena
- Patikriname egzistuojančias naujienas, kad išvengtume dublikatų
- Importuojamos tik tos naujienos, kurių dar nėra sistemoje

## Vertimo procesas

1. Sistema naudoja DeepL API straipsnių vertimui
2. Verčiami šie elementai:
   - Straipsnio pavadinimas
   - Straipsnio aprašymas
   - Straipsnio turinys (visas HTML)
3. Naudojami DeepL API parametrai:
   - `source_lang`: 'EN' (šaltinio kalba)
   - `target_lang`: 'LT' (tikslinė kalba)
   - `tag_handling`: 'html' (HTML žymėjimo išsaugojimas)
   - `preserve_formatting`: true (formatavimo išsaugojimas)
4. Vertimo API užklausos vykdomos POST metodu į `https://api-free.deepl.com/v2/translate`
5. Autentifikacija vykdoma naudojant antraštę `Authorization: DeepL-Auth-Key YOUR_API_KEY`

### DeepL API konfigūracija

- **API raktas**: Turėtų būti saugomas saugioje vietoje, ne viešuose dokumentuose ar kode
- **API versija**: Free (nemokama versija)
- **Simbolių limitas**: 500,000 simbolių per mėnesį
- **Dokumentacija**: [DeepL API dokumentacija](https://www.deepl.com/docs-api)

### DeepL API privalumai

- Aukštos kokybės vertimai, artimi žmogaus verčiamam tekstui
- Puikus konteksto supratimas ir natūralios kalbos išlaikymas
- Nemokama versija (iki 500,000 simbolių per mėnesį)
- HTML turinio palaikymas, išsaugant formatavimą
- Paprastas API

### DeepL API užklausos pavyzdys

```javascript
const response = await fetch("https://api-free.deepl.com/v2/translate", {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `DeepL-Auth-Key ${apiKey}`
  },
  body: JSON.stringify({
    text: [textToTranslate],
    source_lang: 'EN',
    target_lang: 'LT',
    tag_handling: 'html',
    preserve_formatting: true
  }),
});

const data = await response.json();
const translatedText = data.translations[0].text;
```

### DeepL API ir CORS apribojimų sprendimas

DeepL API, kaip ir daugelis kitų trečiųjų šalių API, turi CORS (Cross-Origin Resource Sharing) apribojimus, kurie neleidžia tiesiogiai kreiptis į API iš naršyklės, jei užklausa siunčiama iš kito domeno. Tai saugumo mechanizmas, kuris apsaugo API nuo piktnaudžiavimo.

#### Problemos aprašymas

Kai bandote tiesiogiai kreiptis į DeepL API iš naršyklės, gaunate tokią klaidą:
```
Access to fetch at 'https://api-free.deepl.com/v2/translate' from origin 'https://www.ponasobuolys.lt' 
has been blocked by CORS policy: Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

#### Sprendimas: Proxy serveris su Supabase Edge Functions

1. **Proxy serverio funkcija**
   - Sukurta Supabase Edge funkcija `/supabase/functions/translate/index.ts`
   - Ši funkcija veikia kaip tarpininkas tarp kliento ir DeepL API
   - Funkcija yra diegiama Supabase platformoje

2. **Kaip veikia proxy sprendimas**
   - Kliento kodas siunčia užklausą į Supabase Edge funkciją
   - Edge funkcija perduoda užklausą į DeepL API
   - Gauna atsakymą ir grąžina jį klientui
   - Prideda tinkamas CORS antraštes, kad leistų kreiptis iš bet kurio domeno

3. **Diegimo instrukcijos**
   - Įdiekite Supabase CLI įrankį: `npm install -g supabase`
   - Prisiregistruokite prie Supabase: `supabase login`
   - Susiekite projektą: `supabase link --project-ref <jūsų-projekto-id>`
   - Įdiekite funkciją: `supabase functions deploy translate`
   - Nustatykite aplinkos kintamąjį REACT_APP_TRANSLATION_PROXY_URL į Edge funkcijos URL

4. **Proxy serverio naudojimas**
   - RssFeedService automatiškai aptinka, ar aplinkos kintamasis REACT_APP_TRANSLATION_PROXY_URL yra nustatytas
   - Jei taip, naudoja proxy serverį užklausoms
   - Jei ne, bando naudoti tiesioginį ryšį (kuris greičiausiai nepavyks dėl CORS)

## Paveikslėlių apdorojimas

1. Sistema bando ištraukti paveikslėlio URL iš:
   - content:encoded arba encoded XML elementų
   - media:content elementų
   - enclosure elementų
2. Rastas paveikslėlis parsiunčiamas
3. Paveikslėlis įkeliamas į Supabase saugyklą (site-images/news/covers/)
4. Sugeneruojamas unikalus failo pavadinimas su laiko žyma

## Nustatymų išsaugojimas

Visi RSS nustatymai išsaugomi localStorage, kad būtų išlaikomi tarp naršyklės sesijų:

```typescript
interface RssSettings {
  rssUrl: string;             // RSS šaltinio URL
  translationApiKey: string;  // DeepL API raktas
  updateInterval: number;     // Atnaujinimo intervalas valandomis
  autoUpdateEnabled: boolean; // Ar įjungtas automatinis atnaujinimas
}
```

## Saugumo pastabos

1. API raktai saugomi tik kliento pusėje (localStorage)
2. **SVARBU**: API raktų niekada nereikėtų publikuoti viešai prieinamuose dokumentuose ar kode
3. Produkcijos aplinkoje rekomenduojama:
   - Perkelti vertimo logiką į serverio pusę
   - Naudoti saugesnį API raktų saugojimą (Supabase Auth, aplinkos kintamieji)
   - Pridėti papildomą autentifikaciją vertimo API užklausoms
   - Naudoti raktų rotacijos mechanizmą

## DeepL API apribojimai

1. **Nemokama versija:**
   - 500,000 simbolių per mėnesį
   - Ribotas užklausų dažnis (ne daugiau kaip 5 užklausos per sekundę)
   - HTTP statusai: 429 (Too Many Requests) jei viršijate limitus

2. **Mokama versija:**
   - Pro: 1,000,000+ simbolių per mėnesį
   - Pro Business: Neriboti vertimai su didesniu užklausų dažniu
   - Papildomi saugumo funkcionalumai

3. **Palaikomos kalbos:**
   - ~29 kalbos, įskaitant lietuvių
   - Pilnas sąrašas: [DeepL palaikomų kalbų sąrašas](https://www.deepl.com/docs-api/translating-text/)

## Plėtimo galimybės

### Trumpalaikiai patobulinimai

- Kelių RSS šaltinių palaikymas
- Automatinis kategorijų priskyrimas pagal raktažodžius
- Planuojamo publikavimo funkcija
- Konfigūruojamas naujienų limitų nustatymas

### Ilgalaikiai patobulinimai

- Serverio pusės vertimo API proxy
- Alternatyvių vertimo servisų integravimas (Microsoft, Amazon Translate)
- Automatinis turinio relevancijos vertinimas
- Sentimento analizė

## Naudojimo apribojimai

1. DeepL API turi limitą užklausoms (500,000 simbolių/mėn. nemokamoje versijoje)
2. RSS šaltinis turi būti prieinamas ir reguliariai atnaujinamas
3. Sistema šiuo metu palaiko tik vieną RSS šaltinį
4. **Sistema importuoja tik vieną naujieną per dieną**

## Išoriniai resursai

1. [DeepL API dokumentacija](https://www.deepl.com/docs-api)
2. [DeepL API kainodara](https://www.deepl.com/pro#developer)
3. [RSS specifikacija](https://validator.w3.org/feed/docs/rss2.html) 