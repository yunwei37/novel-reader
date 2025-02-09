'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSystemLanguage } from '../lib/language';
import { translations } from './translations';

export type Translations = {
  [key: string]: {
    [key: string]: string;
  };
};

export const SUPPORTED_LANGUAGES = ['en', 'zh'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

const getStoredLanguage = (): SupportedLanguage | null => {
  if (typeof window === 'undefined') return null;
  const savedLang = localStorage.getItem('preferred-language');
  return (savedLang && SUPPORTED_LANGUAGES.includes(savedLang as SupportedLanguage)) 
    ? savedLang as SupportedLanguage 
    : null;
};

const storeLanguage = (lang: SupportedLanguage): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('preferred-language', lang);
};

const createTranslator = (translations: Translations, language: string) => {
  return (key: string): string => {
    return translations[language]?.[key] || key;
  };
};

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider = ({ 
  children,
  initialLang
}: { 
  children: React.ReactNode;
  initialLang: string;
}) => {
  const [language, setLanguage] = useState(initialLang);

  useEffect(() => {
    const savedLang = getStoredLanguage();
    if (savedLang) {
      setLanguage(savedLang);
      return;
    }

    const systemLang = getSystemLanguage();
    if (systemLang !== language) {
      setLanguage(systemLang);
      storeLanguage(systemLang as SupportedLanguage);
    }
  }, [language]);

  const handleSetLanguage = (newLang: string) => {
    setLanguage(newLang);
    storeLanguage(newLang as SupportedLanguage);
  };

  const t = createTranslator(translations, language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}; 