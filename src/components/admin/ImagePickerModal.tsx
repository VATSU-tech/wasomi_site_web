import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Search,
  Check,
  RefreshCw,
  Edit2,
  Trash2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { adminService } from '@/services/admin.service';
import { MediaItem } from '@/types/domain';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export interface SelectedMedia {
  url: string;
  id?: string;
  title?: string;
  alt_text?: string;
}

interface ImagePickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (media: SelectedMedia) => void;
  currentValue?: string;
  defaultFolder?: 'blog' | 'programs' | 'staff' | 'gallery' | 'misc';
  title?: string;
}

const CATEGORIES = [
  { id: 'all', label: 'Toutes les images' },
  { id: 'blog', label: 'Blog' },
  { id: 'programs', label: 'Formations' },
  { id: 'staff', label: 'Équipe' },
  { id: 'gallery', label: 'Galerie' },
  { id: 'general', label: 'Général & Site' },
];

export function ImagePickerModal({
  open,
  onClose,
  onSelect,
  currentValue,
  defaultFolder = 'misc',
  title = "Sélectionner ou téléverser une image",
}: ImagePickerModalProps) {
  const [tab, setTab] = useState<'library' | 'upload'>('library');
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  // Upload State
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadAlt, setUploadAlt] = useState('');
  const [uploadFolder, setUploadFolder] = useState<string>(defaultFolder);
  const [uploading, setUploading] = useState(false);

  // Edit metadata State
  const [editingMetadata, setEditingMetadata] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editAlt, setEditAlt] = useState('');
  const [savingMetadata, setSavingMetadata] = useState(false);

  const loadMedia = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.getMedia({
        category: activeCategory !== 'all' ? activeCategory : undefined,
        q: search ? search : undefined,
      });
      const items = (res.data as MediaItem[]) || [];
      setMediaList(items);

      // Pre-select current value if present in list
      if (currentValue) {
        const found = items.find((m) => m.public_url === currentValue || m.url === currentValue);
        if (found) setSelectedItem(found);
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      toast.error(errorObj?.message || 'Erreur lors du chargement des médias');
    } finally {
      setLoading(false);
    }
  }, [activeCategory, search, currentValue]);

  useEffect(() => {
    if (open) {
      loadMedia();
    }
  }, [open, loadMedia]);

  // Handle local file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadFile(file);
    const objectUrl = URL.createObjectURL(file);
    setUploadPreview(objectUrl);
    setUploadTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
    setUploadAlt(file.name.replace(/\.[^/.]+$/, ''));
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      toast.error('Veuillez sélectionner un fichier');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('folder', uploadFolder);
      formData.append('title', uploadTitle.trim());
      formData.append('alt_text', uploadAlt.trim());
      formData.append('category', uploadFolder);

      const res = await adminService.uploadMedia(formData, uploadFolder);
      const newMedia = res.data as MediaItem;

      toast.success('Image téléversée avec succès');

      // Auto select and callback
      onSelect({
        url: newMedia.public_url || newMedia.url || '',
        id: newMedia.id,
        title: newMedia.title || uploadTitle,
        alt_text: newMedia.alt_text || uploadAlt,
      });

      // Reset
      setUploadFile(null);
      setUploadPreview(null);
      onClose();
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      toast.error(errorObj?.message || "Échec de l'envoi de l'image");
    } finally {
      setUploading(false);
    }
  };

  const handleSelectCurrent = () => {
    if (!selectedItem) {
      toast.error('Veuillez sélectionner une image');
      return;
    }
    onSelect({
      url: selectedItem.public_url || selectedItem.url || '',
      id: selectedItem.id,
      title: selectedItem.title,
      alt_text: selectedItem.alt_text,
    });
    onClose();
  };

  const handleSaveMetadata = async () => {
    if (!selectedItem) return;
    setSavingMetadata(true);
    try {
      const res = await adminService.updateMedia(selectedItem.id, {
        title: editTitle.trim(),
        alt_text: editAlt.trim(),
      });
      const updated = res.data as MediaItem;
      setSelectedItem(updated);
      setMediaList((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
      setEditingMetadata(false);
      toast.success('Métadonnées enregistrées');
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      toast.error(errorObj?.message || "Échec de l'enregistrement des métadonnées");
    } finally {
      setSavingMetadata(false);
    }
  };

  const handleDeleteMedia = async (media: MediaItem) => {
    if (!confirm(`Supprimer définitivement l'image "${media.title || media.original_filename}" ?`)) {
      return;
    }
    try {
      await adminService.deleteMedia(media.id);
      toast.success('Image supprimée');
      if (selectedItem?.id === media.id) setSelectedItem(null);
      await loadMedia();
    } catch (err: unknown) {
      const errorObj = err as { message?: string; status?: number };
      toast.error(errorObj?.message || 'Impossible de supprimer cette image');
    }
  };

  const filteredItems = useMemo(() => {
    return mediaList.filter((item) => {
      const matchesCat =
        activeCategory === 'all' ||
        item.category === activeCategory ||
        item.folder === activeCategory;
      const matchesSearch =
        !search ||
        (item.title && item.title.toLowerCase().includes(search.toLowerCase())) ||
        (item.original_filename && item.original_filename.toLowerCase().includes(search.toLowerCase())) ||
        (item.alt_text && item.alt_text.toLowerCase().includes(search.toLowerCase()));
      return matchesCat && matchesSearch;
    });
  }, [mediaList, activeCategory, search]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-5xl h-[88vh] rounded-2xl border border-border shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-surface shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-gradient-primary text-primary-foreground flex items-center justify-center font-bold">
              <ImageIcon className="size-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg leading-tight text-foreground">
                {title}
              </h3>
              <p className="text-xs text-muted-foreground">
                Gestionnaire de médias Wasomi • Banque d'images locale
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-xl bg-muted p-1 border border-border">
              <button
                type="button"
                onClick={() => setTab('library')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold transition-smooth',
                  tab === 'library'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                Bibliothèque
              </button>
              <button
                type="button"
                onClick={() => setTab('upload')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-smooth',
                  tab === 'upload'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Upload className="size-3.5" />
                Téléverser
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer"
              className="size-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted ml-2"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 flex overflow-hidden">
          {tab === 'library' ? (
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* Left Column: Grid + Filter */}
              <div className="flex-1 flex flex-col p-4 sm:p-6 overflow-hidden border-r border-border">
                {/* Search & Category Pills */}
                <div className="space-y-3 mb-4 shrink-0">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Rechercher par titre ou nom de fichier..."
                        className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface border border-border text-xs focus:border-primary focus:outline-none transition-smooth"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={loadMedia}
                      disabled={loading}
                      title="Actualiser la liste"
                      aria-label="Actualiser la liste"
                      className="size-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted"
                    >
                      <RefreshCw className={cn('size-4', loading && 'animate-spin')} />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setActiveCategory(cat.id)}
                        className={cn(
                          'px-2.5 py-1 rounded-lg text-xs font-medium transition-smooth',
                          activeCategory === cat.id
                            ? 'bg-primary text-primary-foreground font-semibold'
                            : 'bg-muted text-muted-foreground hover:text-foreground',
                        )}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto pr-1">
                  {loading ? (
                    <div className="h-64 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <RefreshCw className="size-6 animate-spin text-primary" />
                      <p className="text-xs">Chargement de la bibliothèque...</p>
                    </div>
                  ) : filteredItems.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center gap-3 text-center border-2 border-dashed border-border rounded-2xl p-6">
                      <ImageIcon className="size-10 text-muted-foreground/50" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">Aucune image trouvée</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Changez de catégorie ou téléversez votre première image.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setTab('upload')}
                        className="px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold"
                      >
                        Téléverser maintenant
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {filteredItems.map((item) => {
                        const isSelected = selectedItem?.id === item.id;
                        const isCurrent = currentValue === item.public_url;
                        return (
                          <div
                            key={item.id}
                            onClick={() => {
                              setSelectedItem(item);
                              setEditTitle(item.title || item.original_filename);
                              setEditAlt(item.alt_text || '');
                              setEditingMetadata(false);
                            }}
                            className={cn(
                              'group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer border-2 transition-all bg-surface',
                              isSelected
                                ? 'border-primary ring-2 ring-primary/30 shadow-md'
                                : isCurrent
                                  ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                                  : 'border-border/80 hover:border-foreground/40',
                            )}
                          >
                            <img
                              src={item.public_url || item.url}
                              alt={item.alt_text || item.title || item.original_filename}
                              loading="lazy"
                              className="size-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {isSelected && (
                              <div className="absolute top-1.5 right-1.5 size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md">
                                <Check className="size-3.5" />
                              </div>
                            )}
                            {isCurrent && !isSelected && (
                              <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold shadow-md">
                                Actuelle
                              </div>
                            )}
                            <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
                              <p className="text-[11px] font-semibold truncate leading-tight">
                                {item.title || item.original_filename}
                              </p>
                              <p className="text-[9px] text-white/70 truncate">
                                {item.category || item.folder}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Selected Detail & Actions */}
              <div className="w-full md:w-80 p-5 bg-surface/50 flex flex-col justify-between overflow-y-auto shrink-0 border-t md:border-t-0">
                {selectedItem ? (
                  <div className="space-y-4">
                    <div className="aspect-[4/3] rounded-xl overflow-hidden border border-border bg-black/10 relative shadow-sm">
                      <img
                        src={selectedItem.public_url || selectedItem.url}
                        alt={selectedItem.alt_text || selectedItem.title}
                        className="size-full object-cover"
                      />
                      <a
                        href={selectedItem.public_url || selectedItem.url}
                        target="_blank"
                        rel="noreferrer"
                        className="absolute bottom-2 right-2 size-7 rounded-lg bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-smooth"
                        title="Ouvrir l'image en grand"
                      >
                        <ExternalLink className="size-3.5" />
                      </a>
                    </div>

                    {!editingMetadata ? (
                      <div className="space-y-2.5 text-xs">
                        <div>
                          <span className="text-muted-foreground font-semibold block text-[10px] uppercase">
                            Titre
                          </span>
                          <p className="font-semibold text-foreground mt-0.5 break-words">
                            {selectedItem.title || selectedItem.original_filename}
                          </p>
                        </div>

                        <div>
                          <span className="text-muted-foreground font-semibold block text-[10px] uppercase">
                            Texte alternatif (Alt)
                          </span>
                          <p className="text-muted-foreground mt-0.5 italic break-words">
                            {selectedItem.alt_text || 'Non renseigné'}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/60">
                          <div>
                            <span className="text-muted-foreground font-semibold block text-[10px] uppercase">
                              Dossier / Catégorie
                            </span>
                            <span className="font-medium text-foreground">
                              {selectedItem.category || selectedItem.folder || 'misc'}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground font-semibold block text-[10px] uppercase">
                              Taille
                            </span>
                            <span className="font-medium text-foreground">
                              {(selectedItem.size_bytes / 1024).toFixed(0)} Ko
                            </span>
                          </div>
                        </div>

                        <div className="pt-2 flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditTitle(selectedItem.title || selectedItem.original_filename);
                              setEditAlt(selectedItem.alt_text || '');
                              setEditingMetadata(true);
                            }}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-foreground hover:bg-muted text-xs font-semibold transition-smooth"
                          >
                            <Edit2 className="size-3.5" />
                            Éditer métadonnées
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteMedia(selectedItem)}
                            className="size-8 rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10 flex items-center justify-center transition-smooth"
                            title="Supprimer l'image"
                            aria-label="Supprimer l'image"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 p-3 rounded-xl bg-card border border-border text-xs">
                        <p className="font-bold text-foreground">Modifier les métadonnées</p>
                        <div>
                          <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                            Titre de l'image
                          </label>
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-border focus:border-primary focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                            Texte alternatif (SEO & Accessibilité)
                          </label>
                          <input
                            type="text"
                            value={editAlt}
                            onChange={(e) => setEditAlt(e.target.value)}
                            placeholder="Description de l'image"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-border focus:border-primary focus:outline-none"
                          />
                        </div>
                        <div className="flex gap-2 pt-1">
                          <button
                            type="button"
                            onClick={handleSaveMetadata}
                            disabled={savingMetadata}
                            className="flex-1 py-1.5 rounded-lg bg-primary text-primary-foreground font-semibold"
                          >
                            {savingMetadata ? 'Enregistrement…' : 'Enregistrer'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingMetadata(false)}
                            className="px-2.5 py-1.5 rounded-lg border border-border text-muted-foreground"
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center text-center text-muted-foreground gap-2">
                    <ImageIcon className="size-8 opacity-40" />
                    <p className="text-xs">
                      Cliquez sur une image dans la galerie pour voir ses détails ou la sélectionner.
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-border mt-auto">
                  <button
                    type="button"
                    disabled={!selectedItem}
                    onClick={handleSelectCurrent}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-primary text-primary-foreground font-bold shadow-elegant hover:shadow-glow transition-spring disabled:opacity-40 text-xs flex items-center justify-center gap-2"
                  >
                    <Check className="size-4" />
                    Valider cette image
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Tab 2: Upload */
            <div className="flex-1 p-6 overflow-y-auto max-w-2xl mx-auto w-full flex flex-col justify-center">
              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-2xl p-6 text-center bg-surface hover:bg-surface-elevated transition-smooth relative cursor-pointer">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {uploadPreview ? (
                    <div className="space-y-3">
                      <div className="size-36 mx-auto rounded-xl overflow-hidden border border-border shadow-md">
                        <img src={uploadPreview} alt="Aperçu" className="size-full object-cover" />
                      </div>
                      <p className="text-xs text-primary font-semibold">
                        Cliquez ou glissez pour changer de fichier ({uploadFile?.name})
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 py-6">
                      <div className="size-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
                        <Upload className="size-6" />
                      </div>
                      <p className="text-sm font-semibold text-foreground">
                        Glissez une image ici ou cliquez pour parcourir
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Formats supportés : JPEG, PNG, WebP, AVIF (Max 12 Mo)
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-foreground">
                      Titre de l'image
                    </label>
                    <input
                      type="text"
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      placeholder="Ex: Élèves en laboratoire"
                      className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-xs focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-foreground">
                      Dossier / Catégorie
                    </label>
                    <select
                      value={uploadFolder}
                      onChange={(e) => setUploadFolder(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-xs focus:border-primary focus:outline-none"
                    >
                      <option value="blog">Blog (Actualités)</option>
                      <option value="programs">Formations (Programmes)</option>
                      <option value="staff">Équipe (Personnel)</option>
                      <option value="gallery">Galerie scolaire</option>
                      <option value="misc">Général & Divers</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-foreground">
                    Texte alternatif (SEO & Accessibilité)
                  </label>
                  <input
                    type="text"
                    value={uploadAlt}
                    onChange={(e) => setUploadAlt(e.target.value)}
                    placeholder="Description concise pour les lecteurs d'écran"
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-xs focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setTab('library')}
                    className="px-4 py-2.5 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-foreground"
                  >
                    Retour à la bibliothèque
                  </button>
                  <button
                    type="submit"
                    disabled={!uploadFile || uploading}
                    className="px-6 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground text-xs font-bold shadow-elegant hover:shadow-glow disabled:opacity-50 flex items-center gap-2"
                  >
                    {uploading ? (
                      <>
                        <RefreshCw className="size-3.5 animate-spin" />
                        Téléversement…
                      </>
                    ) : (
                      <>
                        <Upload className="size-3.5" />
                        Téléverser et sélectionner
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
