'use client';

import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';

export type View = 'library' | 'reader' | 'settings' | 'add';

interface NavigationProps {
    currentView: View;
    onViewChange: (view: View) => void;
    isMobile: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
    currentView,
    onViewChange,
    isMobile,
}) => {
    const { t } = useTranslation();

    const navItems: { id: View; label: string; icon: string }[] = [
        { id: 'library', label: t('navigation.library'), icon: '📚' },
        { id: 'reader', label: t('navigation.reader'), icon: '📖' },
        { id: 'settings', label: t('navigation.settings'), icon: '⚙️' },
        { id: 'add', label: t('navigation.add'), icon: '📥' },
    ];

    if (isMobile) {
        return (
            <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-2 py-1 z-50">
                <div className="flex justify-around items-center">
                    {navItems.map(({ id, label, icon }) => (
                        <button
                            key={id}
                            onClick={() => onViewChange(id)}
                            className={`
                                flex flex-col items-center p-2 rounded-lg
                                ${currentView === id
                                    ? 'text-blue-500 dark:text-blue-400'
                                    : 'text-gray-600 dark:text-gray-400'
                                }
                            `}
                        >
                            <span className="text-xl mb-1">{icon}</span>
                            <span className="text-xs">{label}</span>
                        </button>
                    ))}
                </div>
            </nav>
        );
    }

    return (
        <nav className="h-14 border-b border-gray-200 dark:border-gray-700 px-4">
            <div className="h-full flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {t('library.title')}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    {navItems.map(({ id, label, icon }) => (
                        <button
                            key={id}
                            onClick={() => onViewChange(id)}
                            className={`
                                flex items-center gap-2 px-3 py-2 rounded-lg
                                transition-colors
                                ${currentView === id
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }
                            `}
                        >
                            <span>{icon}</span>
                            <span>{label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
}; 