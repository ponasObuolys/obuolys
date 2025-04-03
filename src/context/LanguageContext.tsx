import React, { createContext, useContext, useState, ReactNode } from 'react';

// Tipai vertimams
type Translations = {
  common: {
    readMore: string;
    backToHome: string;
    loading: string;
    error: string;
    notFound: string;
    submit: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    search: string;
  };
  navigation: {
    home: string;
    articles: string;
    tools: string;
    courses: string;
    about: string;
    contact: string;
    login: string;
    logout: string;
    admin: string;
  };
  home: {
    hero: {
      title: string;
      subtitle: string;
      cta: string;
    };
    featuredArticles: string;
    featuredTools: string;
    featuredCourses: string;
  };
  articles: {
    title: string;
    readTime: string;
    publishedOn: string;
    updatedOn: string;
    share: string;
    relatedArticles: string;
  };
  contact: {
    title: string;
    subtitle: string;
    name: string;
    email: string;
    message: string;
    send: string;
    success: string;
    error: string;
  };
  auth: {
    login: string;
    register: string;
    email: string;
    password: string;
    forgotPassword: string;
    resetPassword: string;
    loginSuccess: string;
    loginError: string;
    logoutSuccess: string;
  };
};

// Lietuvių kalbos vertimai
const lithuanianTranslations: Translations = {
  common: {
    readMore: 'Skaityti daugiau',
    backToHome: 'Grįžti į pradžią',
    loading: 'Kraunama...',
    error: 'Įvyko klaida',
    notFound: 'Puslapis nerastas',
    submit: 'Pateikti',
    cancel: 'Atšaukti',
    save: 'Išsaugoti',
    delete: 'Ištrinti',
    edit: 'Redaguoti',
    search: 'Ieškoti',
  },
  navigation: {
    home: 'Pradžia',
    articles: 'Straipsniai',
    tools: 'Įrankiai',
    courses: 'Kursai',
    about: 'Apie',
    contact: 'Kontaktai',
    login: 'Prisijungti',
    logout: 'Atsijungti',
    admin: 'Administravimas',
  },
  home: {
    hero: {
      title: 'Dirbtinio intelekto žinios visiems',
      subtitle: 'Atraskite AI galimybes su Ponu Obuoliu',
      cta: 'Pradėkite kelionę',
    },
    featuredArticles: 'Naujausi straipsniai',
    featuredTools: 'Populiariausi įrankiai',
    featuredCourses: 'Rekomenduojami kursai',
  },
  articles: {
    title: 'Straipsniai',
    readTime: 'min. skaitymo',
    publishedOn: 'Publikuota',
    updatedOn: 'Atnaujinta',
    share: 'Dalintis',
    relatedArticles: 'Susiję straipsniai',
  },
  contact: {
    title: 'Susisiekite su mumis',
    subtitle: 'Turite klausimų? Parašykite mums!',
    name: 'Vardas',
    email: 'El. paštas',
    message: 'Žinutė',
    send: 'Siųsti',
    success: 'Jūsų žinutė išsiųsta sėkmingai!',
    error: 'Nepavyko išsiųsti žinutės. Bandykite dar kartą.',
  },
  auth: {
    login: 'Prisijungti',
    register: 'Registruotis',
    email: 'El. paštas',
    password: 'Slaptažodis',
    forgotPassword: 'Pamiršote slaptažodį?',
    resetPassword: 'Atstatyti slaptažodį',
    loginSuccess: 'Sėkmingai prisijungėte!',
    loginError: 'Nepavyko prisijungti. Patikrinkite prisijungimo duomenis.',
    logoutSuccess: 'Sėkmingai atsijungėte!',
  },
};

// Konteksto tipas
type LanguageContextType = {
  translations: Translations;
  language: string;
  setLanguage: (language: string) => void;
};

// Sukuriame kontekstą
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Konteksto tiekėjas (provider)
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<string>('lt'); // Numatytoji kalba - lietuvių
  const [translations, setTranslations] = useState<Translations>(lithuanianTranslations);

  // Ateityje galima pridėti daugiau kalbų ir keisti vertimus pagal pasirinktą kalbą
  // Šiuo metu palaikoma tik lietuvių kalba pagal projekto reikalavimus

  return (
    <LanguageContext.Provider value={{ translations, language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Kablys (hook) naudojimui komponentuose
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage turi būti naudojamas LanguageProvider viduje');
  }
  return context;
};

export default LanguageContext;
