# RSS Naujienų Importavimo Sistemos Testavimas

Šis dokumentas aprašo kaip testuoti ir naudoti RSS naujienų importavimo sistemą, naudojant pridėtus įrankius.

## Proxy serverių testavimas

### `test-api.js` naudojimas

Šis įrankis leidžia patikrinti, ar jūsų proxy serverių konfigūracija veikia tinkamai.

#### Paleidimas

```bash
# Nustatykite aplinkos kintamuosius, jei jie skiriasi nuo standartinių
export REACT_APP_RSS_PROXY_URL=/api/rssfeed
export REACT_APP_TRANSLATION_PROXY_URL=/api/translate

# Paleiskite testavimo įrankį
node test-api.js
```

#### Testavimo rezultatai

Įrankis atlieka du testus:

1. **RSS Proxy testas**:
   - Bando gauti duomenis iš nurodyto RSS šaltinio per proxy serverį
   - Patikrina, ar atsakymas yra validus RSS/Atom formatas
   - Parodo gaunamų duomenų dydį

2. **Vertimo Proxy testas**:
   - Bando išversti testinį tekstą per proxy serverį
   - Tikrina, ar vertimas yra lietuvių kalba
   - Rodo vertimo rezultatą

#### Įspėjimai ir klaidos

Jei testas nepavyksta, jūs matote klaidos pranešimą, nurodantį problemą:

- **HTTP klaidos** reiškia, kad proxy serveris nepasiekiamas arba grąžina klaidą
- **RSS turinio klaidos** reiškia, kad gautas turinys nėra validus RSS formatas
- **Vertimo klaidos** gali reikšti neveikiantį API raktą arba DeepL API apribojimus

## RSS importavimas komandinėje eilutėje

### `import-rss.js` naudojimas

Šis įrankis leidžia importuoti RSS naujienas tiesiogiai iš komandinės eilutės be vartotojo sąsajos.

#### Paleidimas

```bash
# Paleiskite su pagrindiniais parametrais
node import-rss.js --api-key="jūsų-deepl-api-raktas" --limit=1

# Nurodykite kitą RSS šaltinį
node import-rss.js --rss="https://example.com/feed.xml" --api-key="jūsų-deepl-api-raktas"

# Importuokite daugiau naujienų
node import-rss.js --api-key="jūsų-deepl-api-raktas" --limit=5

# Pagalbos rodymas
node import-rss.js --help
```

#### Parametrai

- `--rss=URL` - RSS šaltinio adresas (numatytasis: https://knowtechie.com/category/ai/feed/)
- `--api-key=KEY` - DeepL API raktas (privalomas)
- `--limit=NUMBER` - Maksimalus naujienų kiekis (numatytasis: 1)
- `--help` arba `-h` - Rodyti pagalbos informaciją

#### Veikimo procesas

Įrankis atlieka šiuos veiksmus:

1. Gauna RSS turinį iš nurodyto šaltinio
2. Analizuoja RSS ir ištraukia naujienas
3. Rūšiuoja naujienas pagal datą (naujausia viršuje)
4. Paima tik nurodytą kiekį naujienų
5. Verčia kiekvienos naujienos antraštę, aprašymą ir turinį
6. Rodo vertimo rezultatus

#### Pastabos

- Šis įrankis **neįrašo duomenų į duomenų bazę** - jis skirtas tik testavimui
- API raktas perduodamas tiesiai į proxy serverį
- Priešingai nei vartotojo sąsajoje, šis įrankis nėra apribotas vienos naujienos per dieną - jūs galite nurodyti bet kokį limitą

## Dažniausios problemos ir sprendimai

### CORS klaidos

Jei matote CORS klaidas, patikrinkite:

1. Ar teisingai nustatyti aplinkos kintamieji:
   ```
   REACT_APP_RSS_PROXY_URL=/api/rssfeed
   REACT_APP_TRANSLATION_PROXY_URL=/api/translate
   ```

2. Ar proxy serveriai veikia:
   - Paleiskite `test-api.js`
   - Patikrinkite, ar galite pasiekti `/api/rssfeed` ir `/api/translate` per naršyklę

### Proxy serverio klaidos

Jei proxy serveriai neveikia:

1. Patikrinkite, ar Vercel serverless funkcijos yra įdiegtos
2. Patikrinkite, ar failai `/api/rssfeed.js` ir `/api/translate.js` egzistuoja
3. Išvalykite Vercel diegimų talpyklą ir iš naujo įdiekite

### DeepL API klaidos

Dažniausios DeepL API problemos:

1. **403 Forbidden** - Neteisingas API raktas
2. **429 Too Many Requests** - Viršytas API užklausų limitas
3. **456 Quota Exceeded** - Viršytas mėnesinis simbolių limitas (500,000)

## Tolimesni testavimo plėtiniai

- Integraciniai testai su naujienų duomenų baze
- Automatizuoti API testai
- Streso testai dideliam kiekiui naujienų
- Vartotojo sąsajos automatiniai testai 