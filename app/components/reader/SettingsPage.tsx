import React from 'react';

interface SettingsPageProps {
    fontSize: number;
    onFontSizeChange: (size: number) => void;
    isPaged: boolean;
    onModeToggle: () => void;
    onBack: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
    fontSize,
    onFontSizeChange,
    isPaged,
    onModeToggle,
    onBack,
}) => {
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
}; 