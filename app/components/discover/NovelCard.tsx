import { NovelMeta } from '../../types/repo';
import { NovelStorage } from '../../lib/storage';
import Image from 'next/image';
import { useState } from 'react';

interface NovelCardProps {
  novel: NovelMeta;
}

export function NovelCard({ novel }: NovelCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatSize = (size?: number) => {
    if (!size) return '';
    if (size < 1024) return `${size}B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)}KB`;
    return `${(size / (1024 * 1024)).toFixed(1)}MB`;
  };

  return (
    <div className="flex flex-col p-3 rounded-lg
      bg-white dark:bg-gray-800
      shadow-sm border border-gray-200 dark:border-gray-700">
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
          <h3 className="font-medium text-gray-900 dark:text-gray-100 break-words">
            {novel.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {novel.author}
          </p>
          <div className="flex flex-wrap gap-1 mt-1">
            {novel.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
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
                  className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 
                    text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200
                    cursor-pointer"
                  title="Add to Library"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          {novel.description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              {novel.description}
            </p>
          )}
          <div className="flex flex-wrap gap-1 mb-2">
            {novel.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
                {tag}
              </span>
            ))}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>Categories: {novel.categories.join(', ')}</p>
            <p>Last Updated: {novel.lastUpdated}</p>
            {novel.region && <p>Region: {novel.region}</p>}
          </div>
          {novel.pageUrl && (
            <a href={novel.pageUrl} className="text-blue-500 hover:text-blue-600">
              Visit
            </a>
          )}
        </div>
      )}
      
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-2 text-sm text-gray-500 hover:text-gray-700 
          dark:text-gray-400 dark:hover:text-gray-200 underline"
      >
        {isExpanded ? 'Show less' : 'Show more'}
      </button>
    </div>
  );
} 