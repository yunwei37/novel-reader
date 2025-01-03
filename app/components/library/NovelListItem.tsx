import React, { useState } from 'react';
import { Novel } from '../../types';

interface NovelListItemProps {
    novel: Novel;
    isSelectionMode: boolean;
    isSelected: boolean;
    onSelect: (novelId: string) => void;
    onClick: (novel: Novel) => void;
}

export const NovelListItem: React.FC<NovelListItemProps> = ({
    novel,
    isSelectionMode,
    isSelected,
    onSelect,
    onClick,
}) => {
    const [isPressed, setIsPressed] = useState(false);

    return (
        <div
            onClick={() => onClick(novel)}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            onMouseLeave={() => setIsPressed(false)}
            className={`
                cursor-pointer rounded-lg overflow-hidden
                transition-all duration-100 ease-in-out
                bg-white dark:bg-gray-800 shadow-sm
                hover:scale-[1.02] hover:shadow-md
                ${isPressed ? 'scale-[0.98] bg-gray-50 dark:bg-gray-700' : ''}
                active:scale-[0.98] active:bg-gray-50 dark:active:bg-gray-700
            `}
        >
            <div className="flex items-center gap-4 p-4 w-full">
                {isSelectionMode && (
                    <div className="flex-shrink-0">
                        <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => onSelect(novel.id)}
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
    );
}; 