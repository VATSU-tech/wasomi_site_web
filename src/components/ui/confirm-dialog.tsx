import { type ReactNode, useEffect, useRef } from 'react';
import { LoadingButton } from './loading-button';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'primary' | 'error';
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  children?: ReactNode;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  variant = 'primary',
  loading = false,
  onConfirm,
  onCancel,
  children,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog ref={dialogRef} className="modal" onClose={onCancel}>
      <div className="modal-box max-w-md">
        <h3 className="font-bold text-lg">{title}</h3>
        {description && (
          <p className="py-3 text-sm text-base-content/70">{description}</p>
        )}
        {children}
        <div className="modal-action">
          <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </button>
          <LoadingButton
            variant={variant === 'error' ? 'error' : 'primary'}
            loading={loading}
            onClick={onConfirm}
          >
            {confirmLabel}
          </LoadingButton>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={onCancel}>
          fermer
        </button>
      </form>
    </dialog>
  );
}
