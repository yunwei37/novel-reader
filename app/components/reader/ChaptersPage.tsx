import React, { useEffect, useRef, useState } from 'react';
import { detectChapters, loadFromStorage, saveToStorage } from '../../lib/reader';
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
    const [chapterPattern, setChapterPattern] = useState(() =>
        loadFromStorage<string>('chapterPattern', '')
    );
    const [isEditing, setIsEditing] = useState(false);
    const [editPattern, setEditPattern] = useState(chapterPattern);
    const chaptersContainerRef = useRef<HTMLDivElement>(null);

    // Detect chapters when content or pattern changes
    useEffect(() => {
        if (content) {
            const detectedChapters = detectChapters(content, chapterPattern);
            console.log('Detected chapters:', detectedChapters.map(ch => ({
                title: ch.title,
                startIndex: ch.startIndex,
                contentPreview: ch.content.slice(0, 50)
            })));
            setChapters(detectedChapters);
        }
    }, [content, chapterPattern]);

    // Find current chapter index
    const currentChapterIndex = chapters.findIndex((chapter, index) => {
        const nextChapter = chapters[index + 1];
        return chapter.startIndex <= currentPosition &&
            (!nextChapter || nextChapter.startIndex > currentPosition);
    });

    // Auto scroll to current chapter
    useEffect(() => {
        if (currentChapterIndex >= 0 && chaptersContainerRef.current) {
            const container = chaptersContainerRef.current;
            const chapterElement = container.children[currentChapterIndex] as HTMLElement;

            if (chapterElement) {
                const containerHeight = container.clientHeight;
                const scrollOffset = chapterElement.offsetTop - containerHeight / 2 + chapterElement.clientHeight / 2;

                container.scrollTo({
                    top: scrollOffset,
                    behavior: 'smooth'
                });
            }
        }
    }, [currentChapterIndex]);

    const handleChapterSelect = (startIndex: number) => {
        console.log('Jumping to chapter at position:', startIndex);
        onPositionChange(startIndex);
    };

    const handlePatternSave = () => {
        setChapterPattern(editPattern);
        saveToStorage('chapterPattern', editPattern);
        setIsEditing(false);
    };

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

            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Chapters</h2>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm text-gray-900 dark:text-gray-100"
                >
                    {isEditing ? 'Cancel' : 'Set Pattern'}
                </button>
            </div>

            {isEditing && (
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Chapter Pattern (Regular Expression)
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={editPattern}
                            onChange={(e) => setEditPattern(e.target.value)}
                            placeholder="Enter regex pattern..."
                            className="flex-1 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handlePatternSave}
                            className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
                        >
                            Save
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Leave empty to use default pattern. Example: ^Chapter \d+
                    </p>
                </div>
            )}

            <div ref={chaptersContainerRef} className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                {chapters.map((chapter, index) => {
                    const isCurrentChapter = index === currentChapterIndex;
                    return (
                        <button
                            key={index}
                            onClick={() => handleChapterSelect(chapter.startIndex)}
                            className={`
                                w-full p-3 rounded-lg text-left transition-colors relative
                                ${isCurrentChapter
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500'
                                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100'
                                }
                            `}
                        >
                            <span className="block text-sm font-medium truncate">
                                {chapter.title}
                            </span>
                            {isCurrentChapter && (
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
