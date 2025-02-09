'use client';

import { useTranslation } from '../contexts/LanguageContext';

export const LanguageSelector = () => {
  const { language, setLanguage } = useTranslation();

  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2"
    >
      <option value="en">English</option>
      <option value="zh">中文</option>
    </select>
  );
}; 