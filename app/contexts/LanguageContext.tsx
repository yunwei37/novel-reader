'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Translations = {
  [key: string]: {
    [key: string]: string;
  };
};

const translations: Translations = {
  en: {
    'common.back': 'Back',
    'common.settings': 'Settings',
    'common.close': 'Close',
    'navigation.library': 'Library',
    'navigation.reader': 'Reader',
    'navigation.settings': 'Settings',
    'navigation.add': 'Add',
    'reader.title': 'Reading',
    'library.title': 'Novel Reader',
    'library.import': 'Import Novel',
    'library.noNovels': 'No novels yet',
    'settings.darkMode': 'Dark Mode',
    'settings.language': 'Language',
    'reader.menu.settings': 'Settings',
    'reader.menu.bookmarks': 'Bookmarks',
    'reader.menu.chapters': 'Chapters',
    'reader.menu.search': 'Search',
    'reader.menu.fontSize': 'Font Size',
    'reader.menu.pageMode': 'Page Mode',
    'reader.menu.scrollMode': 'Scroll Mode',
    'reader.menu.title': 'Reader Menu',
  },
  zh: {
    'common.back': '返回',
    'common.settings': '设置',
    'common.close': '关闭',
    'navigation.library': '书库',
    'navigation.reader': '阅读器',
    'navigation.settings': '设置',
    'navigation.add': '添加',
    'reader.title': '阅读中',
    'library.title': '小说阅读器',
    'library.import': '导入小说',
    'library.noNovels': '暂无小说',
    'settings.darkMode': '深色模式',
    'settings.language': '语言',
    'reader.menu.settings': '设置',
    'reader.menu.bookmarks': '书签',
    'reader.menu.chapters': '章节',
    'reader.menu.search': '搜索',
    'reader.menu.fontSize': '字体大小',
    'reader.menu.pageMode': '分页模式',
    'reader.menu.scrollMode': '滚动模式',
    'reader.menu.title': '阅读菜单',
  },
};

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      setLanguage(savedLang);
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split('-')[0];
      setLanguage(translations[browserLang] ? browserLang : 'en');
    }
  }, []);

  const handleSetLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
} 