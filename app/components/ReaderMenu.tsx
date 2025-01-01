import React, { useState } from 'react';
import { Bookmark, Chapter } from '../types';

interface ReaderMenuProps {
    isOpen: boolean;
    onClose: () => void;
    // Reading settings
    fontSize: number;
    onFontSizeChange: (size: number) => void;
    isPaged: boolean;
    onModeToggle: () => void;
    // Bookmarks
    currentPosition: number;
    bookmarks: Bookmark[];
    onBookmarkAdd: () => void;
    onBookmarkRemove: (index: number) => void;
    onBookmarkSelect: (position: number) => void;
    // Chapters
    chapters: Chapter[];
    onChapterSelect: (position: number) => void;
}

type MenuPage = 'main' | 'settings' | 'bookmarks' | 'chapters';

export const ReaderMenu: React.FC<ReaderMenuProps> = ({
    isOpen,
    onClose,
    fontSize,
    onFontSizeChange,
    isPaged,
    onModeToggle,
    currentPosition,
    bookmarks,
    onBookmarkAdd,
    onBookmarkRemove,
    onBookmarkSelect,
    chapters,
    onChapterSelect,
}) => {
    const [currentPage, setCurrentPage] = useState<MenuPage>('main');

    if (!isOpen) return null;

    const renderBackButton = () => (
        <button
            onClick={() => setCurrentPage('main')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
        </button>
    );

    const renderMainPage = () => (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Reader Menu</h2>
            <div className="space-y-2">
                <button
                    onClick={() => setCurrentPage('settings')}
                    className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                    <span className="text-gray-900 dark:text-gray-100">Settings</span>
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
                <button
                    onClick={() => setCurrentPage('bookmarks')}
                    className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                    <span className="text-gray-900 dark:text-gray-100">Bookmarks</span>
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
                <button
                    onClick={() => setCurrentPage('chapters')}
                    className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                    <span className="text-gray-900 dark:text-gray-100">Chapters</span>
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );

    const renderSettingsPage = () => (
        <div className="space-y-6">
            {renderBackButton()}
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Settings</h2>
            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Font Size
                    </label>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => onFontSizeChange(fontSize - 1)}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                        </button>
                        <span className="text-gray-900 dark:text-gray-100 tabular-nums w-8 text-center">
                            {fontSize}
                        </span>
                        <button
                            onClick={() => onFontSizeChange(fontSize + 1)}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Reading Mode
                    </label>
                    <button
                        onClick={onModeToggle}
                        className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-left"
                    >
                        {isPaged ? 'Paged Mode' : 'Scroll Mode'}
                    </button>
                </div>
            </div>
        </div>
    );

    const renderBookmarksPage = () => (
        <div className="space-y-6">
            {renderBackButton()}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Bookmarks</h2>
                <button
                    onClick={onBookmarkAdd}
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
                            onClick={() => onBookmarkSelect(bookmark.offset)}
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
                            onClick={() => onBookmarkRemove(index)}
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

    const renderChaptersPage = () => (
        <div className="space-y-6">
            {renderBackButton()}
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Chapters</h2>
            <div className="space-y-2">
                {chapters.map((chapter, index) => (
                    <button
                        key={index}
                        onClick={() => onChapterSelect(chapter.startIndex)}
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

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                onClick={onClose}
            />

            {/* Menu Panel */}
            <div className="
        fixed right-0 top-0 h-full w-[min(100vw-3rem,24rem)]
        bg-white dark:bg-gray-900 shadow-xl z-50
        flex flex-col
      ">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 overscroll-contain">
                    {currentPage === 'main' && renderMainPage()}
                    {currentPage === 'settings' && renderSettingsPage()}
                    {currentPage === 'bookmarks' && renderBookmarksPage()}
                    {currentPage === 'chapters' && renderChaptersPage()}
                </div>
            </div>
        </>
    );
}; 