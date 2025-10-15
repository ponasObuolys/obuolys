-- Migration: Expand CTA and Hero sections for dynamic content management
-- Author: ponas Obuolys
-- Date: 2025-10-15
-- Description: Išplečia cta_sections ir hero_sections lenteles, kad palaikytų daugiau variantų ir kontekstų

-- ============================================
-- 1. CTA SECTIONS IŠPLĖTIMAS
-- ============================================

-- Pridedame naujus stulpelius cta_sections lentelei
ALTER TABLE public.cta_sections
ADD COLUMN IF NOT EXISTS context VARCHAR(50) DEFAULT 'article',
ADD COLUMN IF NOT EXISTS variant VARCHAR(50) DEFAULT 'default',
ADD COLUMN IF NOT EXISTS icon VARCHAR(50) DEFAULT 'Target',
ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_sticky BOOLEAN DEFAULT false;

-- Pridedame komentarus
COMMENT ON COLUMN public.cta_sections.context IS 'Kontekstas: article, tools, publications';
COMMENT ON COLUMN public.cta_sections.variant IS 'Variantas: default, compact, inline';
COMMENT ON COLUMN public.cta_sections.icon IS 'Lucide ikona: Target, Rocket, Sparkles, Brain, Zap, TrendingUp';
COMMENT ON COLUMN public.cta_sections.priority IS 'Rodymo prioritetas (didesnis = dažniau rodomas)';
COMMENT ON COLUMN public.cta_sections.is_sticky IS 'Ar rodyti sticky sidebar';

-- Sukuriame indeksą greitesniam filtravimui
CREATE INDEX IF NOT EXISTS idx_cta_sections_context_active ON public.cta_sections(context, active);
CREATE INDEX IF NOT EXISTS idx_cta_sections_priority ON public.cta_sections(priority DESC);

-- ============================================
-- 2. HERO SECTIONS IŠPLĖTIMAS
-- ============================================

-- Pridedame naujus stulpelius hero_sections lentelei
ALTER TABLE public.hero_sections
ADD COLUMN IF NOT EXISTS secondary_button_text TEXT,
ADD COLUMN IF NOT EXISTS secondary_button_url TEXT,
ADD COLUMN IF NOT EXISTS badge_text TEXT,
ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS show_stats BOOLEAN DEFAULT true;

-- Pridedame komentarus
COMMENT ON COLUMN public.hero_sections.secondary_button_text IS 'Antrinio mygtuko tekstas';
COMMENT ON COLUMN public.hero_sections.secondary_button_url IS 'Antrinio mygtuko URL';
COMMENT ON COLUMN public.hero_sections.badge_text IS 'Badge tekstas virš pavadinimo';
COMMENT ON COLUMN public.hero_sections.priority IS 'Rodymo prioritetas (didesnis = dažniau rodomas)';
COMMENT ON COLUMN public.hero_sections.show_stats IS 'Ar rodyti statistiką (straipsniai, įrankiai, kursai)';

-- Sukuriame indeksą
CREATE INDEX IF NOT EXISTS idx_hero_sections_active_priority ON public.hero_sections(active, priority DESC);

-- ============================================
-- 3. STICKY CTA MESSAGES LENTELĖ (NAUJA)
-- ============================================

CREATE TABLE IF NOT EXISTS public.sticky_cta_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    cta TEXT NOT NULL,
    emoji VARCHAR(10) DEFAULT '🚀',
    priority INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Komentarai
COMMENT ON TABLE public.sticky_cta_messages IS 'Sticky sidebar CTA žinutės';
COMMENT ON COLUMN public.sticky_cta_messages.emoji IS 'Emoji ikona prie pavadinimo';
COMMENT ON COLUMN public.sticky_cta_messages.priority IS 'Rodymo prioritetas (didesnis = dažniau rodomas)';

-- Indeksas
CREATE INDEX IF NOT EXISTS idx_sticky_cta_active_priority ON public.sticky_cta_messages(active, priority DESC);

-- Trigger updated_at
CREATE TRIGGER update_sticky_cta_messages_modtime
    BEFORE UPDATE ON public.sticky_cta_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- ============================================
-- 4. RLS POLITIKOS
-- ============================================

-- Įjungiame RLS sticky_cta_messages lentelei
ALTER TABLE public.sticky_cta_messages ENABLE ROW LEVEL SECURITY;

-- Viešas skaitymas aktyvių žinučių
CREATE POLICY "Allow public read access for active sticky messages"
    ON public.sticky_cta_messages
    FOR SELECT
    USING (active = true);

-- Admin gali viską
CREATE POLICY "Allow admin full access to sticky messages"
    ON public.sticky_cta_messages
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.is_admin = true
        )
    );

-- ============================================
-- 5. PRADINIAI DUOMENYS - CTA SECTIONS
-- ============================================

-- Išvalome senas CTA sekcijas (jei yra)
TRUNCATE TABLE public.cta_sections;

-- Įdedame VISUS CTA variantus (21 article, 19 tools, 19 publications)
INSERT INTO public.cta_sections (title, description, button_text, button_url, context, variant, icon, priority, active) VALUES
-- ARTICLE kontekstas (21 variantai)
('Norite tokio AI sprendimo savo verslui?', 'Sukuriame individualius AI įrankius, pritaikytus jūsų verslo poreikiams. Automatizuokite procesus ir padidinkite efektyvumą.', 'Aptarti projektą', '/verslo-sprendimai', 'article', 'default', 'Target', 100, true),
('Jūsų verslas nusipelno geresnių įrankių', 'Padidinkite produktyvumą iki 300% su AI sprendimais. Mes sukursime įrankį, kuris dirbs už jus 24/7.', 'Gauti pasiūlymą', '/verslo-sprendimai', 'article', 'default', 'Rocket', 95, true),
('Konkurentai jau naudoja AI. O jūs?', 'Nelikite nuošalyje. Integruokite AI į savo verslą ir aplenkite konkurenciją. Pirmoji konsultacija - nemokama!', 'Pradėti dabar', '/verslo-sprendimai', 'article', 'default', 'TrendingUp', 90, true),
('AI sprendimai, kurie atsipirks per 3 mėnesius', 'Investicija į AI - tai investicija į ateitį. Skaičiuojame ROI prieš pradedant projektą. Garantuojame rezultatus.', 'Sužinoti daugiau', '/verslo-sprendimai', 'article', 'default', 'Brain', 85, true),
('Sutaupykite 20 valandų per savaitę su AI', 'Automatizuokite pasikartojančius darbus ir skirkite laiką tam, kas tikrai svarbu. Mano klientai sutaupo vidutiniškai 20h per savaitę.', 'Skaičiuoti taupymą', '/verslo-sprendimai', 'article', 'default', 'Zap', 80, true),
('AI sprendimai, kurie veiks jau rytoj', 'Nereikia laukti mėnesių. Greitas diegimas, akivaizdūs rezultatai. Pradėkite naudoti AI jau šią savaitę.', 'Greitas startas', '/verslo-sprendimai', 'article', 'default', 'Rocket', 75, true),
('Klientų aptarnavimas 24/7 be papildomų darbuotojų', 'AI chatbotai, kurie atsako akimirksniu. Sumažinkite klientų aptarnavimo išlaidas iki 70%.', 'Išbandyti demo', '/verslo-sprendimai', 'article', 'default', 'Sparkles', 70, true),
('Duomenų analizė, kuri daro sprendimus už jus', 'AI, kuris analizuoja jūsų duomenis ir pateikia konkrečius veiksmus. Ne tik ataskaitos - realūs sprendimai.', 'Pamatyti pavyzdį', '/verslo-sprendimai', 'article', 'default', 'Brain', 65, true),
('Automatizuokite tai, kas kartojasi', 'Dokumentų apdorojimas, el. pašto atsakymai, duomenų įvedimas - visa tai gali daryti AI. Jūs - strategijai.', 'Rasti procesus', '/verslo-sprendimai', 'article', 'default', 'Target', 60, true),
('AI, kuris mokosi iš jūsų verslo', 'Ne šabloninis sprendimas, o AI, kuris supranta jūsų specifiką ir tobulėja kiekvieną dieną.', 'Sužinoti kaip', '/verslo-sprendimai', 'article', 'default', 'TrendingUp', 55, true),
('Pirmieji rezultatai per 2 savaites', 'Greitas MVP kūrimas ir testavimas. Matote rezultatus prieš investuodami daugiau. Jokių rizikų.', 'Pradėti testą', '/verslo-sprendimai', 'article', 'default', 'Rocket', 50, true),
('AI sprendimai nuo 500€/mėn', 'Prieinamos kainos, didelis poveikis. Pilnas palaikymas ir atnaujinimai įskaičiuoti. Be paslėptų mokesčių.', 'Peržiūrėti planus', '/verslo-sprendimai', 'article', 'default', 'Sparkles', 45, true),
('Jūsų komanda pamils šį AI įrankį', 'Intuityvūs sprendimai, kuriems nereikia mokymo. Jūsų darbuotojai pradės naudoti nuo pirmos dienos.', 'Pamatyti demo', '/verslo-sprendimai', 'article', 'default', 'Target', 40, true),
('AI, kuris dirba lietuvių kalba', 'Pilnai pritaikyti sprendimai lietuvių kalbai. Ne vertimas, o tikras supratimas. Idealiai veikia su lietuviškais tekstais.', 'Išbandyti', '/verslo-sprendimai', 'article', 'default', 'Brain', 35, true),
('Integruoju AI į jūsų sistemas', 'Dirba su tuo, ką jau naudojate. CRM, ERP, el. parduotuvė - prijungiu AI prie bet kokios sistemos.', 'Aptarti integraciją', '/verslo-sprendimai', 'article', 'default', 'Zap', 30, true),
('100+ sėkmingų AI projektų Lietuvoje', 'Patirtis su įvairiausiais verslais - nuo startuolių iki korporacijų. Žinau, kas veikia Lietuvos rinkoje.', 'Skaityti atvejus', '/verslo-sprendimai', 'article', 'default', 'TrendingUp', 25, true),
('AI sprendimai, kurie auga kartu su jumis', 'Pradėkite mažai, plėskite pagal poreikį. Modulinė architektūra leidžia pridėti funkcijas bet kada.', 'Planuoti augimą', '/verslo-sprendimai', 'article', 'default', 'Rocket', 20, true),
('Nemokama AI galimybių analizė jūsų verslui', '30 minučių konsultacija, kurioje identifikuosiu 3-5 procesus, kuriuos galima automatizuoti. Visiškai nemokamai.', 'Užsisakyti analizę', '/verslo-sprendimai', 'article', 'default', 'Target', 15, true),
('AI sprendimai su garantija', 'Jei per 3 mėnesius nematote rezultatų - grąžinsiu pinigus. Esu tikras savo sprendimų kokybe.', 'Skaityti garantiją', '/verslo-sprendimai', 'article', 'default', 'Sparkles', 10, true),
('Jūsų konkurentai jau tauposi su AI', 'Kol jūs svarstote, kiti jau automatizuoja. Nepavėluokite į traukinį - AI revoliucija vyksta dabar.', 'Neprarasti progos', '/verslo-sprendimai', 'article', 'default', 'Brain', 5, true),
('AI asistentas, kuris supranta jūsų verslą', 'Treniruoju AI su jūsų dokumentais, procesais ir žiniomis. Galit virtualų ekspertą, kuris dirba 24/7.', 'Sukurti asistentą', '/verslo-sprendimai', 'article', 'default', 'Zap', 1, true),

-- TOOLS kontekstas (19 variantų)
('Reikalingas pritaikytas AI įrankis?', 'Nematote tinkamo įrankio? Sukursiu Jums unikalų AI sprendimą, kuris idealiai atitiks Jūsų verslo tikslus.', 'Užsakyti įrankį', '/verslo-sprendimai', 'tools', 'default', 'Target', 100, true),
('Jūsų verslo problemos = Mūsų AI sprendimai', 'Turite specifinę problemą? Sukursiu AI įrankį, kuris ją išspręs. Jokių šablonų - tik individualūs sprendimai.', 'Aptarti idėją', '/verslo-sprendimai', 'tools', 'default', 'Sparkles', 95, true),
('Kodėl prisitaikyti, kai galima sukurti?', 'Standartiniai įrankiai nevisada tinka. Aų kuriu AI sprendimus, kurie 100% atitinka Jūsų procesus.', 'Pradėti projektą', '/verslo-sprendimai', 'tools', 'default', 'Rocket', 90, true),
('Nuo idėjos iki veikiančio įrankio per 2 savaites', 'Greitas AI įrankių kūrimas be kompromisų kokybei. Pilnas palaikymas ir mokymai įtraukti į kainą.', 'Užsakyti dabar', '/verslo-sprendimai', 'tools', 'default', 'Zap', 85, true),
('AI įrankis, kuris dirba kaip Jūsų darbuotojas', 'Ne tik automatizacija - tikras virtualus asistentas, kuris supranta kontekstą ir priima sprendimus.', 'Pamatyti galimybes', '/verslo-sprendimai', 'tools', 'default', 'Brain', 80, true),
('Integruojame AI į Jūsų darbo eigą', 'Nereikia keisti procesų - AI prisitaiko prie Jūsų. Veikia su visomis populiariausiomis sistemomis.', 'Aptarti integraciją', '/verslo-sprendimai', 'tools', 'default', 'Target', 75, true),
('AI įrankiai, kurie mokosi iš Jūsų duomenų', 'Kuo daugiau naudojate, tuo geresni rezultatai. Machine learning, kuris tobulėja kiekvieną dieną.', 'Sužinoti kaip', '/verslo-sprendimai', 'tools', 'default', 'TrendingUp', 70, true),
('Nuo paprasto chatbot''o iki sudėtingos sistemos', 'Bet kokio sudėtingumo AI sprendimai. Pradėkite paprastai, plėskite pagal poreikį.', 'Planuoti sprendimą', '/verslo-sprendimai', 'tools', 'default', 'Rocket', 65, true),
('AI įrankiai su lietuvių kalbos palaikymu', 'Pilnai veikia lietuviškai - nuo komandų iki ataskaitų. Ne vertimas, o tikras supratimas.', 'Išbandyti lietuviškai', '/verslo-sprendimai', 'tools', 'default', 'Sparkles', 60, true),
('Jūsų duomenys lieka pas Jus', 'Saugumas pirmoje vietoje. On-premise sprendimai arba privatus cloud. Pilna duomenų kontrolė.', 'Skaityti apie saugumą', '/verslo-sprendimai', 'tools', 'default', 'Target', 55, true),
('AI įrankiai nuo 500€/mėn', 'Prieinamos kainos už profesionalius sprendimus. Skaidrios sąlygos, be paslėptų mokesčių.', 'Peržiūrėti kainas', '/verslo-sprendimai', 'tools', 'default', 'Zap', 50, true),
('Nemokamas AI įrankio prototipas', 'Sukursiu veikiančią demo versiją nemokamai. Išbandykite prieš priimdami sprendimą.', 'Užsakyti demo', '/verslo-sprendimai', 'tools', 'default', 'Sparkles', 45, true),
('AI įrankiai, kurie dirba Jūsų komandai', 'Multi-vartotojų sprendimai su rolių valdymu. Visa komanda gali naudoti vienu metu.', 'Sužinoti daugiau', '/verslo-sprendimai', 'tools', 'default', 'Brain', 40, true),
('Automatizuokite tai, kas erzina', 'Nuobodūs, pasikartojantys darbai? AI juos atliks greičiau ir tiksliau. Jūsų komanda - kūrybai.', 'Rasti procesus', '/verslo-sprendimai', 'tools', 'default', 'TrendingUp', 35, true),
('AI įrankiai su API integracija', 'Prijunkite prie bet kokios sistemos. REST API, webhooks, real-time duomenų mainai.', 'Techninė dokumentacija', '/verslo-sprendimai', 'tools', 'default', 'Target', 30, true),
('Mobilios AI aplikacijos', 'AI įrankiai, kurie veikia telefone. iOS ir Android. Dirba net be interneto.', 'Pamatyti pavyzdžius', '/verslo-sprendimai', 'tools', 'default', 'Rocket', 25, true),
('AI įrankiai su analitika', 'Realaus laiko ataskaitos ir įžvalgos Matykite, kaip AI pagerina jūsų rezultatus.', 'Peržiūrėti dashboard', '/verslo-sprendimai', 'tools', 'default', 'Brain', 20, true),
('AI įrankiai su OCR technologija', 'Skenuokite dokumentus, AI ištrauks visą informaciją. Sąskaitos, sutartys, formos - automatiškai.', 'Pamatyti veikimą', '/verslo-sprendimai', 'tools', 'default', 'Zap', 15, true),
('24/7 palaikymas lietuvių kalba', 'Mano komanda visada pasiekiama. Greitas atsakymas, efektyvūs sprendimai. Jūsų sėkmė - mūsų prioritetas.', 'Susisiekti', '/verslo-sprendimai', 'tools', 'default', 'Target', 10, true),

-- PUBLICATIONS kontekstas (19 variantų)
('Paversk AI žinias į verslo rezultatus', 'Padėsime integruoti AI technologijas į Jūsų verslą. Konsultacijos, įrankių kūrimas ir diegimas.', 'Pradėti projektą', '/verslo-sprendimai', 'publications', 'default', 'Target', 100, true),
('Skaityti apie AI - gerai. Naudoti AI - geriau!', 'Jau žinote apie AI galimybes? Laikas jas pritaikyti savo versle. Padėsiu nuo A iki Z.', 'Konsultuotis', '/verslo-sprendimai', 'publications', 'default', 'Brain', 95, true),
('Kiekviena AI naujiena - tai nauja galimybė Jūsų verslui', 'Matote įdomią technologiją? Mes galime ją integruoti į Jūsų procesus. Būkite pirmieji rinkoje!', 'Aptarti galimybes', '/verslo-sprendimai', 'publications', 'default', 'TrendingUp', 90, true),
('AI ekspertizė + Jūsų verslo žinios = Sėkmė', 'Jūs žinote savo verslą, aš žinau AI. Kartu sukursime sprendimą, kuris veiks tobulai.', 'Susisiekti', '/verslo-sprendimai', 'publications', 'default', 'Rocket', 85, true),
('Matėte įdomų AI sprendimą straipsnyje?', 'Aš galiu jį pritaikyti Jūsų verslui. Nuo idėjos iki veikiančio sprendimo - viskas vienoje vietoje.', 'Aptarti idėją', '/verslo-sprendimai', 'publications', 'default', 'Sparkles', 80, true),
('Nuo AI naujienų iki realių sprendimų', 'Sekate AI naujienas? Puiku! Dabar laikas jas panaudoti. Padėsiu įgyvendinti tai, apie ką skaitote.', 'Pradėti veikti', '/verslo-sprendimai', 'publications', 'default', 'Zap', 75, true),
('Jūsų konkurentai skaito tas pačias naujienas', 'Skirtumas - kas pirmas pritaiko. Būkite pirmieji savo rinkoje su naujausiais AI sprendimais.', 'Aplenkti konkurentus', '/verslo-sprendimai', 'publications', 'default', 'TrendingUp', 70, true),
('AI konsultacija su realiais pavyzdžiais', 'Ne teorija, o konkretūs sprendimai jūsų verslui. Parodysime, kaip AI gali padėti jums.', 'Užsisakyti konsultaciją', '/verslo-sprendimai', 'publications', 'default', 'Brain', 65, true),
('Įkvėpė straipsnis? Sukurkime sprendimą!', 'Matėte įdomų AI pritaikymą? Aš galiu sukurti panašų arba dar geresnį Jūsų verslui.', 'Aptarti projektą', '/verslo-sprendimai', 'publications', 'default', 'Rocket', 60, true),
('Nuo ChatGPT iki individualaus AI', 'Naudojate ChatGPT? Įsivaizduokite AI, kuris žino Jūsų verslą. Mes jį sukursime.', 'Sužinoti kaip', '/verslo-sprendimai', 'publications', 'default', 'Target', 55, true),
('AI mokymai Jūsų komandai', 'Ne tik sprendimų kūrimas, bet ir komandos mokymas. Jūsų darbuotojai mokės naudoti AI efektyviai.', 'Peržiūrėti programą', '/verslo-sprendimai', 'publications', 'default', 'Sparkles', 50, true),
('Nemokama AI galimybių analizė', '30 min. konsultacija, kurioje aptarsime, kaip AI gali padėti būtent Jūsų verslui. Visiškai nemokamai.', 'Registruotis', '/verslo-sprendimai', 'publications', 'default', 'Zap', 45, true),
('AI strategija Jūsų verslui', 'Ne tik įrankiai, bet ir strategija. Padėsiu suplanuoti AI integraciją ilgalaikei perspektyvai.', 'Planuoti strategiją', '/verslo-sprendimai', 'publications', 'default', 'Brain', 40, true),
('Pritaikykite naujausias AI technologijas', 'GPT-5, Claude, Gemini - aš dirbu su naujausiais modeliais. Jūsų verslas gauna geriausią.', 'Pamatyti technologijas', '/verslo-sprendimai', 'publications', 'default', 'TrendingUp', 35, true),
('AI sprendimai lietuviškam verslui', 'Suprantu Lietuvos rinką ir specifiką. Sprendimai, kurie veikia čia ir dabar.', 'Lietuviški atvejai', '/verslo-sprendimai', 'publications', 'default', 'Target', 30, true),
('AI ROI skaičiuoklė Jūsų verslui', 'Suskaičiuosiu tikslią investicijos grąžą prieš pradedant. Žinosite, ko tikėtis.', 'Skaičiuoti ROI', '/verslo-sprendimai', 'publications', 'default', 'Sparkles', 25, true),
('Sektoriaus specifiniai AI sprendimai', 'E-commerce, gamyba, paslaugos, logistika - turiu patirties įvairiose srityse.', 'Rasti savo sektorių', '/verslo-sprendimai', 'publications', 'default', 'Brain', 20, true),
('AI diegimas be verslo sustabdymo', 'Integruoju AI be trikdžių Jūsų veiklai. Verslas dirba, AI diegiamas lygiagrečiai.', 'Sužinoti procesą', '/verslo-sprendimai', 'publications', 'default', 'Zap', 15, true),
('Ilgalaikis AI partnerystė', 'Ne tik sukuriu, bet ir palaikau. Jūsų AI sprendimai visada atnaujinti ir veikiantys.', 'Partnerystės sąlygos', '/verslo-sprendimai', 'publications', 'default', 'Target', 10, true);

-- ============================================
-- 6. PRADINIAI DUOMENYS - STICKY CTA MESSAGES
-- ============================================

INSERT INTO public.sticky_cta_messages (title, description, cta, emoji, priority, active) VALUES
('Greitas AI įrankis?', 'Nuo idėjos iki rezultato per 2 savaites', 'Užsakyti', '🚀', 100, true),
('Turite AI idėją?', 'Nemokama konsultacija su AI ekspertu', 'Konsultuotis', '💡', 95, true),
('AI automatizacija', 'Sutaupykite iki 20h per savaitę', 'Pradėti', '⚡', 90, true),
('Individualūs sprendimai', '100% pritaikyti Jūsų verslui', 'Sužinoti', '🎯', 85, true),
('AI nuo 500€/mėn', 'Prieinamos kainos, didelis poveikis', 'Kainos', '💰', 80, true),
('Konkurentai jau naudoja', 'Nelikite nuošalyje - pradėkite dabar', 'Pradėti', '🔥', 75, true),
('Nemokamas prototipas', 'Išbandykite prieš priimdami sprendimą', 'Demo', '✨', 70, true),
('AI mokymai komandai', 'Jūsų darbuotojai mokės naudoti AI', 'Mokymai', '🎓', 65, true),
('ROI per 3 mėnesius', 'Investicija, kuri atsipirks greitai', 'Skaičiuoti', '📊', 60, true),
('Lietuvių kalba', 'AI, kuris supranta lietuviškai', 'Išbandyti', '🇱🇹', 55, true),
('Jūsų duomenys saugūs', 'Jūsų patalpose arba privati debesija', 'Saugumas', '🔒', 50, true),
('Mobilios aplikacijos', 'AI įrankiai iOS ir Android', 'Pamatyti', '📱', 45, true),
('Balso valdymas', 'Kalbėkite su AI lietuviškai', 'Išbandyti', '🎤', 40, true),
('30+ projektų', 'Patirtis su įvairiausiais verslais', 'Atvejai', '📈', 35, true),
('24/7 palaikymas', 'Lietuvių kalba, greitas atsakymas', 'Susisiekti', '⏱️', 30, true);

-- ============================================
-- 7. PRADINIAI DUOMENYS - HERO SECTIONS
-- ============================================

-- Išvalome senas hero sekcijas
TRUNCATE TABLE public.hero_sections;

-- Įdedame naują hero sekciją
INSERT INTO public.hero_sections (
    title, 
    subtitle, 
    button_text, 
    button_url, 
    secondary_button_text,
    secondary_button_url,
    badge_text,
    image_url, 
    priority,
    show_stats,
    active
) VALUES (
    'AI naujienos, įrankiai ir sprendimai Lietuvoje',
    'Atraskite naujausias dirbtinio intelekto naujienas, AI įrankius ir gaukite individualius verslo sprendimus. Viskas lietuvių kalba - ponas Obuolys',
    'Naršyti naujienas',
    '/publikacijos',
    'Verslo sprendimai',
    '/verslo-sprendimai',
    '🚀 Naujausia AI informacija',
    NULL,
    100,
    true,
    true
);

-- ============================================
-- 8. MIGRACIJŲ DOKUMENTACIJA
-- ============================================

INSERT INTO public.migration_documentation (
    migration_version,
    migration_name,
    description,
    sql_changes,
    breaking_changes,
    rollback_instructions,
    author
) VALUES (
    '20251015_expand_cta_hero_sections',
    'Expand CTA and Hero sections',
    'Išplėčia cta_sections ir hero_sections lenteles dinaminio turinio valdymui. Prideda sticky_cta_messages lentelę.',
    '1. Pridėti stulpeliai: context, variant, icon, priority, is_sticky į cta_sections
2. Pridėti stulpeliai: secondary_button_text, secondary_button_url, badge_text, priority, show_stats į hero_sections
3. Sukurta nauja lentelė: sticky_cta_messages
4. Pridėti indeksai ir RLS politikos
5. Įdėti pradiniai duomenys',
    false,
    'DROP TABLE IF EXISTS public.sticky_cta_messages;
ALTER TABLE public.cta_sections DROP COLUMN IF EXISTS context, DROP COLUMN IF EXISTS variant, DROP COLUMN IF EXISTS icon, DROP COLUMN IF EXISTS priority, DROP COLUMN IF EXISTS is_sticky;
ALTER TABLE public.hero_sections DROP COLUMN IF EXISTS secondary_button_text, DROP COLUMN IF EXISTS secondary_button_url, DROP COLUMN IF EXISTS badge_text, DROP COLUMN IF EXISTS priority, DROP COLUMN IF EXISTS show_stats;',
    'ponas Obuolys'
);
