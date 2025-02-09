import React, { useEffect, useState } from 'react';
import { useTranslation } from '../../contexts/LanguageContext';

interface SettingsPageProps {
    fontSize: number;
    onFontSizeChange: (size: number) => void;
    isPaged: boolean;
    onModeToggle: () => void;
    onBack: () => void;
    charsPerPage?: number;
    onCharsPerPageChange?: (chars: number) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
    fontSize,
    onFontSizeChange,
    isPaged,
    onModeToggle,
    onBack,
    charsPerPage = 500,
    onCharsPerPageChange,
}) => {
    const { t } = useTranslation();
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    // Initialize theme from system/localStorage
    useEffect(() => {
        if (document.documentElement.classList.contains('dark')) {
            setTheme('dark');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);

        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        // Optionally save to localStorage
        localStorage.setItem('theme', newTheme);
    };

    return (
        <div className="space-y-6">
            <button
                onClick={onBack}
                className="
                    flex items-center gap-2 
                    text-gray-700 dark:text-gray-300 
                    hover:text-gray-900 hover:bg-gray-100
                    dark:hover:text-white dark:hover:bg-gray-800
                    rounded-md p-1.5 -ml-1.5
                    transition-colors duration-200
                "
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>{t('common.back')}</span>
            </button>

            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('common.settings')}</h2>

            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('settings.theme')}
                    </label>
                    <button
                        onClick={toggleTheme}
                        className="
                            w-full flex items-center justify-between p-3 
                            bg-gray-100 dark:bg-gray-800 
                            hover:bg-gray-200 dark:hover:bg-gray-700
                            text-left rounded-lg
                            transition-colors duration-200
                        "
                    >
                        <span className="text-gray-900 dark:text-gray-100">
                            {theme === 'light' ? t('settings.themeLight') : t('settings.themeDark')}
                        </span>
                        <div className="relative">
                            {theme === 'light' ? (
                                <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                                    />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                                    />
                                </svg>
                            )}
                        </div>
                    </button>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('settings.fontSize')}
                    </label>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => onFontSizeChange(fontSize - 1)}
                            className="
                                p-2 rounded-lg 
                                bg-gray-100 dark:bg-gray-800
                                hover:bg-gray-200 dark:hover:bg-gray-700
                                text-gray-700 dark:text-gray-300
                                transition-colors duration-200
                            "
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
                            className="
                                p-2 rounded-lg 
                                bg-gray-100 dark:bg-gray-800
                                hover:bg-gray-200 dark:hover:bg-gray-700
                                text-gray-700 dark:text-gray-300
                                transition-colors duration-200
                            "
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('settings.readingMode')}
                    </label>
                    <button
                        onClick={onModeToggle}
                        className="
                            w-full p-3 rounded-lg 
                            bg-gray-100 dark:bg-gray-800
                            hover:bg-gray-200 dark:hover:bg-gray-700
                            text-left
                            transition-colors duration-200
                        "
                    >
                        <span className="text-gray-900 dark:text-gray-100">
                            {isPaged ? t('settings.pagedMode') : t('settings.scrollMode')}
                        </span>
                    </button>
                </div>

                {isPaged && onCharsPerPageChange && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('settings.charactersPerPage')}
                        </label>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => onCharsPerPageChange(Math.max(200, charsPerPage - 100))}
                                className="
                                    p-2 rounded-lg 
                                    bg-gray-100 dark:bg-gray-800
                                    hover:bg-gray-200 dark:hover:bg-gray-700
                                    text-gray-700 dark:text-gray-300
                                    transition-colors duration-200
                                "
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                            </button>
                            <span className="text-gray-900 dark:text-gray-100 tabular-nums w-16 text-center">
                                {charsPerPage}
                            </span>
                            <button
                                onClick={() => onCharsPerPageChange(Math.min(2000, charsPerPage + 100))}
                                className="
                                    p-2 rounded-lg 
                                    bg-gray-100 dark:bg-gray-800
                                    hover:bg-gray-200 dark:hover:bg-gray-700
                                    text-gray-700 dark:text-gray-300
                                    transition-colors duration-200
                                "
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}; 