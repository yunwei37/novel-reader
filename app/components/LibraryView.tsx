import React, { useEffect, useState } from 'react';
import { NovelStorage } from '../lib/storage';
import { Novel } from '../types';

interface LibraryViewProps {
    onNovelSelect: (novel: Novel) => void;
    onImportClick: () => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({ onNovelSelect, onImportClick }) => {
    const [novels, setNovels] = useState<Novel[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState<'title' | 'lastRead'>('lastRead');
    const [filterQuery, setFilterQuery] = useState('');

    useEffect(() => {
        const loadedNovels = NovelStorage.getAllNovels();
        setNovels(loadedNovels);
    }, []);

    const sortedNovels = novels
        .filter(novel =>
            novel.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
            novel.author?.toLowerCase().includes(filterQuery.toLowerCase())
        )
        .sort((a, b) => {
            switch (sortBy) {
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'lastRead':
                    return b.lastRead - a.lastRead;
                default:
                    return 0;
            }
        });

    return (
        <div className="p-4 h-full overflow-auto">
            {/* Controls */}
            <div className="mb-6 flex items-center justify-between gap-4">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search novels..."
                        value={filterQuery}
                        onChange={(e) => setFilterQuery(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'title' | 'lastRead')}
                        className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                    >
                        <option value="lastRead">Recently Read</option>
                        <option value="title">Title</option>
                    </select>
                    <button
                        onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                        className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                    >
                        {viewMode === 'grid' ? '📝' : '📚'}
                    </button>
                    <button
                        onClick={onImportClick}
                        className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
                    >
                        Import
                    </button>
                </div>
            </div>

            {/* Novel Grid/List */}
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-2'}>
                {sortedNovels.map((novel) => (
                    <div
                        key={novel.id}
                        onClick={() => onNovelSelect(novel)}
                        className={`
              cursor-pointer rounded-lg overflow-hidden transition-transform hover:scale-[1.02]
              ${viewMode === 'grid' ? 'bg-white dark:bg-gray-800 shadow-sm' : 'bg-white dark:bg-gray-800 shadow-sm flex items-center'}
            `}
                    >
                        {viewMode === 'grid' ? (
                            <div>
                                <div className="aspect-[2/3] bg-gray-100 dark:bg-gray-700 relative">
                                    {novel.coverUrl ? (
                                        <img src={novel.coverUrl} alt={novel.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-4xl">
                                            📖
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-gray-900 dark:text-gray-100 truncate">{novel.title}</h3>
                                    {novel.author && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{novel.author}</p>
                                    )}
                                    <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                                        Last read {new Date(novel.lastRead).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4 p-4 w-full">
                                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center text-2xl">
                                    📖
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-gray-900 dark:text-gray-100 truncate">{novel.title}</h3>
                                    {novel.author && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{novel.author}</p>
                                    )}
                                </div>
                                <div className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                                    {new Date(novel.lastRead).toLocaleDateString()}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {novels.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    No novels in your library yet. Import one to get started!
                </div>
            )}
        </div>
    );
}; 