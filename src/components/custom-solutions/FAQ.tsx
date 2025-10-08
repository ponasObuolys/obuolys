import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'Ar galite integruotis su mūsų esamomis sistemomis?',
      answer: 'Taip, galiu integruotis su bet kokiomis sistemomis, turinčiomis API arba duomenų eksporto galimybę. Populiarios integracijos: Excel/Google Sheets, buhalterinės sistemos, CRM, el. pašto sistemos, mokėjimų platformos.'
    },
    {
      question: 'Kaip ilgai užtrunka projektas?',
      answer: 'Priklauso nuo sudėtingumo: MVP 2-4 savaitės, vidutinio sudėtingumo sistema 4-8 savaitės, kompleksinis projektas 2-3+ mėnesiai. Pirmoje konsultacijoje galiu duoti tikslesnį įvertinimą.'
    },
    {
      question: 'Ar teikiate maintenance po paleidimo?',
      answer: 'Taip, siūlau skirtingus support planus nuo €200/mėn. Įskaito bug fixes, mažus patobulinimus, technikinę pagalbą. Taip pat nemokamas support pirmą(-us) mėnesį(-ius) po paleidimo priklausomai nuo pasirinkto paketo.'
    },
    {
      question: 'Kas atsitinka, jei norime papildomų funkcijų vėliau?',
      answer: 'Sistema kuriama taip, kad būtų lengvai plečiama. Naujas funkcijas galime pridėti bet kada pagal naują scope. Kainos priklauso nuo sudėtingumo.'
    },
    {
      question: 'Ar sistema pritaikyta mobiliems įrenginiams?',
      answer: 'Visada. Visos sistemos kuriamos responsive dizainų, veikiančių desktop, tablet ir mobile įrenginiuose. Jei reikia natyvios mobilios aplikacijos - galime aptarti.'
    },
    {
      question: 'Kaip užtikrinate duomenų saugumą?',
      answer: 'Visi duomenys saugomi modernioje debesų infrastruktūroje. Automatiniai backup\'ai kiekvieną dieną, SSL šifravimas, GDPR compliance, Row-level security duomenų bazėje, reguliarūs saugumo atnaujinimai.'
    },
    {
      question: 'Ar galiu matyti sistemos kodą?',
      answer: 'Taip, kodas priklauso jums. Po projekto užbaigimo perduodu visą kodą ir dokumentaciją. Galite samdyti kitus programuotojus maintain arba plėsti sistemą.'
    },
    {
      question: 'Kokia yra mokėjimo tvarka?',
      answer: 'Standartiškai: 30% avansu prieš pradedant, 40% pasiekus 50% projekto, 30% pristatant į production. Dideliems projektams galime aptarti individualų grafiką.'
    },
    {
      question: 'O jei nepatiks rezultatas?',
      answer: 'To nenutinka, nes kas 1-2 savaitės rodyti progress ir gaunami feedback. Galite sustabdyti projektą bet kuriuo metu. Pirmas prototipas per 2 savaites - matote kryptį. Tačiau, jei vis tiek nepatiktų - grąžinu avanso dalį pagal atliktą darbą.'
    },
    {
      question: 'Ar dirbate tik Lietuvoje?',
      answer: 'Pagrinde taip, bet galiu dirbti ir su užsienio klientais, kurie kalba lietuviškai arba angliškai. Komunikacija vyksta online, susitikimai per video.'
    }
  ];

  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Dažniausiai Užduodami Klausimai
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="dark-card">
                <button
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full flex justify-between items-start gap-4 text-left"
                >
                  <h3 className="text-lg font-bold text-foreground flex-1">
                    {faq.question}
                  </h3>
                  {openIndex === idx ? (
                    <ChevronUp className="w-6 h-6 text-primary flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-foreground/60 flex-shrink-0" />
                  )}
                </button>
                {openIndex === idx && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-foreground/80 leading-relaxed text-left">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
