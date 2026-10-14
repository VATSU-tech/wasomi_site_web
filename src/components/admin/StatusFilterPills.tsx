import { cn } from '@/lib/utils';

export type StatusFilterValue = 'all' | string;

interface StatusFilterPillsProps {
  value: StatusFilterValue;
  onChange: (value: StatusFilterValue) => void;
  options: Array<{ id: string; label: string; count?: number }>;
  className?: string;
}

export function StatusFilterPills({
  value,
  onChange,
  options,
  className,
}: StatusFilterPillsProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)} role="tablist" aria-label="Filtrer par statut">
      {options.map((opt) => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.id)}
            className={cn(
              'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200',
              active
                ? 'bg-gradient-primary text-primary-foreground border-transparent shadow-sm scale-[1.02]'
                : 'bg-surface border-border text-muted-foreground hover:text-foreground hover:border-primary/40',
            )}
          >
            {opt.label}
            {typeof opt.count === 'number' && (
              <span
                className={cn(
                  'min-w-5 px-1.5 py-0.5 rounded-full text-[10px] font-bold',
                  active ? 'bg-white/20' : 'bg-muted text-muted-foreground',
                )}
              >
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
