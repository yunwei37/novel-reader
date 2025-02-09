import { useTranslation } from '../../contexts/LanguageContext';
import { useState } from 'react';

interface AddRepositoryDialogProps {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onAdd: (url: string) => void;
}

export function AddRepositoryDialog({ 
  isOpen, 
  isLoading, 
  onClose, 
  onAdd 
}: AddRepositoryDialogProps) {
  const { t } = useTranslation();
  const [url, setUrl] = useState('');

  const handleSubmit = () => {
    if (!url) return;
    onAdd(url);
    setUrl('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
          {t('discover.addRepo')}
        </h3>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={t('discover.addRepoUrl')}
          className="w-full px-4 py-2 rounded-lg mb-4
            bg-gray-100 dark:bg-gray-700
            text-gray-900 dark:text-gray-100
            border border-gray-200 dark:border-gray-600"
        />
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-400"
          >
            {t('dialog.cancel')}
          </button>
          <button
            onClick={handleSubmit}
            disabled={!url || isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg
              disabled:bg-gray-300 dark:disabled:bg-gray-700"
          >
            {t('discover.addRepoButton')}
          </button>
        </div>
      </div>
    </div>
  );
} 