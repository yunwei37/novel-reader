export const getSystemLanguage = (): string => {
  if (typeof window === 'undefined') return 'en';
  
  const browserLang = navigator.language.toLowerCase();
  const supportedLanguages = ['en', 'zh'];
  
  // Check if the browser language starts with any of our supported languages
  const matchedLang = supportedLanguages.find(lang => 
    browserLang.startsWith(lang)
  );
  
  return matchedLang || 'en';
}; 