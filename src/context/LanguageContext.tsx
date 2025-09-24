import type { ReactNode } from "react";
import React, { useState } from "react";
import { LanguageContext, type Translations } from "./language-context";

// Tipai perkelti į `language-context.ts` siekiant laikytis react-refresh taisyklės

// Lietuvių kalbos vertimai
const lithuanianTranslations: Translations = {
  common: {
    readMore: "Skaityti daugiau",
    backToHome: "Grįžti į pradžią",
    loading: "Kraunama...",
    error: "Įvyko klaida",
    notFound: "Puslapis nerastas",
    submit: "Pateikti",
    cancel: "Atšaukti",
    save: "Išsaugoti",
    delete: "Ištrinti",
    edit: "Redaguoti",
    search: "Ieškoti",
  },
  navigation: {
    home: "Pradžia",
    articles: "Straipsniai",
    tools: "Įrankiai",
    courses: "Kursai",
    about: "Apie",
    contact: "Kontaktai",
    login: "Prisijungti",
    logout: "Atsijungti",
    admin: "Administravimas",
  },
  home: {
    hero: {
      title: "Dirbtinio intelekto žinios visiems",
      subtitle: "Atraskite AI galimybes su Ponu Obuoliu",
      cta: "Pradėkite kelionę",
    },
    featuredArticles: "Naujausi straipsniai",
    featuredTools: "Populiariausi įrankiai",
    featuredCourses: "Rekomenduojami kursai",
  },
  articles: {
    title: "Straipsniai",
    readTime: "min. skaitymo",
    publishedOn: "Publikuota",
    updatedOn: "Atnaujinta",
    share: "Dalintis",
    relatedArticles: "Susiję straipsniai",
  },
  contact: {
    title: "Susisiekite su mumis",
    subtitle: "Turite klausimų? Parašykite mums!",
    name: "Vardas",
    email: "El. paštas",
    message: "Žinutė",
    send: "Siųsti",
    success: "Jūsų žinutė išsiųsta sėkmingai!",
    error: "Nepavyko išsiųsti žinutės. Bandykite dar kartą.",
  },
  auth: {
    login: "Prisijungti",
    register: "Registruotis",
    email: "El. paštas",
    password: "Slaptažodis",
    forgotPassword: "Pamiršote slaptažodį?",
    resetPassword: "Atstatyti slaptažodį",
    loginSuccess: "Sėkmingai prisijungėte!",
    loginError: "Nepavyko prisijungti. Patikrinkite prisijungimo duomenis.",
    logoutSuccess: "Sėkmingai atsijungėte!",
  },
};

// Kontekstas importuotas iš `language-context.ts`

// Konteksto tiekėjas (provider)
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<string>("lt"); // Numatytoji kalba - lietuvių
  const [translations, _setTranslations] = useState<Translations>(lithuanianTranslations);

  // Ateityje galima pridėti daugiau kalbų ir keisti vertimus pagal pasirinktą kalbą
  // Šiuo metu palaikoma tik lietuvių kalba pagal projekto reikalavimus

  return (
    <LanguageContext.Provider value={{ translations, language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Failas eksportuoja tik komponentą, kad veiktų Fast Refresh
