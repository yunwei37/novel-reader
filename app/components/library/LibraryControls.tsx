import React from 'react';

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
    return (
        <div className="mb-6 flex items-center justify-between gap-4">
            <div className="flex-1">
                <input
                    type="text"
                    placeholder="Search novels..."
                    value={filterQuery}
                    onChange={(e) => onFilterChange(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                />
            </div>
            <div className="flex items-center gap-2">
                <select
                    value={sortBy}
                    onChange={(e) => onSortChange(e.target.value as 'title' | 'lastRead')}
                    className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                >
                    <option value="lastRead">Recently Read</option>
                    <option value="title">Title</option>
                </select>
                <button
                    onClick={onSelectionModeToggle}
                    className={`px-4 py-2 rounded-lg ${isSelectionMode
                        ? 'bg-blue-500 text-white'
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                        }`}
                >
                    {isSelectionMode ? 'Cancel' : 'Select'}
                </button>
                {isSelectionMode && selectedCount > 0 && (
                    <button
                        onClick={onDeleteSelected}
                        className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
                    >
                        Delete ({selectedCount})
                    </button>
                )}
                <button
                    onClick={onImportClick}
                    className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
                >
                    Add
                </button>
            </div>
        </div>
    );
}; 