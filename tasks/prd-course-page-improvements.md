# PRD: Kurso Puslapio Patobulinimai ir Admin Valdymas

## 1. Įvadas/Apžvalga

Šis PRD aprašo kurso puslapio patobulinimus, skirtus padidinti konversiją ir supaprastinti kursų valdymą per Admin panelę. Dabartinis kurso puslapis turi keletą problemų: trūksta atsiliepimų, vietų skaičiaus rodiklio, FAQ sekcijos, o daugelis elementų yra hardcoded ir negali būti keičiami per Admin.

**Problema:** Kurso puslapis nepakankamai efektyviai konvertuoja lankytojus į pirkėjus dėl trūkstamų trust signals ir urgency elementų. Be to, kiekvienas pakeitimas reikalauja kodo modifikacijų.

**Tikslas:** Sukurti lankstų, per Admin valdomą kurso puslapį su visais reikalingais konversijos elementais.

---

## 2. Tikslai

1. **Padidinti konversiją** pridedant atsiliepimus, vietų skaičių ir FAQ
2. **Supaprastinti valdymą** - visi kurso elementai valdomi per Admin panelę
3. **Pagerinti mobilią patirtį** - vertės skaičiavimas matomas ir mobiliuosiuose
4. **Pašalinti klaidinančius elementus** - video pašalinimas, CTA teksto pakeitimas
5. **Pataisyti SEO** - dinaminis meta tags veikimas

---

## 3. User Stories

### Administratorius
- **US1:** Kaip administratorius, noriu pridėti/redaguoti atsiliepimus per Admin panelę, kad galėčiau atnaujinti socialinį įrodymą be kodo pakeitimų.
- **US2:** Kaip administratorius, noriu nustatyti vietų limitą ir pradžios datą, kad sistema automatiškai skaičiuotų likusias vietas.
- **US3:** Kaip administratorius, noriu pridėti FAQ klausimus kiekvienam kursui atskirai.
- **US4:** Kaip administratorius, noriu keisti CTA mygtuko tekstą per Admin.
- **US5:** Kaip administratorius, noriu nurodyti PDF gidų sąrašą, kuris bus rodomas kurso puslapyje.

### Lankytojas
- **US6:** Kaip lankytojas, noriu matyti kitų dalyvių atsiliepimus, kad įsitikinčiau kurso kokybe.
- **US7:** Kaip lankytojas, noriu matyti kiek liko vietų, kad suprasčiau urgency.
- **US8:** Kaip lankytojas, noriu rasti atsakymus į dažniausius klausimus FAQ sekcijoje.
- **US9:** Kaip lankytojas mobiliajame, noriu matyti kurso vertės skaičiavimą.
- **US10:** Kaip lankytojas, noriu matyti ką gausiu (PDF gidus) po kurso.

---

## 4. Funkciniai Reikalavimai

### 4.1 Atsiliepimų Sistema

| # | Reikalavimas |
|---|-------------|
| FR1.1 | Sistema turi leisti kurti atsiliepimus su laukais: vardas, tekstas, kurso ID, sukūrimo data |
| FR1.2 | Sistema turi leisti priskirti atsiliepimus konkrečiam kursui |
| FR1.3 | Kurso puslapyje turi būti rodomi 3-4 atsiliepimų kortelės |
| FR1.4 | Atsiliepimų kortelė turi rodyti: vardą ir atsiliepimo tekstą |
| FR1.5 | Admin panelėje turi būti galimybė kurti, redaguoti, trinti atsiliepimus |
| FR1.6 | Atsiliepimų eilės tvarka turi būti valdoma per Admin |

### 4.2 Vietų Skaičiavimo Sistema

| # | Reikalavimas |
|---|-------------|
| FR2.1 | Kursas turi turėti laukus: max_spots (pradinis vietų skaičius), course_start_date |
| FR2.2 | Sistema turi automatiškai skaičiuoti likusias vietas pagal formulę |
| FR2.3 | Formulė: pradedant nuo max_spots, mažinti taip, kad kurso dieną liktų 5 vietos |
| FR2.4 | Kurso puslapyje turi būti rodomas "Liko X vietų iš Y" rodiklis |
| FR2.5 | Kai lieka 0 vietų, rodyti "Vietų neliko" |
| FR2.6 | Vietų skaičius turi būti matomas šalia pirkimo mygtuko |

### 4.3 FAQ Sistema

| # | Reikalavimas |
|---|-------------|
| FR3.1 | Sistema turi leisti kurti FAQ įrašus su laukais: klausimas, atsakymas, kurso ID, eilės numeris |
| FR3.2 | Kiekvienas kursas turi turėti savo FAQ sąrašą |
| FR3.3 | Kurso puslapyje FAQ turi būti rodomas kaip accordion komponentas |
| FR3.4 | Admin panelėje turi būti galimybė kurti, redaguoti, trinti, pertvarkyti FAQ |
| FR3.5 | FAQ sekcija turi būti rodoma po kurso aprašymo |

### 4.4 PDF Gidų Sąrašas

| # | Reikalavimas |
|---|-------------|
| FR4.1 | Kursas turi turėti lauką: pdf_guides (masyvas su gidų pavadinimais) |
| FR4.2 | Kurso puslapyje turi būti "Ką gausite" sekcija su gidų sąrašu |
| FR4.3 | Kiekvienas gidas rodomas kaip sąrašo elementas su ikona |
| FR4.4 | Admin panelėje turi būti galimybė pridėti/pašalinti gidus iš sąrašo |

### 4.5 CTA Mygtuko Valdymas

| # | Reikalavimas |
|---|-------------|
| FR5.1 | Kursas turi turėti lauką: cta_button_text (numatytasis: "Registruokis į kursą") |
| FR5.2 | Visi pirkimo mygtukai kurso puslapyje turi naudoti šį tekstą |
| FR5.3 | Admin panelėje turi būti galimybė keisti CTA tekstą |

### 4.6 Mobilios Vertės Skaičiavimas

| # | Reikalavimas |
|---|-------------|
| FR6.1 | Hero sekcijoje mobiliesiems turi būti rodoma sutrumpinta vertės informacija |
| FR6.2 | Sutrumpinta versija: bendra vertė ir dabartinė kaina (pvz. "900€ vertė → 97€") |
| FR6.3 | Turi būti matoma prieš pirkimo mygtuką |

### 4.7 Video Pašalinimas

| # | Reikalavimas |
|---|-------------|
| FR7.1 | Pašalinti YouTube video iframe iš kurso puslapio |
| FR7.2 | Pašalinti susijusį kodą iš CourseDetail.tsx |

### 4.8 SEO Meta Tags

| # | Reikalavimas |
|---|-------------|
| FR8.1 | Kurso puslapio title turi būti: "[Kurso pavadinimas] | Ponas Obuolys" |
| FR8.2 | OG title ir description turi atitikti kurso duomenis |
| FR8.3 | Dinaminis SEO turi perrašyti default index.html meta tags |

### 4.9 Admin Panelės Kurso Forma

| # | Reikalavimas |
|---|-------------|
| FR9.1 | Kurso kūrimo/redagavimo forma turi turėti šiuos laukus: |
| | - Baziniai: pavadinimas, slug, aprašymas, turinys, kaina, trukmė, lygis, paveikslėlis |
| | - Highlights (masyvas) |
| | - FAQ valdymas (pridėti/redaguoti/trinti) |
| | - Atsiliepimų pasirinkimas (multi-select iš esamų) |
| | - Vietų limitas (max_spots) |
| | - Kurso pradžios data (course_start_date) |
| | - Countdown pabaigos data |
| | - PDF gidų sąrašas |
| | - CTA mygtuko tekstas |
| FR9.2 | Forma turi turėti preview režimą |

---

## 5. Ne-tikslai (Out of Scope)

1. **Realus vietų skaičiavimas** - Stripe pirkimai neįtakoja vietų rodiklio (tik kosmetinis)
2. **PDF failų įkėlimas** - Gidai jau sukurti, tik pavadinimų sąrašas
3. **Video funkcionalumas** - Visiškai pašalinamas, ne perkeliamas
4. **Pinigų grąžinimo garantija** - Neįtraukta į šį PRD
5. **Exit-intent popup** - Neįtraukta į šį PRD
6. **A/B testavimas** - Neįtraukta į šį PRD

---

## 6. Dizaino Svarstymai

### Atsiliepimų kortelės
- Kortelės su citatos ikona
- Vardas bold, tekstas regular
- 3-4 kortelės grid'e (desktop: 3 stulpeliai, mobile: 1)

### Vietų rodiklis
- Ryškus badge šalia kainos
- Spalva keičiasi pagal likusias vietas:
  - >10: žalia
  - 5-10: oranžinė
  - <5: raudona

### FAQ Accordion
- Naudoti shadcn/ui Accordion komponentą
- Klausimas bold, atsakymas regular
- Smooth animacija

### Mobilios vertės breakdown
- Kompaktiškas: "Vertė 900€ → Tik 97€"
- Arba: perbraukta sena kaina, nauja kaina

---

## 7. Techniniai Svarstymai

### Duomenų bazės pakeitimai
```sql
-- Nauji laukai courses lentelėje
ALTER TABLE courses ADD COLUMN max_spots INTEGER DEFAULT 30;
ALTER TABLE courses ADD COLUMN course_start_date TIMESTAMPTZ;
ALTER TABLE courses ADD COLUMN pdf_guides TEXT[] DEFAULT '{}';
ALTER TABLE courses ADD COLUMN cta_button_text TEXT DEFAULT 'Registruokis į kursą';

-- Nauja lentelė atsiliepimams
CREATE TABLE course_testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id),
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Nauja lentelė FAQ
CREATE TABLE course_faq (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Vietų skaičiavimo logika
```typescript
function calculateRemainingSpots(maxSpots: number, startDate: Date): number {
  const now = new Date();
  const start = new Date(startDate);
  
  // Jei kursas jau prasidėjo
  if (now >= start) return 5;
  
  // Skaičiuojame dienas iki kurso
  const daysUntilStart = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  // Kiek vietų turi sumažėti per dieną, kad liktų 5
  const spotsToReduce = maxSpots - 5;
  const totalDays = /* dienos nuo pardavimo pradžios iki kurso */;
  const dailyReduction = spotsToReduce / totalDays;
  
  const daysPassed = totalDays - daysUntilStart;
  const reduced = Math.floor(daysPassed * dailyReduction);
  
  return Math.max(5, maxSpots - reduced);
}
```

### Priklausomybės
- Naudoti esamus shadcn/ui komponentus (Accordion, Badge, Card)
- React Query kursų duomenims
- Supabase RLS politikos naujiems lentelėms

---

## 8. Sėkmės Metrikos

1. **Konversijos padidėjimas** - Stebėti pirkimų skaičių prieš/po pakeitimų
2. **Bounce rate sumažėjimas** - Mažiau lankytojų palieka puslapį
3. **Time on page** - Ilgesnis laikas puslapyje (skaito FAQ, atsiliepimus)
4. **Admin efektyvumas** - Pakeitimai atliekami per Admin, ne per kodą

---

## 9. Atviri Klausimai

1. ~~Ar reikia atsiliepimų moderavimo workflow?~~ → Ne, tik Admin kuria
2. ~~Ar FAQ atsakymuose reikia rich text?~~ → Pradžioje plain text, vėliau galima pridėti
3. Ar reikia atsiliepimų importo iš išorės (Google reviews)?

---

## 10. Pradiniai Duomenys

### Atsiliepimų tekstai (sukurti pagal dalyvių vardus)

| Vardas | Atsiliepimas |
|--------|-------------|
| Marius M. | "Kursas viršijo lūkesčius! Per 2 dienas išmokau daugiau nei per mėnesius bandydamas savarankiškai. Aurimo paaiškinimo stilius labai aiškus ir praktiškas." |
| Žilvinas B. | "Puikus kursas pradedantiesiems. Niekada nebuvau programavęs, bet dabar jau turiu savo pirmą veikiančią aplikaciją. Rekomenduoju visiems, kas nori pradėti!" |
| Laura M. | "Labai patiko praktinis požiūris - ne tik teorija, bet ir realūs projektai. DI įrankiai tikrai palengvina mokymąsi. Ačiū už šią galimybę!" |
| Evaldas N. | "Investicija, kuri atsipirko per savaitę. Jau gavau pirmą freelance užsakymą naudodamas kurse išmoktas technologijas. Verta kiekvieno euro!" |

### PDF Gidai

1. Git & GitHub Atmintinė
2. React & Tailwind Atmintinė
3. Custom Taisyklės Kodo Editoriams
4. Supabase & Vercel Atmintinė
5. Vibe Koderio Leksikonas
6. Vibe Koderio Projekto Konfigūracijos

---

## 11. Priedai

### Dabartinė kurso struktūra (courses lentelė)
- id, title, slug, description, content, price, duration, level
- highlights, image_url, published, promote_in_popup
- regular_price, discount_price, next_price, next_price_date
- value_items, total_value, stripe_product_id, stripe_price_id
- countdown_enabled, countdown_end_date, countdown_text

### Nauji laukai
- max_spots (INTEGER)
- course_start_date (TIMESTAMPTZ)
- pdf_guides (TEXT[])
- cta_button_text (TEXT)
