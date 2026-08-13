import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useState, useEffect, useCallback } from 'react';
import { useMeQuery, useLogoutMutation } from '@/features/auth/hooks';
import { authStore } from '@/store/auth-store';
import { adminService } from '@/services/admin.service';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Image as ImageIcon,
  Users,
  Upload,
  MessageSquare,
  GraduationCap,
  LogOut,
  ShieldAlert,
  Plus,
  Trash2,
  CheckCircle,
  Pencil,
  Eye,
  EyeOff,
  RefreshCw,
} from 'lucide-react';

export const Route = createFileRoute('/admin')({ component: AdminPage });

type Tab =
  | 'overview'
  | 'programs'
  | 'posts'
  | 'gallery'
  | 'staff'
  | 'media'
  | 'admissions'
  | 'messages';

function AdminPage() {
  const navigate = useNavigate();
  const meQuery = useMeQuery();
  const logoutMutation = useLogoutMutation();

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});

  useEffect(() => {
    if (meQuery.isError) {
      toast.error('Veuillez vous connecter pour accéder à l’administration.');
      navigate({ to: '/contact' });
    }
  }, [meQuery.isError, navigate]);

  const loadTabData = useCallback(async (tab: Tab) => {
    if (tab === 'overview') return;
    setLoading(true);
    try {
      let res: any;
      switch (tab) {
        case 'posts':
          res = await adminService.getPosts();
          break;
        case 'programs':
          res = await adminService.getPrograms();
          break;
        case 'staff':
          res = await adminService.getStaff();
          break;
        case 'gallery':
          res = await adminService.getGalleryItems();
          break;
        case 'media':
          res = await adminService.getMedia();
          break;
        case 'messages':
          res = await adminService.getContactMessages();
          break;
        case 'admissions':
          res = await adminService.getAdmissionRequests();
          break;
        default:
          res = { data: [] };
      }
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err: any) {
      toast.error(err?.message ?? 'Impossible de charger les données.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (meQuery.data || authStore.getUser()) {
      loadTabData(activeTab);
      setEditing(null);
      setForm({});
    }
  }, [activeTab, meQuery.data, loadTabData]);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast.success('Déconnexion réussie');
      navigate({ to: '/' });
    } catch {
      authStore.clear();
      navigate({ to: '/' });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('folder', activeTab === 'staff' ? 'staff' : activeTab === 'posts' ? 'posts' : 'gallery');
    formData.append('file', file);

    setUploading(true);
    try {
      const res = await adminService.uploadMedia(formData);
      const url = (res.data as any)?.public_url || (res.data as any)?.url;
      toast.success('Fichier enregistré sur le serveur');
      if (url && editing !== null) {
        setForm((f) => ({
          ...f,
          ...(activeTab === 'staff'
            ? { avatar: url }
            : activeTab === 'posts'
              ? { cover_image: url }
              : activeTab === 'programs'
                ? { image: url }
                : { image_url: url }),
        }));
      }
      if (activeTab === 'media' || activeTab === 'gallery') {
        await loadTabData(activeTab);
      }
    } catch (err: any) {
      toast.error(err?.message ?? 'Échec de l’envoi du média.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const openCreate = () => {
    setEditing('new');
    if (activeTab === 'posts') {
      setForm({ title: '', summary: '', content: '', category: 'Actualités', cover_image: '' });
    } else if (activeTab === 'programs') {
      setForm({ title: '', summary: '', duration: '', students: '', image: '', price: '' });
    } else if (activeTab === 'staff') {
      setForm({ name: '', role: '', bio: '', avatar: '', department: '' });
    } else if (activeTab === 'gallery') {
      setForm({ title: '', image_url: '', category: 'Vie scolaire', description: '' });
    } else {
      setForm({});
    }
  };

  const openEdit = (item: any) => {
    setEditing(item);
    if (activeTab === 'posts') {
      setForm({
        title: item.title || '',
        summary: item.summary || '',
        content: item.content || '',
        category: item.category || '',
        cover_image: item.cover_image || '',
      });
    } else if (activeTab === 'programs') {
      setForm({
        title: item.title || '',
        summary: item.summary || '',
        duration: item.duration || '',
        students: item.students || '',
        image: item.image || '',
        price: String(item.price || ''),
      });
    } else if (activeTab === 'staff') {
      setForm({
        name: item.name || '',
        role: item.role || '',
        bio: item.bio || '',
        avatar: item.avatar || '',
        department: item.department || '',
      });
    } else if (activeTab === 'gallery') {
      setForm({
        title: item.title || '',
        image_url: item.image_url || '',
        category: item.category || '',
        description: item.description || '',
      });
    }
  };

  const saveForm = async () => {
    try {
      if (activeTab === 'posts') {
        if (editing === 'new') {
          await adminService.createPost({ ...form, is_published: true });
        } else {
          await adminService.updatePost(editing.id, form);
        }
      } else if (activeTab === 'programs') {
        if (editing === 'new') {
          await adminService.createProgram(form);
        } else {
          await adminService.updateProgram(editing.id, form);
        }
      } else if (activeTab === 'staff') {
        if (editing === 'new') {
          await adminService.createStaff(form);
        } else {
          await adminService.updateStaff(editing.id, form);
        }
      } else if (activeTab === 'gallery') {
        if (editing === 'new') {
          await adminService.createGalleryItem(form);
        } else {
          await adminService.updateGalleryItem(editing.id, form);
        }
      }
      toast.success('Enregistré');
      setEditing(null);
      await loadTabData(activeTab);
    } catch (err: any) {
      toast.error(err?.message ?? 'Échec de l’enregistrement');
    }
  };

  const removeItem = async (id: string | number) => {
    if (!confirm('Supprimer cet élément ?')) return;
    try {
      if (activeTab === 'posts') await adminService.deletePost(id);
      else if (activeTab === 'programs') await adminService.deleteProgram(id);
      else if (activeTab === 'staff') await adminService.deleteStaff(id);
      else if (activeTab === 'gallery') await adminService.deleteGalleryItem(id);
      else if (activeTab === 'media') await adminService.deleteMedia(id);
      toast.success('Supprimé');
      await loadTabData(activeTab);
    } catch (err: any) {
      toast.error(err?.message ?? 'Suppression impossible');
    }
  };

  const togglePublish = async (item: any) => {
    try {
      if (item.is_published) await adminService.unpublishPost(item.id);
      else await adminService.publishPost(item.id);
      await loadTabData('posts');
      toast.success(item.is_published ? 'Dépublié' : 'Publié');
    } catch (err: any) {
      toast.error(err?.message ?? 'Action impossible');
    }
  };

  const markMessage = async (id: string | number, status: string) => {
    try {
      if (activeTab === 'messages') await adminService.updateContactMessage(id, { status });
      else await adminService.updateAdmissionRequest(id, { status });
      await loadTabData(activeTab);
      toast.success('Statut mis à jour');
    } catch (err: any) {
      toast.error(err?.message ?? 'Mise à jour impossible');
    }
  };

  if (meQuery.isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <div className="size-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <p className="text-sm text-muted-foreground">Vérification de la session…</p>
      </div>
    );
  }

  const user = meQuery.data || authStore.getUser();

  if (!user && !meQuery.isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="size-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-4">
          <ShieldAlert className="size-8" />
        </div>
        <h1 className="text-2xl font-bold font-display">Accès Restreint</h1>
        <p className="text-muted-foreground mt-2 max-w-md">
          Connectez-vous via le formulaire Contact (email admin + mot de passe dans Message) ou via /login.
        </p>
        <Link
          to="/contact"
          className="mt-6 px-6 py-2.5 bg-gradient-primary text-primary-foreground font-semibold rounded-xl shadow-elegant"
        >
          Aller au formulaire Contact
        </Link>
      </div>
    );
  }

  const canCreate = ['posts', 'programs', 'staff', 'gallery'].includes(activeTab);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="border-b border-border bg-surface px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-primary p-2 rounded-lg">
            <GraduationCap className="size-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg leading-tight">Administration Wasomi</h1>
            <p className="text-xs text-muted-foreground">
              {user?.name} · {user?.email}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass text-destructive hover:bg-destructive/10 text-sm font-semibold"
        >
          <LogOut className="size-4" />
          Déconnexion
        </button>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="space-y-1 bg-card p-3 rounded-2xl border border-border shadow-sm h-fit">
            {(
              [
                { id: 'overview', label: 'Vue d’ensemble', icon: LayoutDashboard },
                { id: 'programs', label: 'Formations', icon: BookOpen },
                { id: 'posts', label: 'Articles Blog', icon: FileText },
                { id: 'gallery', label: 'Galerie', icon: ImageIcon },
                { id: 'staff', label: 'Équipe', icon: Users },
                { id: 'media', label: 'Médias', icon: Upload },
                { id: 'admissions', label: 'Préinscriptions', icon: GraduationCap },
                { id: 'messages', label: 'Messages', icon: MessageSquare },
              ] as const
            ).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-left transition-smooth ${
                    isActive
                      ? 'bg-gradient-primary text-primary-foreground shadow-elegant'
                      : 'text-muted-foreground hover:bg-surface-elevated hover:text-foreground'
                  }`}
                >
                  <Icon className="size-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-3 bg-card p-6 md:p-8 rounded-2xl border border-border shadow-elegant space-y-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold font-display">Bienvenue, {user?.name}</h2>
                <p className="text-muted-foreground text-sm">
                  Gérez formations, blog, équipe, galerie, médias, messages et préinscriptions. Les images
                  uploadées sont stockées dans l’application (`server/uploads`).
                </p>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-xl bg-surface-elevated border border-border">
                    <p className="text-xs uppercase text-muted-foreground font-semibold">Session</p>
                    <p className="text-lg font-bold text-emerald-500 mt-1 flex items-center gap-1.5">
                      <CheckCircle className="size-4" /> Active
                    </p>
                  </div>
                  <div className="p-5 rounded-xl bg-surface-elevated border border-border">
                    <p className="text-xs uppercase text-muted-foreground font-semibold">Rôles</p>
                    <p className="text-lg font-bold mt-1">
                      {user?.roles?.map((r) => r.name).join(', ') || 'Administrateur'}
                    </p>
                  </div>
                  <div className="p-5 rounded-xl bg-surface-elevated border border-border">
                    <p className="text-xs uppercase text-muted-foreground font-semibold">Astuce</p>
                    <p className="text-sm mt-1 text-muted-foreground">
                      Connexion discrète via Contact : email + mot de passe dans Message.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab !== 'overview' && (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-xl font-bold font-display capitalize">
                    {activeTab === 'posts'
                      ? 'Articles'
                      : activeTab === 'programs'
                        ? 'Formations'
                        : activeTab === 'staff'
                          ? 'Équipe'
                          : activeTab === 'gallery'
                            ? 'Galerie'
                            : activeTab === 'media'
                              ? 'Médias'
                              : activeTab === 'messages'
                                ? 'Messages contact'
                                : 'Préinscriptions'}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => loadTabData(activeTab)}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-border text-sm font-semibold"
                    >
                      <RefreshCw className="size-4" />
                      Actualiser
                    </button>
                    {(activeTab === 'media' || canCreate) && (
                      <label className="inline-flex items-center gap-2 px-4 py-2 bg-surface-elevated border border-border rounded-xl text-sm font-semibold cursor-pointer">
                        <Upload className="size-4" />
                        {uploading ? 'Envoi…' : 'Uploader image'}
                        <input type="file" onChange={handleFileUpload} className="hidden" accept="image/*,pdf" />
                      </label>
                    )}
                    {canCreate && (
                      <button
                        onClick={openCreate}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-primary text-primary-foreground rounded-xl text-sm font-semibold shadow-elegant"
                      >
                        <Plus className="size-4" />
                        Ajouter
                      </button>
                    )}
                  </div>
                </div>

                {editing && canCreate && (
                  <div className="p-4 rounded-xl border border-border bg-surface-elevated space-y-3">
                    <h3 className="font-semibold">{editing === 'new' ? 'Nouvel élément' : 'Modifier'}</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {Object.keys(form).map((key) => (
                        <div key={key} className={key === 'content' || key === 'bio' || key === 'summary' || key === 'description' ? 'sm:col-span-2' : ''}>
                          <label className="text-xs font-semibold uppercase text-muted-foreground">{key}</label>
                          {key === 'content' || key === 'bio' || key === 'summary' || key === 'description' ? (
                            <textarea
                              rows={4}
                              value={form[key]}
                              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                              className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm"
                            />
                          ) : (
                            <input
                              value={form[key]}
                              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                              className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={saveForm}
                        className="px-4 py-2 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-semibold"
                      >
                        Enregistrer
                      </button>
                      <button
                        onClick={() => setEditing(null)}
                        className="px-4 py-2 rounded-xl border border-border text-sm font-semibold"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                )}

                {loading ? (
                  <p className="text-sm text-muted-foreground">Chargement…</p>
                ) : items.length === 0 ? (
                  <div className="p-8 border border-dashed border-border rounded-2xl text-center text-sm text-muted-foreground">
                    Aucun élément pour le moment.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-wrap items-start justify-between gap-3 p-4 rounded-xl border border-border bg-surface-elevated"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold truncate">
                            {item.title || item.name || item.original_filename || item.email || item.id}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {item.summary ||
                              item.role ||
                              item.category ||
                              item.message ||
                              item.public_url ||
                              item.status ||
                              ''}
                          </p>
                          {(item.image_url || item.avatar || item.image || item.cover_image || item.public_url) && (
                            <img
                              src={item.image_url || item.avatar || item.image || item.cover_image || item.public_url}
                              alt=""
                              className="mt-2 h-16 w-24 object-cover rounded-lg border border-border"
                            />
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {activeTab === 'posts' && (
                            <button
                              onClick={() => togglePublish(item)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold"
                            >
                              {item.is_published ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                              {item.is_published ? 'Dépublier' : 'Publier'}
                            </button>
                          )}
                          {canCreate && (
                            <button
                              onClick={() => openEdit(item)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold"
                            >
                              <Pencil className="size-3.5" />
                              Éditer
                            </button>
                          )}
                          {(activeTab === 'messages' || activeTab === 'admissions') && (
                            <button
                              onClick={() => markMessage(item.id, 'handled')}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold"
                            >
                              Traité
                            </button>
                          )}
                          {(canCreate || activeTab === 'media') && (
                            <button
                              onClick={() => removeItem(item.id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-destructive/30 text-destructive text-xs font-semibold"
                            >
                              <Trash2 className="size-3.5" />
                              Supprimer
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
