import React from 'react';

interface MainMenuPageProps {
    onNavigate: (page: 'settings' | 'bookmarks' | 'chapters') => void;
}

export const MainMenuPage: React.FC<MainMenuPageProps> = ({
    onNavigate,
}) => {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Reader Menu</h2>
            <div className="space-y-2">
                <button
                    onClick={() => onNavigate('settings')}
                    className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                    <span className="text-gray-900 dark:text-gray-100">Settings</span>
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
                <button
                    onClick={() => onNavigate('bookmarks')}
                    className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                    <span className="text-gray-900 dark:text-gray-100">Bookmarks</span>
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
                <button
                    onClick={() => onNavigate('chapters')}
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
}; 