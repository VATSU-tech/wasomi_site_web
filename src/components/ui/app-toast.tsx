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
