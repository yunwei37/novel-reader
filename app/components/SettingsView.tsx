import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { CONFIG } from '../../config/constants';
import { GitHubIcon } from './icons';

interface SettingsViewProps {
    isDarkMode: boolean;
    onDarkModeToggle: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
    isDarkMode,
    onDarkModeToggle,
}) => {
    const { t } = useTranslation();
    const appVersion = '1.0.0'; // You might want to import this from a config file

    return (
        <div className="h-full overflow-y-auto">
            <div className="max-w-2xl mx-auto p-4 space-y-8 pb-20">
                <section>
                    <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                        {t('settings.appInfo')}
                    </h2>
                    <div className="space-y-4 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <p className="text-gray-700 dark:text-gray-300">
                            {t('settings.appDescription')}
                        </p>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            <p>{t('settings.version')}: {appVersion}  {new Date().getFullYear().toString()} {t('settings.copyright',)} </p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                        {t('settings.themePreference')}
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                                    {t('settings.darkMode')}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {isDarkMode ? t('settings.themeDark') : t('settings.themeLight')}
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

                <section>
                    <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                        {t('settings.language')}
                    </h2>
                    <div className="flex items-center justify-between">
                        <LanguageSelector />
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                        {t('settings.about')}
                    </h2>
                    <div className="space-y-4">
                        <a
                            href={CONFIG.GITHUB_REPO}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                                flex items-center justify-between p-4 
                                bg-white dark:bg-gray-800 
                                hover:bg-gray-50 dark:hover:bg-gray-700
                                rounded-lg border border-gray-200 dark:border-gray-700
                                transition-colors duration-200
                            "
                        >
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                                    {t('settings.viewSource')}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {t('settings.viewSourceDesc')}
                                </p>
                            </div>
                            <GitHubIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                        </a>
                    </div>
                </section>
            </div>
        </div>
    );
}; 