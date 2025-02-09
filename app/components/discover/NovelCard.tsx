import { NovelMeta } from '../../types/repo';
import Image from 'next/image';

interface NovelCardProps {
  novel: NovelMeta;
}

export function NovelCard({ novel }: NovelCardProps) {
  return (
    <div className="flex space-x-3 p-2 rounded-lg
      bg-white dark:bg-gray-800
      shadow-sm border border-gray-200 dark:border-gray-700">
      {novel.cover ? (
        <div className="relative w-20 h-28">
          <Image
            src={novel.cover}
            alt={novel.title}
            fill
            className="object-cover rounded"
          />
        </div>
      ) : (
        <div className="w-20 h-28 bg-gray-200 dark:bg-gray-700 rounded" />
      )}
      <div className="flex flex-col flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
          {novel.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {novel.author}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-auto">
          {novel.chapters} 章
        </p>
      </div>
    </div>
  );
} 