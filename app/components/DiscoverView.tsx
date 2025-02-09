import { useTranslation } from '../contexts/LanguageContext';

export function DiscoverView() {
  const { t } = useTranslation();

  return (
    <div className="p-4">
      <p className="text-center text-gray-600 dark:text-gray-400">
        {t('discover.comingSoon')}
      </p>
    </div>
  );
} 