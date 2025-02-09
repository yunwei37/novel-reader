'use client';

import { useTranslation } from '../../contexts/LanguageContext';
import type { MenuPage } from './ReaderMenu';

interface MainMenuPageProps {
    onNavigate: (page: MenuPage) => void;
}

export const MainMenuPage: React.FC<MainMenuPageProps> = ({
    onNavigate,
}) => {
    const { t } = useTranslation();

    const menuItems = [
        { id: 'settings', label: t('reader.menu.settings'), icon: '⚙️' },
        { id: 'bookmarks', label: t('reader.menu.bookmarks'), icon: '🔖' },
        { id: 'chapters', label: t('reader.menu.chapters'), icon: '📑' },
        { id: 'search', label: t('reader.menu.search'), icon: '🔍' },
    ] as const;

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {t('reader.menu.title')}
            </h2>
            {menuItems.map(({ id, label, icon }) => (
                <button
                    key={id}
                    onClick={() => onNavigate(id as MenuPage)}
                    className="w-full flex items-center gap-4 p-4 rounded-lg
                        bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700
                        transition-colors"
                >
                    <span className="text-2xl">{icon}</span>
                    <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {label}
                    </span>
                </button>
            ))}
        </div>
    );
}; 