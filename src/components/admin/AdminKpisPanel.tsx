import { useCallback, useEffect, useState } from 'react';
import { Plus, RefreshCw, Save, Trash2, BarChart3 } from 'lucide-react';
import { adminService } from '@/services/admin.service';
import { DEFAULT_SITE_KPIS, normalizeSiteKpis } from '@/lib/site-kpis';
import type { SiteKpiItem } from '@/types/domain';
import { toast } from 'sonner';

function newKey() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `kpi-${crypto.randomUUID().slice(0, 8)}`;
  }
  return `kpi-${Date.now()}`;
}

export function AdminKpisPanel() {
  const [items, setItems] = useState<SiteKpiItem[]>(DEFAULT_SITE_KPIS.items.map((k) => ({ ...k })));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.getSettings();
      const settings = (res.data || {}) as Record<string, unknown>;
      const next = normalizeSiteKpis(settings.site_kpis);
      setItems(next.items);
      setDirty(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Impossible de charger les compteurs.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateItem = (index: number, patch: Partial<SiteKpiItem>) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
    setDirty(true);
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { key: newKey(), label: 'Nouvel indicateur', value: 0, suffix: '' },
    ]);
    setDirty(true);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
    setDirty(true);
  };

  const resetDefaults = () => {
    setItems(DEFAULT_SITE_KPIS.items.map((k) => ({ ...k })));
    setDirty(true);
  };

  const save = async () => {
    const normalized = normalizeSiteKpis({ items });
    if (normalized.items.length === 0) {
      toast.error('Ajoutez au moins un indicateur.');
      return;
    }
    setSaving(true);
    try {
      await adminService.updateSettings({ site_kpis: normalized });
      setItems(normalized.items);
      setDirty(false);
      toast.success('Compteurs mis à jour — visibles immédiatement sur le site.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Échec de l’enregistrement';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display inline-flex items-center gap-2">
            <BarChart3 className="size-5 text-primary" />
            Compteurs du site
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-xl">
            Ces indicateurs alimentent la barre de statistiques de la page d’accueil.
            Les modifications sont publiées immédiatement après enregistrement.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={load}
            disabled={loading || saving}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-surface-elevated disabled:opacity-50"
          >
            <RefreshCw className={`size-3.5 ${loading ? 'animate-spin' : ''}`} />
            Recharger
          </button>
          <button
            type="button"
            onClick={resetDefaults}
            disabled={loading || saving}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-surface-elevated disabled:opacity-50"
          >
            Valeurs par défaut
          </button>
          <button
            type="button"
            onClick={save}
            disabled={loading || saving || !dirty}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-primary text-primary-foreground text-xs font-bold shadow-md disabled:opacity-50"
          >
            <Save className="size-3.5" />
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-surface animate-pulse border border-border" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={`${item.key}-${index}`}
              className="grid gap-3 sm:grid-cols-[1fr_7rem_5rem_auto] items-end rounded-2xl border border-border bg-surface/60 p-4"
            >
              <label className="block space-y-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Libellé
                </span>
                <input
                  value={item.label}
                  onChange={(e) => updateItem(index, { label: e.target.value })}
                  className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Ex. Élèves accompagnés"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Valeur
                </span>
                <input
                  type="number"
                  value={item.value}
                  onChange={(e) => updateItem(index, { value: Number(e.target.value) })}
                  className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-bold tabular-nums outline-none focus:ring-2 focus:ring-primary/30"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Suffixe
                </span>
                <input
                  value={item.suffix}
                  onChange={(e) => updateItem(index, { suffix: e.target.value })}
                  className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="+ / %"
                  maxLength={4}
                />
              </label>
              <button
                type="button"
                aria-label="Supprimer l’indicateur"
                onClick={() => removeItem(index)}
                disabled={items.length <= 1}
                className="inline-flex size-10 items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-destructive hover:border-destructive/40 disabled:opacity-40"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl border border-dashed border-border text-sm font-semibold text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
          >
            <Plus className="size-4" />
            Ajouter un compteur
          </button>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4">
              Aperçu accueil
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {items.map((item) => (
                <div key={item.key} className="text-center rounded-xl bg-surface border border-border p-4">
                  <p className="font-display text-2xl font-bold text-primary tabular-nums">
                    {item.value}
                    {item.suffix}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {dirty && (
            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
              Modifications non enregistrées.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
