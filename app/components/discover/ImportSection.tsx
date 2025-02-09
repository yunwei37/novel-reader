import { useTranslation } from '../../contexts/LanguageContext';
import { useRef } from 'react';
import { NovelStorage } from '../../lib/storage';
import { Novel } from '../../types';

interface ImportSectionProps {
  onImportComplete: (novel: Novel) => void;
}

export function ImportSection({ onImportComplete }: ImportSectionProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const novel = await NovelStorage.importFromFile(file);
      onImportComplete(novel);
    } catch (err) {
      console.error('Import error:', err);
    }
  };

  const handleUrlImport = async () => {
    const url = urlInputRef.current?.value;
    if (!url) return;
    window.location.href = `/?add=${encodeURIComponent(url)}`;
  };

  return (
    <section className="grid grid-cols-2 gap-4">
      <div className="relative">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full p-4 text-center rounded-lg
            bg-white dark:bg-gray-800
            border border-gray-200 dark:border-gray-700
            text-gray-900 dark:text-gray-100"
        >
          {t('discover.localImport')}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
      <div className="relative">
        <input
          ref={urlInputRef}
          type="url"
          placeholder={t('add.urlPlaceholder')}
          className="w-full p-4 rounded-lg
            bg-white dark:bg-gray-800
            border border-gray-200 dark:border-gray-700
            text-gray-900 dark:text-gray-100
            placeholder-gray-500 dark:placeholder-gray-400"
        />
        <button
          onClick={handleUrlImport}
          className="absolute right-2 top-1/2 -translate-y-1/2
            px-4 py-2 rounded-lg
            bg-blue-500 hover:bg-blue-600
            text-white text-sm"
        >
          {t('discover.urlImport')}
        </button>
      </div>
    </section>
  );
} 