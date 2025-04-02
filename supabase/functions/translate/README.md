# DeepL API Proxy Serveris (Supabase Edge Funkcija)

Ši serverio funkcija veikia kaip tarpininkas (proxy) tarp jūsų svetainės ir DeepL API, leidžianti apeiti CORS apribojimus.

## Problema

Kai bandote kreiptis į DeepL API tiesiogiai iš naršyklės JavaScript kodo, gaunate CORS klaidą:

```
Access to fetch at 'https://api-free.deepl.com/v2/translate' has been blocked by CORS policy
```

## Sprendimas

Šis proxy serveris priima HTTP užklausas iš jūsų kodo ir perduoda jas į DeepL API, tada grąžina atsakymą. Kadangi serveris turi tinkamas CORS antraštes, naršyklė leidžia kreiptis į jį.

## Funkcijos diegimas

### Pasiruoškite

1. Įdiekite Supabase CLI:
   ```
   npm install -g supabase
   ```

2. Prisiregistruokite prie Supabase:
   ```
   supabase login
   ```

### Įdiekite funkciją

1. Susiekite projektą:
   ```
   supabase link --project-ref <jūsų-projekto-id>
   ```

2. Įdiekite funkciją:
   ```
   supabase functions deploy translate
   ```

3. Įsitikinkite, kad funkcija yra įdiegta:
   ```
   supabase functions list
   ```

### Konfigūruokite klientą

1. Svetainės projekte sukurkite `.env` failą pagal `.env.example` šabloną
2. Nustatykite `REACT_APP_TRANSLATION_PROXY_URL` reikšmę į jūsų Edge funkcijos URL:
   ```
   REACT_APP_TRANSLATION_PROXY_URL=https://[jūsų-projektas].supabase.co/functions/v1/translate
   ```

## Kaip naudoti

Kai aplinkos kintamasis `REACT_APP_TRANSLATION_PROXY_URL` yra nustatytas, RSS naujienų importavimo sistema automatiškai naudos šį proxy serverį DeepL API užklausoms.

## Saugumo pastabos

- Šiuo metu funkcija leidžia prieigą iš bet kurio domeno (`Access-Control-Allow-Origin: *`)
- Produkciniame variante rekomenduojama apriboti prieigą tik jūsų svetainės domenui
- DeepL API raktas vis tiek perduodamas iš kliento, todėl nėra visiškai saugus

## Tolimesni patobulinimai

1. Įdiegti autentifikaciją Edge funkcijai (naudojant Supabase Auth)
2. Saugoti DeepL API raktą serverio pusėje, o ne kliento naršyklėje
3. Apriboti prieigą prie funkcijos tik iš jūsų svetainės domeno 