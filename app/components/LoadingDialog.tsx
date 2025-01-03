import React from 'react';

interface LoadingDialogProps {
    message: string;
    onCancel: () => void;
}

export const LoadingDialog: React.FC<LoadingDialogProps> = ({
    message,
    onCancel,
}) => {
    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />

            {/* Dialog */}
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(90vw,24rem)] 
                bg-white dark:bg-gray-900 rounded-lg shadow-xl z-50 p-6">
                <div className="flex flex-col items-center gap-4">
                    {/* Loading spinner */}
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />

                    {/* Message */}
                    <p className="text-gray-900 dark:text-gray-100 text-center">
                        {message}
                    </p>

                    {/* Cancel button */}
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 
                            rounded-lg text-gray-900 dark:text-gray-100 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </>
    );
}; 