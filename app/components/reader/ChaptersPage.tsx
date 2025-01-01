import React, { useEffect, useState } from 'react';
import { detectChapters } from '../../lib/reader';
import { Chapter } from '../../types';

interface ChaptersPageProps {
    content: string;
    currentPosition: number;
    onPositionChange: (position: number) => void;
    onBack: () => void;
}

export const ChaptersPage: React.FC<ChaptersPageProps> = ({
    content,
    currentPosition,
    onPositionChange,
    onBack,
}) => {
    const [chapters, setChapters] = useState<Chapter[]>([]);

    // Detect chapters when content changes
    useEffect(() => {
        if (content) {
            setChapters(detectChapters(content));
        }
    }, [content]);

    return (
        <div className="space-y-6">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back</span>
            </button>

            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Chapters</h2>

            <div className="space-y-2">
                {chapters.map((chapter, index) => (
                    <button
                        key={index}
                        onClick={() => onPositionChange(chapter.startIndex)}
                        className={`
              w-full p-3 rounded-lg text-left transition-colors
              ${chapter.startIndex === currentPosition
                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100'
                            }
            `}
                    >
                        <span className="block text-sm font-medium truncate">
                            {chapter.title}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}; 