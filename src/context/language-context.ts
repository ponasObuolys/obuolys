import { createContext, useContext } from "react";

// Tipai vertimams
export type Translations = {
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

// Konteksto tipas
export type LanguageContextType = {
  translations: Translations;
  language: string;
  setLanguage: (language: string) => void;
};

// Sukuriame kontekstą
export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Kablys (hook) naudojimui komponentuose
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage turi būti naudojamas LanguageProvider viduje");
  }
  return context;
};
