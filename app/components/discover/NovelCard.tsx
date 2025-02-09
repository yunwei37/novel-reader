import { NovelMeta } from '../../types/repo';
import Image from 'next/image';
import { useState } from 'react';
import { useTranslation } from '../../contexts/LanguageContext';
import { DownloadIcon } from '../icons';

interface NovelCardProps {
  novel: NovelMeta;
}

export function NovelCard({ novel }: NovelCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useTranslation();

  const formatSize = (size?: number) => {
    if (!size) return '';
    if (size < 1024) return `${size}B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)}KB`;
    return `${(size / (1024 * 1024)).toFixed(1)}MB`;
  };

  return (
    <div className="flex flex-col p-3 rounded-lg
      bg-white dark:bg-gray-800
      shadow-sm border border-gray-200 dark:border-gray-700
      text-gray-900 dark:text-gray-100">
      <div className="flex space-x-3">
        {novel.cover && (
          <div className="relative w-20 h-28 flex-shrink-0">
            <Image
              src={novel.cover}
              alt={novel.title}
              fill
              className="object-cover rounded"
            />
          </div>
        )}
        <div className="flex flex-col flex-1 min-w-0">
          <h3 className="font-medium break-words">
            {novel.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {t('discover.novel.author')}: {novel.author}
          </p>
          <div className="flex flex-wrap gap-1 mt-1">
            {novel.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 
                bg-gray-100 dark:bg-gray-700 
                text-gray-700 dark:text-gray-300 rounded">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
              {novel.size && <span>{formatSize(novel.size)}</span>}
            </div>
            <div className="flex items-center space-x-2">
              {novel.downloadUrl && (
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = `/?add=${encodeURIComponent(novel.downloadUrl!)}`;
                  }}
                  href={novel.downloadUrl}
                  className="p-1.5 rounded-full 
                    hover:bg-gray-100 dark:hover:bg-gray-700 
                    text-gray-600 dark:text-gray-300
                    hover:text-gray-900 dark:hover:text-gray-100
                    cursor-pointer"
                  title={t('discover.novel.addToLibrary')}
                >
                  <DownloadIcon />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          {novel.description && (
            <p className="text-sm text-gray-700 dark:text-gray-200 mb-2">
              {novel.description}
            </p>
          )}
          <div className="flex flex-wrap gap-1 mb-2">
            {novel.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 
                bg-gray-100 dark:bg-gray-700 
                text-gray-700 dark:text-gray-300 rounded">
                {tag}
              </span>
            ))}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            <p>{t('discover.novel.categories')}: {novel.categories.join(', ')}</p>
            <p>{t('discover.novel.lastUpdated')}: {novel.lastUpdated}</p>
            {novel.region && <p>{t('discover.novel.region')}: {novel.region}</p>}
          </div>
          {novel.pageUrl && (
            <a 
              href={novel.pageUrl} 
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              {t('discover.novel.visit')}
            </a>
          )}
          <a 
            href={`/?add=${encodeURIComponent(novel.downloadUrl!)}`} 
            aria-label={t('discover.novel.addToLibrary')}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 block mt-2"
          >
            {t('discover.novel.addToLibrary')}
          </a>
        </div>
      )}
      
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-2 text-sm text-gray-600 hover:text-gray-900
          dark:text-gray-300 dark:hover:text-gray-100 underline"
      >
        {isExpanded ? t('discover.novel.showLess') : t('discover.novel.showMore')}
      </button>
    </div>
  );
} 