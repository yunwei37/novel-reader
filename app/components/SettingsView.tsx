import React from 'react';

interface SettingsViewProps {
    isDarkMode: boolean;
    onDarkModeToggle: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
    isDarkMode,
    onDarkModeToggle,
}) => {
    return (
        <div className="max-w-2xl mx-auto p-4">
            <section>
                <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                    Appearance
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
        </div>
    );
}; 