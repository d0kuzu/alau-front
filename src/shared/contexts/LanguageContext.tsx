import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { translations, type Language, type Translation } from "@/shared/lib/translations";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Translation;
  dateLocale: string;
};

const LANGUAGE_STORAGE_KEY = "alau_language";
const fallbackLanguage: Language = "ru";

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const isLanguage = (value: string | null): value is Language => value === "ru" || value === "en";

const getInitialLanguage = (): Language => {
  if (typeof window === "undefined") {
    return fallbackLanguage;
  }

  const savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);

  return isLanguage(savedLanguage) ? savedLanguage : fallbackLanguage;
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
  };

  useEffect(() => {
    document.documentElement.lang = language === "en" ? "en" : "ru";
    document.title = translations[language].seo.title;

    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
    const ogDescription = document.querySelector<HTMLMetaElement>('meta[property="og:description"]');
    const twitterTitle = document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]');
    const twitterDescription = document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]');

    description?.setAttribute("content", translations[language].seo.description);
    ogTitle?.setAttribute("content", translations[language].seo.title);
    ogDescription?.setAttribute("content", translations[language].seo.description);
    twitterTitle?.setAttribute("content", translations[language].seo.title);
    twitterDescription?.setAttribute("content", translations[language].seo.description);
  }, [language]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      t: translations[language],
      dateLocale: language === "en" ? "en-US" : "ru-RU",
    }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }

  return context;
};
