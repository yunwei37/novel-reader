import React, { useEffect, useState } from 'react';
import { loadFromStorage, saveToStorage } from '../../lib/reader';
import { Bookmark } from '../../types';

interface BookmarksPageProps {
    currentPosition: number;
    onPositionChange: (position: number) => void;
    onBack: () => void;
}

export const BookmarksPage: React.FC<BookmarksPageProps> = ({
    currentPosition,
    onPositionChange,
    onBack,
}) => {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

    // Load bookmarks from storage
    useEffect(() => {
        const savedBookmarks = loadFromStorage<Bookmark[]>('bookmarks', []);
        setBookmarks(savedBookmarks);
    }, []);

    // Save bookmarks to storage
    useEffect(() => {
        saveToStorage('bookmarks', bookmarks);
    }, [bookmarks]);

    const handleBookmarkAdd = () => {
        const newBookmark: Bookmark = {
            offset: currentPosition,
            timestamp: Date.now()
        };
        setBookmarks(prev => [...prev, newBookmark]);
    };

    const handleBookmarkRemove = (index: number) => {
        setBookmarks(prev => prev.filter((_, i) => i !== index));
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
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Bookmarks</h2>
                <button
                    onClick={handleBookmarkAdd}
                    className="px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm"
                >
                    Add Bookmark
                </button>
            </div>

            <div className="space-y-2">
                {bookmarks.map((bookmark, index) => (
                    <div
                        key={index}
                        className="relative group flex items-center gap-2 p-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                        <button
                            onClick={() => onPositionChange(bookmark.offset)}
                            className="flex-1 text-left"
                        >
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                Position {Math.round(bookmark.offset)}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(bookmark.timestamp).toLocaleString()}
                            </div>
                        </button>
                        <button
                            onClick={() => handleBookmarkRemove(index)}
                            className="p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ))}
                {bookmarks.length === 0 && (
                    <p className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
                        No bookmarks yet
                    </p>
                )}
            </div>
        </div>
    );
}; 