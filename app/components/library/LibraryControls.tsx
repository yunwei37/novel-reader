'use client';

import React from 'react';
import { useTranslation } from '../../contexts/LanguageContext';

interface LibraryControlsProps {
    filterQuery: string;
    onFilterChange: (query: string) => void;
    sortBy: 'title' | 'lastRead';
    onSortChange: (sort: 'title' | 'lastRead') => void;
    isSelectionMode: boolean;
    selectedCount: number;
    onSelectionModeToggle: () => void;
    onDeleteSelected: () => void;
    onImportClick: () => void;
}

export const LibraryControls: React.FC<LibraryControlsProps> = ({
    filterQuery,
    onFilterChange,
    sortBy,
    onSortChange,
    isSelectionMode,
    selectedCount,
    onSelectionModeToggle,
    onDeleteSelected,
    onImportClick,
}) => {
    const { t } = useTranslation();

    return (
        <div className="mb-6 flex items-center justify-between gap-4">
            <div className="flex-1">
                <input
                    type="text"
                    placeholder={t('library.search')}
                    value={filterQuery}
                    onChange={(e) => onFilterChange(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                />
            </div>
            <div className="flex items-center gap-2">
                <select
                    value={sortBy}
                    onChange={(e) => onSortChange(e.target.value as 'title' | 'lastRead')}
                    className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                >
                    <option value="lastRead">{t('library.sort.recentlyRead')}</option>
                    <option value="title">{t('library.sort.title')}</option>
                </select>
                <button
                    onClick={onSelectionModeToggle}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                        isSelectionMode
                            ? 'bg-blue-500 hover:bg-blue-600 text-white'
                            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                >
                    {isSelectionMode ? t('library.cancel') : t('library.select')}
                </button>
                {isSelectionMode && selectedCount > 0 && (
                    <button
                        onClick={onDeleteSelected}
                        className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
                    >
                        {t('library.delete')} ({selectedCount})
                    </button>
                )}
                <button
                    onClick={onImportClick}
                    className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                >
                    {t('library.import')}
                </button>
            </div>
        </div>
    );
}; 