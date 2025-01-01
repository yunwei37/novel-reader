import React, { useEffect, useState } from 'react';
import { NovelStorage } from '../lib/storage';
import { Novel } from '../types';

interface LibraryViewProps {
    onNovelSelect: (novel: Novel) => void;
    onImportClick: () => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({ onNovelSelect, onImportClick }) => {
    const [novels, setNovels] = useState<Novel[]>([]);
    const [sortBy, setSortBy] = useState<'title' | 'lastRead'>('lastRead');
    const [filterQuery, setFilterQuery] = useState('');
    const [selectedNovels, setSelectedNovels] = useState<Set<string>>(new Set());
    const [isSelectionMode, setIsSelectionMode] = useState(false);

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

    const toggleNovelSelection = (novelId: string) => {
        const newSelected = new Set(selectedNovels);
        if (newSelected.has(novelId)) {
            newSelected.delete(novelId);
        } else {
            newSelected.add(novelId);
        }
        setSelectedNovels(newSelected);
    };

    const handleNovelClick = (novel: Novel) => {
        if (isSelectionMode) {
            toggleNovelSelection(novel.id);
        } else {
            onNovelSelect(novel);
        }
    };

    const handleDeleteSelected = async () => {
        if (confirm('Are you sure you want to delete the selected novels?')) {
            for (const novelId of selectedNovels) {
                await NovelStorage.deleteNovel(novelId);
            }
            setNovels(novels.filter(novel => !selectedNovels.has(novel.id)));
            setSelectedNovels(new Set());
            setIsSelectionMode(false);
        }
    };

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
                        onClick={() => {
                            setIsSelectionMode(!isSelectionMode);
                            if (!isSelectionMode) {
                                setSelectedNovels(new Set());
                            }
                        }}
                        className={`px-4 py-2 rounded-lg ${isSelectionMode
                            ? 'bg-blue-500 text-white'
                            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                            }`}
                    >
                        {isSelectionMode ? 'Cancel' : 'Select'}
                    </button>
                    {isSelectionMode && selectedNovels.size > 0 && (
                        <button
                            onClick={handleDeleteSelected}
                            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
                        >
                            Delete ({selectedNovels.size})
                        </button>
                    )}
                    <button
                        onClick={onImportClick}
                        className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
                    >
                        Import
                    </button>
                </div>
            </div>

            {/* Novel List */}
            <div className="space-y-2">
                {sortedNovels.map((novel) => (
                    <div
                        key={novel.id}
                        onClick={() => handleNovelClick(novel)}
                        className={`
                            cursor-pointer rounded-lg overflow-hidden transition-transform hover:scale-[1.02]
                            bg-white dark:bg-gray-800 shadow-sm
                        `}
                    >
                        <div className="flex items-center gap-4 p-4 w-full">
                            {isSelectionMode && (
                                <div className="flex-shrink-0">
                                    <input
                                        type="checkbox"
                                        checked={selectedNovels.has(novel.id)}
                                        onChange={() => toggleNovelSelection(novel.id)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="w-5 h-5 rounded border-gray-300 dark:border-gray-600"
                                    />
                                </div>
                            )}
                            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center text-2xl flex-shrink-0">
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