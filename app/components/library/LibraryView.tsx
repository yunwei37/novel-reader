'use client';

import React, { useEffect, useState } from 'react';
import { NovelStorage } from '../../lib/storage';
import { Novel } from '../../types';
import { LibraryControls } from './LibraryControls';
import { NovelListItem } from './NovelListItem';
import { useTranslation } from '../../contexts/LanguageContext';

interface LibraryViewProps {
    onNovelSelect: (novel: Novel) => void;
    onImportClick: () => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({ onNovelSelect, onImportClick }) => {
    const { t } = useTranslation();
    const [novels, setNovels] = useState<Novel[]>([]);
    const [sortBy, setSortBy] = useState<'title' | 'lastRead'>('lastRead');
    const [filterQuery, setFilterQuery] = useState('');
    const [selectedNovels, setSelectedNovels] = useState<Set<string>>(new Set());
    const [isSelectionMode, setIsSelectionMode] = useState(false);

    useEffect(() => {
        const loadNovels = async () => {
            try {
                const loadedNovels = await NovelStorage.getAllNovels();
                setNovels(loadedNovels);
            } catch (error) {
                console.error('Failed to load novels:', error);
            }
        };
        loadNovels();
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

    const handleSelectionModeToggle = () => {
        setIsSelectionMode(!isSelectionMode);
        if (!isSelectionMode) {
            setSelectedNovels(new Set());
        }
    };

    return (
        <div className="p-4 h-full overflow-auto">
            <LibraryControls
                filterQuery={filterQuery}
                onFilterChange={setFilterQuery}
                sortBy={sortBy}
                onSortChange={setSortBy}
                isSelectionMode={isSelectionMode}
                selectedCount={selectedNovels.size}
                onSelectionModeToggle={handleSelectionModeToggle}
                onDeleteSelected={handleDeleteSelected}
                onImportClick={onImportClick}
            />

            <div className="space-y-2">
                {sortedNovels.map((novel) => (
                    <NovelListItem
                        key={novel.id}
                        novel={novel}
                        isSelectionMode={isSelectionMode}
                        isSelected={selectedNovels.has(novel.id)}
                        onSelect={toggleNovelSelection}
                        onClick={handleNovelClick}
                    />
                ))}
            </div>

            {novels.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    {t('library.noNovels')}
                    </div>
            )}
        </div>
    );
}; 