export const getServiceContent = (service: "individual" | "group" | "workshop" | null) => {
  switch (service) {
    case "individual":
      return {
        title: "1-1 AI konsultacija su praktiniais sprendimais",
        subtitle: "Asmeninė konsultacija su AI specialistu",
        description:
          "Asmeninė konsultacija su AI specialistu – tai 60 minučių intensyvus pokalbis, kurio metu gaunate praktines rekomendacijas ir konkrečius AI sprendimus būtent jūsų situacijai. Ne teorija, o realūs įrankiai ir metodai.",
        sections: [
          {
            title: "Konsultacijos turinys:",
            items: [
              "Praktinis ChatGPT, Claude, Gemini panaudojimas kasdieniam darbui",
              "AI įrankių įdiegimas jūsų darbo procese per 24 val",
              "Efektyvaus prompt kūrimo technikos (prompt engineering)",
              "Verslo procesų automatizavimas su AI asistentais",
              "Turinio kūrimas su dirbtinio intelekto pagalba (tekstai, vaizdai, video)",
              "AI sprendimų sąnaudų optimizavimas",
              "Konkretūs pavyzdžiai ir šablonai jūsų sričiai",
            ],
          },
          {
            title: "Idealu:",
            items: [
              "Savarankiškai dirbantiems ir freelanceriams",
              "Įmonių darbuotojams, siekiantiems produktyvumo",
              "Rinkodarininkams ir turinio kūrėjams",
              "Klientų aptarnavimo specialistams",
            ],
          },
        ],
        footer: "Garantija: Gaunate darbo šablonus, prompt bibliotekų ir AI įrankių sąrašą",
        keywords:
          "AI konsultacija online, ChatGPT mokymai lietuviškai, praktiniai AI sprendimai, AI įrankiai verslui, dirbtinio intelekto mokymai, generatyvioji AI, turinio kūrimas su AI, automatizavimas",
      };
    case "group":
      return {
        title: "Korporatyviniai AI mokymai jūsų komandai",
        subtitle: "Specializuoti dirbtinio intelekto mokymai",
        description:
          "Specializuoti dirbtinio intelekto mokymai, pritaikyti jūsų organizacijos poreikiams. Mokome 5-20 darbuotojų, kaip efektyviai naudoti AI įrankius kasdienėje veikloje ir padidinti komandos produktyvumą iki 40%.",
        sections: [
          {
            title: "Mokymo programa:",
            items: [
              "ChatGPT, Claude, Gemini ir kitos AI platformos",
              "Praktiniai AI panaudojimo scenarijai pagal jūsų veiklos sritį",
              "Verslo procesų automatizavimas su AI",
              "Prompt engineering mokymų sesijos",
              "Turinio generavimas su dirbtinio intelekto pagalba",
              "AI integracijos strategija organizacijoje",
              "Duomenų saugumas ir etika naudojant AI",
              "Komandos produktyvumo optimizavimas",
            ],
          },
          {
            title: "Mokymo eiga:",
            items: [
              "Pirminis poreikių tyrimas",
              "Pritaikyta programa jūsų sričiai (IT, rinkodara, pardavimai, klientų aptarnavimas)",
              "Praktiniai užsiėmimai su realiais jūsų projektų pavyzdžiais",
              "Darbo šablonų ir prompt bibliotekų sukūrimas",
              "Po-mokymo palaikymas 30 dienų",
            ],
          },
          {
            title: "Kam skirta:",
            items: [
              "Vidutinėms ir didelėms įmonėms",
              "IT komandom",
              "Rinkodaros ir komunikacijos skyriams",
              "Klientų aptarnavimo komandom",
              "Valdymo komandom",
            ],
          },
        ],
        footer:
          "Trukmė: 2-4 valandos (pritaikoma) | Dalyviai: 5-20 žmonių | Formatas: Online arba On-site",
        keywords:
          "AI mokymai įmonėms, ChatGPT mokymai komandai, dirbtinio intelekto mokymai verslui, korporatyviniai AI mokymai, AI produktyvumas, komandos mokymas, generatyvioji AI verslui",
      };
    case "workshop":
      return {
        title: "AI dirbtuvės: nuo idėjos iki veikiančio produkto",
        subtitle: "Du dienų AI workshop'as su VIBE CODING",
        description:
          "Du dienų AI workshop'as, kurio metu sukuriate realų AI sprendimą savo verslui ar projektui. Dirbtuvių pabaigoje turite veikiantį prototipą ir planą tolimesnei plėtrai. Įskaitant VIBE CODING su Claude Code, Cursor, Windsurf - moderniausiomis AI programavimo priemonėmis.",
        sections: [
          {
            title: "Šeštadienis – Projektavimas ir prototipavimas:",
            items: [
              "09:00-10:30 - AI galimybių ir įrankių apžvalga",
              "10:45-12:30 - Jūsų projekto idėjos analizė ir AI architektūros projektavimas",
              "13:30-15:30 - Prompt engineering ir AI workflow kūrimas + VIBE CODING įvadas",
              "15:45-18:00 - Prototipo kūrimas su Claude Code/Cursor/Windsurf mentoriaus pagalba",
            ],
          },
          {
            title: "Sekmadienis – Integracijos ir automatizavimas:",
            items: [
              "09:00-11:00 - AI API integracijos ir automatizavimas su VIBE CODING",
              "11:15-13:00 - Testavimas ir optimizavimas",
              "14:00-16:00 - Deployment ir produkcijos paruošimas",
              "16:15-17:30 - Projektų pristatymai ir feedback",
              "17:30-18:00 - Plėtros planas ir gairės",
            ],
          },
          {
            title: "VIBE CODING sesijos:",
            items: [
              "Claude Code (Anthropic) - AI asistuotas kodo rašymas",
              "Cursor - kodo užbaigimas ir refaktoringas su AI",
              "Windsurf - modernios AI development aplinkos",
              "OpenAI Codex integracijos",
              "Realaus kodo generavimas ir optimizavimas",
              "Best practices dirbtiniam intelektui koduoti",
            ],
          },
          {
            title: "Ką išsinešite:",
            items: [
              "Veikiantį AI prototipą / MVP",
              "Pilną kodą su dokumentacija",
              "AI architektūros diagramas",
              "Deployment instrukcijas",
              "VIBE CODING šablonus ir workflow'us",
              "Prieigų prie AI įrankių (14-30 dienų trial)",
              "Bendruomenės prieigą ir palaikymą",
            ],
          },
          {
            title: "Projektų pavyzdžiai:",
            items: [
              "AI chatbotai klientų aptarnavimui",
              "Automatinė turinio generavimo sistema",
              "Duomenų analizės ir insights platformos",
              "Asmeniniai AI asistentai specifinėms užduotims",
              "AI įrankiai produktyvumui didinti",
              "Custom GPT su jūsų duomenų baze",
            ],
          },
        ],
        footer:
          "Reikalavimai: Bazinės programavimo žinios (Python arba JavaScript) | Nešiojamas kompiuteris | Idėja arba problema",
        keywords:
          "AI workshop Lietuvoje, VIBE CODING, Claude Code, Cursor, Windsurf, dirbtinio intelekto kursai, AI projektų kūrimas, praktiniai AI mokymai, ChatGPT API, AI prototipas, custom GPT, AI chatbot kūrimas",
      };
    default:
      return null;
  }
};
