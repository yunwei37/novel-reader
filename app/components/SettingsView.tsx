import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { LanguageSelector } from './LanguageSelector';

interface SettingsViewProps {
    isDarkMode: boolean;
    onDarkModeToggle: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
    isDarkMode,
    onDarkModeToggle,
}) => {
    const { t } = useTranslation();

    return (
        <div className="max-w-2xl mx-auto p-4">
            <section>
                <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                    {t('settings.darkMode')}
                </h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div>
                            <h3 className="font-medium text-gray-900 dark:text-gray-100">Dark Mode</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Switch between light and dark themes
                            </p>
                        </div>
                        <button
                            onClick={onDarkModeToggle}
                            className={`
                p-2 rounded-lg transition-colors
                ${isDarkMode
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                }
              `}
                            aria-label="Toggle dark mode"
                        >
                            <span className="text-xl">
                                {isDarkMode ? '🌙' : '☀️'}
                            </span>
                        </button>
                    </div>
                </div>
            </section>

            <section className="mt-8">
                <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                    {t('settings.language')}
                </h2>
                <div className="flex items-center justify-between">
                    <LanguageSelector />
                </div>
            </section>
        </div>
    );
}; 