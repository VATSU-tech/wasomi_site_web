import { type ReactNode, useEffect } from 'react';
import { toast as sonnerToast } from 'sonner';

type ToastType = 'success' | 'error' | 'warning' | 'info';

export function showToast(message: string, type: ToastType = 'info') {
  const options = { duration: 4000 };
  switch (type) {
    case 'success':
      sonnerToast.success(message, options);
      break;
    case 'error':
      sonnerToast.error(message, options);
      break;
    case 'warning':
      sonnerToast.warning(message, options);
      break;
    default:
      sonnerToast(message, options);
  }
}

export function useSchoolApiToasts() {
  useEffect(() => {
    import('@/api/core/client').then(({ setSchoolApiToastHandler }) => {
      setSchoolApiToastHandler((message, type) => {
        showToast(message, type);
      });
    });
    return () => {
      import('@/api/core/client').then(({ setSchoolApiToastHandler }) => {
        setSchoolApiToastHandler(null);
      });
    };
  }, []);
}

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="size-16 rounded-full bg-base-200 flex items-center justify-center mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="size-8 text-base-content/40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-base-content">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-base-content/60 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
