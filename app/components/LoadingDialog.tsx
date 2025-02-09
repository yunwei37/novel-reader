import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';

interface LoadingDialogProps {
    message?: string;
    onCancel?: () => void;
}

export const LoadingDialog: React.FC<LoadingDialogProps> = ({
    message,
    onCancel,
}) => {
    const { t } = useTranslation();

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
                <div className="flex items-center justify-center space-x-4">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-900 dark:text-gray-100">
                        {message || t('dialog.loading')}
                    </p>
                </div>
                {onCancel && (
                    <button
                        onClick={onCancel}
                        className="mt-4 w-full px-4 py-2 rounded-lg
                            bg-white dark:bg-gray-700
                            border border-gray-200 dark:border-gray-600
                            text-gray-900 dark:text-gray-100
                            hover:bg-gray-100 dark:hover:bg-gray-600
                            transition-colors"
                    >
                        {t('dialog.cancel')}
                    </button>
                )}
            </div>
        </div>
    );
}; 