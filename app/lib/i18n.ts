export type Translations = {
  [key: string]: {
    [key: string]: string;
  };
};

export interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

export const SUPPORTED_LANGUAGES = ['en', 'zh'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

export const getStoredLanguage = (): SupportedLanguage | null => {
  if (typeof window === 'undefined') return null;
  const savedLang = localStorage.getItem('preferred-language');
  return (savedLang && SUPPORTED_LANGUAGES.includes(savedLang as SupportedLanguage)) 
    ? savedLang as SupportedLanguage 
    : null;
};

export const storeLanguage = (lang: SupportedLanguage): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('preferred-language', lang);
};

export const createTranslator = (translations: Translations, language: string) => {
  return (key: string): string => {
    return translations[language]?.[key] || key;
  };
}; 