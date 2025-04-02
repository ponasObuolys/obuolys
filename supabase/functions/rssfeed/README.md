# RSS Feed Proxy Serveris (Supabase Edge Funkcija)

Ši serverio funkcija veikia kaip tarpininkas (proxy) tarp jūsų svetainės ir RSS šaltinio, leidžianti apeiti CORS apribojimus.

## Problema

Kai bandote kreiptis į išorinius RSS šaltinius tiesiogiai iš naršyklės JavaScript kodo, galite gauti CORS klaidą:

```
Access to fetch at 'https://knowtechie.com/category/ai/feed/' has been blocked by CORS policy
```

## Sprendimas

Šis proxy serveris priima HTTP užklausas iš jūsų kodo ir perduoda jas į RSS šaltinį, tada grąžina atsakymą. Kadangi serveris turi tinkamas CORS antraštes, naršyklė leidžia kreiptis į jį.

## Funkcijos diegimas

### Pasiruoškite

1. Įdiekite Supabase CLI:
   ```
   npm install -g supabase
   ```
   arba
   ```
   brew install supabase/tap/supabase
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
   supabase functions deploy rssfeed
   ```

3. Įsitikinkite, kad funkcija yra įdiegta:
   ```
   supabase functions list
   ```

### Konfigūruokite klientą

1. Svetainės projekte sukurkite arba atnaujinkite `.env` failą:
   ```
   REACT_APP_RSS_PROXY_URL=https://[jūsų-projektas].supabase.co/functions/v1/rssfeed
   ```

## Kaip naudoti

Funkcija veikia kaip proxy serveris RSS šaltiniui. Ji priima parametre nurodytą RSS URL:

```
https://[jūsų-projektas].supabase.co/functions/v1/rssfeed?url=https://knowtechie.com/category/ai/feed/
```

RSS importavimo sistema automatiškai naudos šį proxy serverį, jei aplinkos kintamasis `REACT_APP_RSS_PROXY_URL` yra nustatytas.

## Saugumo pastabos

- Šiuo metu funkcija leidžia prieigą iš bet kurio domeno (`Access-Control-Allow-Origin: *`)
- Produkciniame variante rekomenduojama apriboti prieigą tik jūsų svetainės domenui

## Tolimesni patobulinimai

1. Įdiegti autentifikaciją Edge funkcijai (naudojant Supabase Auth)
2. Pridėti RSS turinio kešavimą (cache), kad būtų sumažintas užklausų kiekis į RSS šaltinį
3. Apriboti prieigą prie funkcijos tik iš jūsų svetainės domeno 