import { useState } from 'react';
import { useTranslation } from '../../contexts/LanguageContext';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
}

export function SearchBar({ onSearch, isSearching }: SearchBarProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('discover.searchPlaceholder')}
        className="flex-1 px-4 py-2 rounded-lg
          bg-gray-100 dark:bg-gray-800
          text-gray-900 dark:text-gray-100
          border border-gray-200 dark:border-gray-700
          focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        disabled={isSearching || !query.trim()}
        className="px-4 py-2 rounded-lg bg-blue-500 text-white
          disabled:bg-gray-300 dark:disabled:bg-gray-700
          hover:bg-blue-600 transition-colors"
      >
        {isSearching ? t('dialog.loading') : t('reader.menu.search')}
      </button>
    </form>
  );
} 