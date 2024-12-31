import React, { useEffect, useState } from 'react';

interface ReaderSettings {
    fontSize: number;
    lineHeight: number;
    theme: 'light' | 'dark' | 'sepia';
    fontFamily: string;
    margins: number;
    pageTransitions: boolean;
}

const defaultSettings: ReaderSettings = {
    fontSize: 16,
    lineHeight: 1.5,
    theme: 'light',
    fontFamily: 'system-ui',
    margins: 16,
    pageTransitions: true,
};

interface SettingsViewProps {
    onSettingsChange: (settings: ReaderSettings) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onSettingsChange }) => {
    const [settings, setSettings] = useState<ReaderSettings>(defaultSettings);

    useEffect(() => {
        const savedSettings = localStorage.getItem('reader_settings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
    }, []);

    const updateSetting = <K extends keyof ReaderSettings>(
        key: K,
        value: ReaderSettings[K]
    ) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        localStorage.setItem('reader_settings', JSON.stringify(newSettings));
        onSettingsChange(newSettings);
    };

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-8">
            <section>
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                    Text Settings
                </h2>
                <div className="space-y-4">
                    {/* Font Size */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Font Size: {settings.fontSize}px
                        </label>
                        <input
                            type="range"
                            min="12"
                            max="24"
                            value={settings.fontSize}
                            onChange={(e) => updateSetting('fontSize', Number(e.target.value))}
                            className="w-full"
                        />
                    </div>

                    {/* Line Height */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Line Height: {settings.lineHeight}
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="2"
                            step="0.1"
                            value={settings.lineHeight}
                            onChange={(e) => updateSetting('lineHeight', Number(e.target.value))}
                            className="w-full"
                        />
                    </div>

                    {/* Font Family */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Font Family
                        </label>
                        <select
                            value={settings.fontFamily}
                            onChange={(e) => updateSetting('fontFamily', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
                        >
                            <option value="system-ui">System Default</option>
                            <option value="serif">Serif</option>
                            <option value="sans-serif">Sans Serif</option>
                            <option value="monospace">Monospace</option>
                        </select>
                    </div>

                    {/* Margins */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Page Margins: {settings.margins}px
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="64"
                            value={settings.margins}
                            onChange={(e) => updateSetting('margins', Number(e.target.value))}
                            className="w-full"
                        />
                    </div>
                </div>
            </section>

            <section>
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                    Theme Settings
                </h2>
                <div className="grid grid-cols-3 gap-4">
                    {(['light', 'dark', 'sepia'] as const).map((theme) => (
                        <button
                            key={theme}
                            onClick={() => updateSetting('theme', theme)}
                            className={`
                p-4 rounded-lg border-2 transition-colors
                ${settings.theme === theme
                                    ? 'border-blue-500 dark:border-blue-400'
                                    : 'border-gray-200 dark:border-gray-700'
                                }
                ${theme === 'light'
                                    ? 'bg-white text-gray-900'
                                    : theme === 'dark'
                                        ? 'bg-gray-900 text-white'
                                        : 'bg-[#f4ecd8] text-gray-900'
                                }
              `}
                        >
                            {theme.charAt(0).toUpperCase() + theme.slice(1)}
                        </button>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                    Reading Settings
                </h2>
                <div>
                    <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <input
                            type="checkbox"
                            checked={settings.pageTransitions}
                            onChange={(e) => updateSetting('pageTransitions', e.target.checked)}
                            className="rounded border-gray-300 dark:border-gray-600"
                        />
                        Enable Page Transitions
                    </label>
                </div>
            </section>

            <section className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <button
                    onClick={() => {
                        setSettings(defaultSettings);
                        localStorage.setItem('reader_settings', JSON.stringify(defaultSettings));
                        onSettingsChange(defaultSettings);
                    }}
                    className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                    Reset to Defaults
                </button>
            </section>
        </div>
    );
}; 