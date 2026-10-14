import { useCallback, useEffect, useMemo, useState } from 'react';
import { Check, RefreshCw, Star, Trash2, X } from 'lucide-react';
import { adminService } from '@/services/admin.service';
import { StatusFilterPills } from '@/components/admin/StatusFilterPills';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { Review } from '@/types/domain';

export function AdminReviewsPanel() {
  const [items, setItems] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const status = filter === 'all' ? undefined : filter;
      const res = await adminService.getReviews(status);
      setItems(Array.isArray(res.data) ? (res.data as Review[]) : []);
    } catch (err: any) {
      toast.error(err?.message ?? 'Impossible de charger les avis.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  const counts = useMemo(() => {
    // When filtered, counts are approximate for current list only;
    // we still show useful badges from the loaded set.
    const base = { all: items.length, pending: 0, approved: 0, rejected: 0 };
    for (const r of items) {
      const s = r.status || 'pending';
      if (s in base) (base as Record<string, number>)[s] += 1;
    }
    return base;
  }, [items]);

  const update = async (id: string | number, data: Partial<Review>) => {
    try {
      await adminService.updateReview(id, data);
      toast.success('Avis mis à jour');
      await load();
    } catch (err: any) {
      toast.error(err?.message ?? 'Mise à jour impossible');
    }
  };

  const remove = async (id: string | number) => {
    if (!confirm('Supprimer cet avis ?')) return;
    try {
      await adminService.deleteReview(id);
      toast.success('Avis supprimé');
      await load();
    } catch (err: any) {
      toast.error(err?.message ?? 'Suppression impossible');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold font-display">Modération des avis</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Validez les avis publics avant affichage. Marquez les meilleurs en « à la une ».
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-border text-sm font-semibold hover:bg-surface-elevated"
        >
          <RefreshCw className="size-4" />
          Actualiser
        </button>
      </div>

      <StatusFilterPills
        value={filter}
        onChange={setFilter}
        options={[
          { id: 'all', label: 'Tous', count: filter === 'all' ? counts.all : undefined },
          { id: 'pending', label: 'En attente' },
          { id: 'approved', label: 'Approuvés' },
          { id: 'rejected', label: 'Rejetés' },
        ]}
      />

      {loading ? (
        <div className="py-12 text-center text-sm text-muted-foreground">Chargement…</div>
      ) : items.length === 0 ? (
        <div className="p-12 border border-dashed border-border rounded-2xl text-center text-sm text-muted-foreground">
          Aucun avis pour ce filtre.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <article
              key={String(item.id)}
              className="p-4 rounded-xl border border-border bg-surface-elevated space-y-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{item.author_name}</p>
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase',
                        item.status === 'approved' && 'bg-emerald-500/10 text-emerald-600',
                        item.status === 'pending' && 'bg-amber-500/10 text-amber-600',
                        item.status === 'rejected' && 'bg-rose-500/10 text-rose-600',
                      )}
                    >
                      {item.status}
                    </span>
                    {item.is_featured && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
                        À la une
                      </span>
                    )}
                  </div>
                  {item.author_role && (
                    <p className="text-xs text-muted-foreground mt-0.5">{item.author_role}</p>
                  )}
                  <div className="flex gap-0.5 mt-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'size-3.5',
                          i < (item.rating || 5)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-muted-foreground/30',
                        )}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {item.status !== 'approved' && (
                    <button
                      type="button"
                      onClick={() => update(item.id, { status: 'approved' })}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 text-xs font-semibold"
                    >
                      <Check className="size-3.5" />
                      Approuver
                    </button>
                  )}
                  {item.status !== 'rejected' && (
                    <button
                      type="button"
                      onClick={() => update(item.id, { status: 'rejected' })}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-600 text-xs font-semibold"
                    >
                      <X className="size-3.5" />
                      Rejeter
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      update(item.id, {
                        is_featured: !item.is_featured,
                        status: item.status === 'pending' ? 'approved' : item.status,
                      })
                    }
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold hover:bg-muted"
                  >
                    <Star className="size-3.5" />
                    {item.is_featured ? 'Retirer à la une' : 'Mettre à la une'}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    className="size-8 rounded-lg border border-destructive/30 text-destructive flex items-center justify-center hover:bg-destructive/10"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-foreground/90">“{item.content}”</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
