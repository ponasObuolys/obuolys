# RSS Naujienų Importavimo Sistema - Pakeitimų žurnalas

## 2023-07-15: Proxy Serverių Patobulinimai

### Nauji komponentai

- **Komandinis įrankis**: Pridėtas `import-rss.js` - Node.js komandinis įrankis, leidžiantis atlikti RSS naujienų importavimą iš komandinės eilutės
- **Testavimo įrankis**: Pridėtas `test-api.js` - aplinkos kintamųjų ir proxy serverių veikimo testavimo įrankis

### Patobulinti Vercel proxy serveriai

- **RSS proxy (`/api/rssfeed.js`)**:
  - Pridėta išsamesnė HTTP antraščių konfigūracija pagerinimui suderinamumo su įvairiais RSS šaltiniais
  - Optimizuotas klaidų valdymas ir pranešimų logavimas
  - Pridėtas atsakymo dydžio limitavimas/optimizavimas
  - Pridėta automatinė antraščių perdavimo funkcija iš originalo

- **DeepL proxy (`/api/translate.js`)**:
  - Implementuotas didelių tekstų automatinis skaidymas į segmentus
  - Pridėtas išsamus DeepL API klaidų apdorojimas pagal klaidų kodus
  - Optimizuotas atminties naudojimas

### RssFeedService pakeitimai

- Atnaujintas `fetchRssItems` metodas efektyvesniam bendravimui su proxy serveriais
- Pridėta papildoma HTTP antraščių optimizacija
- Implementuota geresnė klaidų apdorojimo logika ir informatyvesni pranešimai
- Pridėta `translateTextPart` pagalbinė funkcija efektyviam didelių tekstų vertimui

### RssSettingsPanel pakeitimai

- Atnaujinta vartotojo sąsaja su aiškesniais paaiškinimais
- Pridėta informacija apie jau sukonfigūruotus proxy serverius
- Nauja sekcija su Supabase alternatyviu sprendimu
- Pagerinti pranešimai apie proxy serverių būseną

### Dokumentacijos atnaujinimai

- **README.md**: Atnaujinta su išsamia informacija apie proxy serverių funkcionalumą
- **RSS_INFO.md**: Pridėta detalesnė informacija apie teksto skaidymą, HTTP antraštes ir klaidų apdorojimą
- Nauja lentelė su proxy serverių funkcionalumo palyginimu

## 2023-07-01: Pagrindiniai pakeitimai

- Pakeistas Google Translate API į DeepL API
- Pridėta galimybė importuoti tik vieną naujieną per dieną
- Išspręsta CORS problema su proxy serveriais
- Pridėtas serverio klaidų apdorojimas 