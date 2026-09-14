import { type ButtonHTMLAttributes, type ReactNode } from 'react';

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'error' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const variantClass: Record<NonNullable<LoadingButtonProps['variant']>, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  accent: 'btn-accent',
  ghost: 'btn-ghost',
  error: 'btn-error',
  outline: 'btn-outline',
};

const sizeClass: Record<NonNullable<LoadingButtonProps['size']>, string> = {
  xs: 'btn-xs',
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
};

export function LoadingButton({
  loading = false,
  loadingText,
  variant = 'primary',
  size = 'md',
  disabled,
  className = '',
  children,
  ...props
}: LoadingButtonProps) {
  return (
    <button
      type="button"
      className={`btn ${variantClass[variant]} ${sizeClass[size]} ${className}`.trim()}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="loading loading-spinner loading-sm" />}
      {loading ? (loadingText ?? children) : children}
    </button>
  );
}
