import { useCallback, useEffect, useState } from 'react';
import {
  GripVertical,
  Image as ImageIcon,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  Eye,
  EyeOff,
  Timer,
} from 'lucide-react';
import { adminService } from '@/services/admin.service';
import { ImagePickerModal, type SelectedMedia } from '@/components/admin/ImagePickerModal';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { HeroSlide } from '@/types/domain';

const DEFAULT_DURATION_SEC = 5;
const MIN_DURATION_SEC = 1;
const MAX_DURATION_SEC = 120;

type FormState = {
  title: string;
  subtitle: string;
  image_url: string;
  cta_label: string;
  cta_href: string;
  /** Durée en secondes (stockée en ms côté API) */
  duration_sec: number;
  is_active: boolean;
};

const emptyForm = (): FormState => ({
  title: '',
  subtitle: '',
  image_url: '',
  cta_label: 'Découvrir',
  cta_href: '/formations',
  duration_sec: DEFAULT_DURATION_SEC,
  is_active: true,
});

function msToSec(ms: number | null | undefined): number {
  const n = Number(ms);
  if (!Number.isFinite(n) || n <= 0) return DEFAULT_DURATION_SEC;
  return Math.min(MAX_DURATION_SEC, Math.max(MIN_DURATION_SEC, Math.round(n / 1000)));
}

function secToMs(sec: number): number {
  const n = Number(sec);
  if (!Number.isFinite(n)) return DEFAULT_DURATION_SEC * 1000;
  return Math.min(MAX_DURATION_SEC, Math.max(MIN_DURATION_SEC, Math.round(n))) * 1000;
}

export function AdminHeroPanel() {
  const [items, setItems] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<HeroSlide | 'new' | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [pickerOpen, setPickerOpen] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.getHeroSlides();
      setItems(Array.isArray(res.data) ? (res.data as HeroSlide[]) : []);
    } catch (err: any) {
      toast.error(err?.message ?? 'Impossible de charger les slides.');
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

  const openEdit = (item: HeroSlide) => {
    setEditing(item);
    setForm({
      title: item.title || '',
      subtitle: item.subtitle || '',
      image_url: item.image_url || '',
      cta_label: item.cta_label || '',
      cta_href: item.cta_href || '',
      duration_sec: msToSec(item.duration_ms),
      is_active: item.is_active !== false,
    });
  };

  const save = async () => {
    const payload = {
      title: form.title,
      subtitle: form.subtitle,
      image_url: form.image_url,
      cta_label: form.cta_label,
      cta_href: form.cta_href,
      duration_ms: secToMs(form.duration_sec),
      is_active: form.is_active,
    };
    try {
      if (editing === 'new') {
        await adminService.createHeroSlide({
          ...payload,
          sort_order: items.length,
        });
      } else if (editing) {
        await adminService.updateHeroSlide(editing.id, payload);
      }
      toast.success('Slide enregistré');
      setEditing(null);
      await load();
    } catch (err: any) {
      toast.error(err?.message ?? 'Échec de l’enregistrement');
    }
  };

  const remove = async (id: string | number) => {
    if (!confirm('Supprimer ce slide ?')) return;
    try {
      await adminService.deleteHeroSlide(id);
      toast.success('Slide supprimé');
      await load();
    } catch (err: any) {
      toast.error(err?.message ?? 'Suppression impossible');
    }
  };

  const toggleActive = async (item: HeroSlide) => {
    try {
      await adminService.updateHeroSlide(item.id, { is_active: !item.is_active });
      await load();
    } catch (err: any) {
      toast.error(err?.message ?? 'Action impossible');
    }
  };

  const onDropReorder = async (targetId: string) => {
    if (!dragId || dragId === targetId) {
      setDragId(null);
      return;
    }
    const from = items.findIndex((i) => String(i.id) === dragId);
    const to = items.findIndex((i) => String(i.id) === targetId);
    if (from < 0 || to < 0) {
      setDragId(null);
      return;
    }
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setItems(next);
    setDragId(null);
    try {
      await adminService.reorderHeroSlides(next.map((i) => i.id));
      toast.success('Ordre mis à jour');
    } catch (err: any) {
      toast.error(err?.message ?? 'Réordonnancement impossible');
      await load();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold font-display">Carousel d’accueil</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Glissez-déposez pour réordonner. Chaque slide peut avoir sa propre durée d’affichage.
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
            Ajouter un slide
          </button>
        </div>
      </div>

      {editing && (
        <div className="p-6 rounded-2xl border border-border bg-surface-elevated space-y-4 shadow-sm animate-in fade-in duration-300">
          <h3 className="font-display font-semibold text-lg">
            {editing === 'new' ? 'Nouveau slide' : 'Modifier le slide'}
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold uppercase text-muted-foreground">Image</label>
              <div className="mt-1.5 flex items-start gap-4">
                <div className="size-28 rounded-xl border-2 border-dashed border-border bg-muted/30 flex items-center justify-center overflow-hidden shrink-0">
                  {form.image_url ? (
                    <img src={form.image_url} alt="" className="size-full object-cover" />
                  ) : (
                    <ImageIcon className="size-8 text-muted-foreground/40" />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setPickerOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary/10 text-primary text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-smooth"
                  >
                    <ImageIcon className="size-3.5" />
                    Choisir une image
                  </button>
                  {form.image_url && (
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, image_url: '' }))}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-destructive/30 text-destructive text-xs font-semibold"
                    >
                      Retirer
                    </button>
                  )}
                </div>
              </div>
            </div>
            {(
              [
                ['title', 'Titre'],
                ['subtitle', 'Sous-titre'],
                ['cta_label', 'Libellé CTA'],
                ['cta_href', 'Lien CTA'],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className={key === 'subtitle' ? 'sm:col-span-2' : ''}>
                <label className="text-xs font-semibold uppercase text-muted-foreground">{label}</label>
                {key === 'subtitle' ? (
                  <textarea
                    rows={2}
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full mt-1.5 px-3 py-2 rounded-xl border border-border bg-background text-sm focus:border-primary focus:outline-none"
                  />
                ) : (
                  <input
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full mt-1.5 px-3 py-2 rounded-xl border border-border bg-background text-sm focus:border-primary focus:outline-none"
                  />
                )}
              </div>
            ))}
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground inline-flex items-center gap-1.5">
                <Timer className="size-3.5" />
                Durée d’affichage (secondes)
              </label>
              <input
                type="number"
                min={MIN_DURATION_SEC}
                max={MAX_DURATION_SEC}
                step={1}
                value={form.duration_sec}
                onChange={(e) => {
                  const raw = Number.parseInt(e.target.value, 10);
                  setForm({
                    ...form,
                    duration_sec: Number.isFinite(raw)
                      ? Math.min(MAX_DURATION_SEC, Math.max(MIN_DURATION_SEC, raw))
                      : DEFAULT_DURATION_SEC,
                  });
                }}
                className="w-full mt-1.5 px-3 py-2 rounded-xl border border-border bg-background text-sm focus:border-primary focus:outline-none"
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                Entre {MIN_DURATION_SEC} et {MAX_DURATION_SEC} s. Ce slide restera visible {form.duration_sec} s avant le suivant.
              </p>
            </div>
            <label className="inline-flex items-center gap-2 text-sm font-semibold sm:col-span-2">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                className="size-4 rounded border-border"
              />
              Slide actif (visible sur l’accueil)
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={save}
              className="px-5 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-semibold shadow-elegant"
            >
              Enregistrer
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="px-5 py-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-muted"
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
          Aucun slide. Ajoutez le premier visuel du carousel.
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={String(item.id)}
              draggable
              onDragStart={() => setDragId(String(item.id))}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDropReorder(String(item.id))}
              className={cn(
                'flex flex-wrap items-center gap-3 p-3 rounded-xl border border-border bg-surface-elevated hover:border-primary/40 transition-smooth',
                dragId === String(item.id) && 'opacity-60',
              )}
            >
              <GripVertical className="size-4 text-muted-foreground shrink-0 cursor-grab" />
              <div className="size-14 rounded-lg overflow-hidden bg-muted shrink-0">
                {item.image_url ? (
                  <img src={item.image_url} alt="" className="size-full object-cover" />
                ) : (
                  <div className="size-full flex items-center justify-center">
                    <ImageIcon className="size-5 text-muted-foreground/40" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold truncate">{item.title || 'Sans titre'}</p>
                <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 inline-flex items-center gap-1">
                  <Timer className="size-3" />
                  {msToSec(item.duration_ms)} s
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => toggleActive(item)}
                  className="size-9 rounded-lg border border-border flex items-center justify-center hover:bg-muted"
                  title={item.is_active ? 'Désactiver' : 'Activer'}
                >
                  {item.is_active ? <Eye className="size-4 text-emerald-500" /> : <EyeOff className="size-4 text-muted-foreground" />}
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

      <ImagePickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(media: SelectedMedia) => {
          setForm((f) => ({ ...f, image_url: media.url }));
          setPickerOpen(false);
        }}
        currentValue={form.image_url}
        defaultFolder="gallery"
        title="Image du slide hero"
      />
    </div>
  );
}
