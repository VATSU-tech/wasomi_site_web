import { useCallback, useEffect, useState } from 'react';
import { Pencil, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { adminService } from '@/services/admin.service';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { SchoolClass } from '@/types/domain';

type FormState = {
  section: string;
  option_name: string;
  class_name: string;
  label: string;
  is_open: boolean;
  sort_order: number;
};

const emptyForm = (): FormState => ({
  section: 'Primaire',
  option_name: '',
  class_name: '',
  label: '',
  is_open: true,
  sort_order: 0,
});

export function AdminClassesPanel() {
  const [items, setItems] = useState<SchoolClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<SchoolClass | 'new' | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.getClasses();
      setItems(Array.isArray(res.data) ? (res.data as SchoolClass[]) : []);
    } catch (err: any) {
      toast.error(err?.message ?? 'Impossible de charger les classes.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing('new');
    setForm(emptyForm());
  };

  const openEdit = (item: SchoolClass) => {
    setEditing(item);
    setForm({
      section: item.section || '',
      option_name: item.option_name || '',
      class_name: item.class_name || '',
      label: item.label || '',
      is_open: item.is_open !== false,
      sort_order: item.sort_order || 0,
    });
  };

  const save = async () => {
    if (!form.section.trim() || !form.class_name.trim()) {
      toast.error('Section et nom de classe requis');
      return;
    }
    try {
      const payload = {
        ...form,
        option_name: form.option_name.trim() || null,
        label: form.label.trim() || form.class_name,
      };
      if (editing === 'new') {
        await adminService.createClass(payload);
      } else if (editing) {
        await adminService.updateClass(editing.id, payload);
      }
      toast.success('Classe enregistrée');
      setEditing(null);
      await load();
    } catch (err: any) {
      toast.error(err?.message ?? 'Échec de l’enregistrement');
    }
  };

  const remove = async (id: string | number) => {
    if (!confirm('Supprimer cette classe ?')) return;
    try {
      await adminService.deleteClass(id);
      toast.success('Classe supprimée');
      await load();
    } catch (err: any) {
      toast.error(err?.message ?? 'Suppression impossible');
    }
  };

  const toggleOpen = async (item: SchoolClass) => {
    try {
      await adminService.updateClass(item.id, { is_open: !item.is_open });
      await load();
    } catch (err: any) {
      toast.error(err?.message ?? 'Action impossible');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold font-display">Classes ouvertes</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Alimente le sélecteur cascade (section → option → classe) du formulaire d’inscription.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={load}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-border text-sm font-semibold hover:bg-surface-elevated"
          >
            <RefreshCw className="size-4" />
            Actualiser
          </button>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-primary text-primary-foreground rounded-xl text-sm font-semibold shadow-elegant"
          >
            <Plus className="size-4" />
            Ajouter
          </button>
        </div>
      </div>

      {editing && (
        <div className="p-6 rounded-2xl border border-border bg-surface-elevated space-y-4 shadow-sm">
          <h3 className="font-display font-semibold text-lg">
            {editing === 'new' ? 'Nouvelle classe' : 'Modifier la classe'}
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {(
              [
                ['section', 'Section (ex: Maternelle)'],
                ['option_name', 'Option (optionnel)'],
                ['class_name', 'Nom de classe'],
                ['label', 'Libellé affiché'],
              ] as const
            ).map(([key, label]) => (
              <div key={key}>
                <label className="text-xs font-semibold uppercase text-muted-foreground">{label}</label>
                <input
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full mt-1.5 px-3 py-2 rounded-xl border border-border bg-background text-sm focus:border-primary focus:outline-none"
                />
              </div>
            ))}
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Ordre</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) || 0 })}
                className="w-full mt-1.5 px-3 py-2 rounded-xl border border-border bg-background text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <label className="inline-flex items-center gap-2 text-sm font-semibold self-end pb-2">
              <input
                type="checkbox"
                checked={form.is_open}
                onChange={(e) => setForm({ ...form, is_open: e.target.checked })}
                className="size-4 rounded border-border"
              />
              Ouverte aux inscriptions
            </label>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={save}
              className="px-5 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-semibold"
            >
              Enregistrer
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="px-5 py-2.5 rounded-xl border border-border text-sm font-semibold"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-sm text-muted-foreground">Chargement…</div>
      ) : items.length === 0 ? (
        <div className="p-12 border border-dashed border-border rounded-2xl text-center text-sm text-muted-foreground">
          Aucune classe. Le formulaire public utilisera le fallback local.
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={String(item.id)}
              className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-border bg-surface-elevated"
            >
              <div className="min-w-0">
                <p className="font-semibold truncate">{item.label || item.class_name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.section}
                  {item.option_name ? ` · ${item.option_name}` : ''}
                  {' · '}
                  ordre {item.sort_order ?? 0}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => toggleOpen(item)}
                  className={cn(
                    'px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border',
                    item.is_open !== false
                      ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                      : 'bg-muted text-muted-foreground border-border',
                  )}
                >
                  {item.is_open !== false ? 'Ouverte' : 'Fermée'}
                </button>
                <button
                  type="button"
                  onClick={() => openEdit(item)}
                  className="size-9 rounded-lg border border-border flex items-center justify-center hover:bg-muted"
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  className="size-9 rounded-lg border border-destructive/30 text-destructive flex items-center justify-center hover:bg-destructive/10"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
