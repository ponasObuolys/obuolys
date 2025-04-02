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
   - RSS šaltinio URL (pvz., https://rss.app/feeds/2TLki4gRlr57man8.xml)
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

### Duomenų srautai

1. Naujienos gaunamos iš RSS šaltinio
2. Ištraukiama reikalinga informacija (pavadinimas, aprašymas, turinys, nuorodos, paveikslėliai)
3. Patikrinama, ar jau pasiektas dienos limitas (1 naujiena per dieną)
4. Turinys verčiamas į lietuvių kalbą naudojant DeepL API
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

## Saugumo pastabos

- **SVARBU**: API raktų niekada nereikėtų saugoti viešai prieinamuose failuose ar kode
- Sistemoje API raktai saugomi localStorage, produkciniame variante rekomenduojama naudoti saugesnį sprendimą
- Rekomenduojama apriboti prieigą prie administravimo skydelio tik autorizuotiems vartotojams

## Tobulinimo galimybės

- Vertimo šaltinio pasirinkimas (Google, Microsoft, DeepL ir kt.)
- Vertimo kalbos pasirinkimas
- Daugiau RSS šaltinių valdymas
- Naujienų kategorijų automatinis nustatymas
- Konfigūruojamas naujienų limitų nustatymas per administravimo sąsają
