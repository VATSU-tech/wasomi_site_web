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
  X,
  Phone,
  Mail,
  MessageCircle,
  Calendar,
  MapPin,
  UserCheck,
  Clock,
  Send,
  HelpCircle,
  Sparkles,
  Info,
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

interface Stats {
  unread_messages: number;
  total_messages: number;
  pending_admissions: number;
  total_admissions: number;
  total_posts: number;
  total_programs: number;
  total_staff: number;
  recent_unopened_messages?: any[];
  recent_unopened_admissions?: any[];
}

export function AdminPage() {
  const navigate = useNavigate();
  const meQuery = useMeQuery();
  const logoutMutation = useLogoutMutation();

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  
  // Overview stats & Detail modal
  const [stats, setStats] = useState<Stats | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<{
    type: 'message' | 'admission';
    data: any;
  } | null>(null);
  const [detailNotes, setDetailNotes] = useState('');
  const [detailStatus, setDetailStatus] = useState('');

  useEffect(() => {
    if (meQuery.isError) {
      toast.error('Veuillez vous connecter pour accéder à l’administration.');
      navigate({ to: '/contact' });
    }
  }, [meQuery.isError, navigate]);

  const loadStats = useCallback(async () => {
    try {
      const res = await adminService.getOverviewStats();
      if (res.data) {
        setStats(res.data);
      }
    } catch {
      // stats optional
    }
  }, []);

  const loadTabData = useCallback(async (tab: Tab) => {
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
        case 'overview':
          await loadStats();
          break;
        default:
          res = { data: [] };
      }
      if (tab !== 'overview') {
        setItems(Array.isArray(res?.data) ? res.data : []);
      }
    } catch (err: any) {
      toast.error(err?.message ?? 'Impossible de charger les données.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [loadStats]);

  useEffect(() => {
    if (meQuery.data || authStore.getUser()) {
      loadTabData(activeTab);
      loadStats();
      setEditing(null);
      setForm({});
    }
  }, [activeTab, meQuery.data, loadTabData, loadStats]);

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
      await loadStats();
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
      await loadStats();
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

  const openDetailModal = async (item: any, type: 'message' | 'admission') => {
    setSelectedDetail({ type, data: item });
    setDetailNotes(item.admin_notes || '');
    setDetailStatus(item.status === 'new' ? 'read' : (item.status || 'read'));

    // Automatically mark as opened / read if status was 'new'
    if (item.status === 'new') {
      try {
        if (type === 'message') {
          await adminService.updateContactMessage(item.id, { status: 'read' });
        } else {
          await adminService.updateAdmissionRequest(item.id, { status: 'read' });
        }
        item.status = 'read';
        await loadStats();
        if (activeTab !== 'overview') {
          await loadTabData(activeTab);
        }
      } catch {
        // ignore best-effort mark as read
      }
    }
  };

  const saveDetailUpdate = async () => {
    if (!selectedDetail) return;
    try {
      if (selectedDetail.type === 'message') {
        await adminService.updateContactMessage(selectedDetail.data.id, {
          status: detailStatus,
          admin_notes: detailNotes,
        });
      } else {
        await adminService.updateAdmissionRequest(selectedDetail.data.id, {
          status: detailStatus,
          admin_notes: detailNotes,
        });
      }
      toast.success('Dossier mis à jour avec succès');
      setSelectedDetail(null);
      await loadTabData(activeTab);
      await loadStats();
    } catch (err: any) {
      toast.error(err?.message ?? 'Mise à jour échouée');
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

  // Status helper badges
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold border border-amber-500/20">Non Ouvert / Nouveau</span>;
      case 'read':
      case 'opened':
        return <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-semibold border border-blue-500/20">Ouvert / Lu</span>;
      case 'in_progress':
        return <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-500 text-xs font-semibold border border-purple-500/20">En cours</span>;
      case 'accepted':
      case 'handled':
        return <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-semibold border border-emerald-500/20">Traité / Accepté</span>;
      case 'rejected':
        return <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-500 text-xs font-semibold border border-rose-500/20">Rejeté</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-muted text-muted-foreground text-xs font-semibold">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Top Bar */}
      <div className="border-b border-border bg-surface px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-primary p-2.5 rounded-xl shadow-glow">
            <GraduationCap className="size-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl leading-tight">Administration Wasomi</h1>
            <p className="text-xs text-muted-foreground">
              Connecté en tant que <span className="font-semibold text-foreground">{user?.name}</span> ({user?.email})
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass text-destructive hover:bg-destructive/10 text-sm font-semibold transition-smooth"
        >
          <LogOut className="size-4" />
          Déconnexion
        </button>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="space-y-1 bg-card p-3 rounded-2xl border border-border shadow-sm h-fit">
            {(
              [
                { id: 'overview' as const, label: 'Dashboard', icon: LayoutDashboard, badge: undefined },
                { id: 'admissions' as const, label: 'Préinscriptions', icon: GraduationCap, badge: stats?.pending_admissions },
                { id: 'messages' as const, label: 'Messages', icon: MessageSquare, badge: stats?.unread_messages },
                { id: 'programs' as const, label: 'Formations', icon: BookOpen, badge: undefined },
                { id: 'posts' as const, label: 'Articles Blog', icon: FileText, badge: undefined },
                { id: 'gallery' as const, label: 'Galerie', icon: ImageIcon, badge: undefined },
                { id: 'staff' as const, label: 'Équipe', icon: Users, badge: undefined },
                { id: 'media' as const, label: 'Médias', icon: Upload, badge: undefined },
              ]
            ).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-left transition-smooth ${
                    isActive
                      ? 'bg-gradient-primary text-primary-foreground shadow-elegant'
                      : 'text-muted-foreground hover:bg-surface-elevated hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="size-4" />
                    <span>{item.label}</span>
                  </div>
                  {Boolean(item.badge && item.badge > 0) && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-primary/20 text-primary'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 bg-card p-6 md:p-8 rounded-2xl border border-border shadow-elegant space-y-6">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold font-display">Bienvenue, {user?.name}</h2>
                    <p className="text-muted-foreground text-sm mt-1">
                      Tableau de bord de gestion des préinscriptions, messages, formations et contenu Wasomi.
                    </p>
                  </div>
                  <button
                    onClick={() => { loadStats(); loadTabData('overview'); }}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-surface-elevated"
                  >
                    <RefreshCw className="size-3.5" />
                    Actualiser les données
                  </button>
                </div>

                {/* Highlighted Alerts (Messages & Admissions non Lus) */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div
                    onClick={() => setActiveTab('admissions')}
                    className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-primary/20 hover:border-primary cursor-pointer transition-spring group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="size-12 rounded-xl bg-gradient-primary text-primary-foreground flex items-center justify-center shadow-glow">
                        <GraduationCap className="size-6" />
                      </div>
                      {stats && stats.pending_admissions > 0 ? (
                        <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-500 font-bold text-xs animate-pulse">
                          {stats.pending_admissions} non ouverte{stats.pending_admissions > 1 ? 's' : ''} !
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-semibold">
                          Toutes ouvertes
                        </span>
                      )}
                    </div>
                    <div className="mt-4">
                      <p className="text-3xl font-bold font-display tracking-tight">
                        {stats?.pending_admissions ?? 0} <span className="text-sm font-normal text-muted-foreground">/ {stats?.total_admissions ?? 0}</span>
                      </p>
                      <h3 className="font-semibold text-foreground mt-1 group-hover:text-primary transition-smooth">
                        Préinscriptions non ouvertes
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Consultez et recontactez les futurs élèves avec leurs coordonnées complètes.
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => setActiveTab('messages')}
                    className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent border border-blue-500/20 hover:border-blue-500 cursor-pointer transition-spring group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="size-12 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-lg">
                        <MessageSquare className="size-6" />
                      </div>
                      {stats && stats.unread_messages > 0 ? (
                        <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-500 font-bold text-xs animate-pulse">
                          {stats.unread_messages} non lu{stats.unread_messages > 1 ? 's' : ''} !
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-semibold">
                          Tous lus
                        </span>
                      )}
                    </div>
                    <div className="mt-4">
                      <p className="text-3xl font-bold font-display tracking-tight">
                        {stats?.unread_messages ?? 0} <span className="text-sm font-normal text-muted-foreground">/ {stats?.total_messages ?? 0}</span>
                      </p>
                      <h3 className="font-semibold text-foreground mt-1 group-hover:text-primary transition-smooth">
                        Messages de contact non ouverts
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Questions d'utilisateurs et demandes de renseignement reçues.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Unopened Items Direct Overview Lists */}
                {((stats?.recent_unopened_admissions && stats.recent_unopened_admissions.length > 0) ||
                  (stats?.recent_unopened_messages && stats.recent_unopened_messages.length > 0)) && (
                  <div className="space-y-4 pt-2">
                    <h3 className="text-lg font-bold font-display flex items-center gap-2">
                      <Clock className="size-5 text-amber-500" />
                      Derniers éléments reçus non encore ouverts
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Unopened Admissions */}
                      <div className="space-y-3 p-4 rounded-2xl bg-surface border border-border">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm flex items-center gap-2">
                            <GraduationCap className="size-4 text-primary" />
                            Préinscriptions ({stats?.recent_unopened_admissions?.length || 0})
                          </h4>
                          <button
                            onClick={() => setActiveTab('admissions')}
                            className="text-xs text-primary font-semibold hover:underline"
                          >
                            Voir tout →
                          </button>
                        </div>

                        {!stats?.recent_unopened_admissions || stats.recent_unopened_admissions.length === 0 ? (
                          <p className="text-xs text-muted-foreground py-4 text-center">Aucune préinscription en attente</p>
                        ) : (
                          stats.recent_unopened_admissions.map((adm: any) => (
                            <div key={adm.id} className="p-3 rounded-xl bg-background border border-border hover:border-primary/50 transition-smooth flex items-center justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <p className="font-semibold text-sm truncate">{adm.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{adm.phone} • {adm.preferred_schedule || 'Présentiel'}</p>
                              </div>
                              <button
                                onClick={() => openDetailModal(adm, 'admission')}
                                className="shrink-0 px-3 py-1.5 rounded-lg bg-gradient-primary text-primary-foreground text-xs font-semibold shadow-sm hover:shadow-glow transition-smooth"
                              >
                                Ouvrir
                              </button>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Unopened Messages */}
                      <div className="space-y-3 p-4 rounded-2xl bg-surface border border-border">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm flex items-center gap-2">
                            <MessageSquare className="size-4 text-blue-500" />
                            Messages de contact ({stats?.recent_unopened_messages?.length || 0})
                          </h4>
                          <button
                            onClick={() => setActiveTab('messages')}
                            className="text-xs text-primary font-semibold hover:underline"
                          >
                            Voir tout →
                          </button>
                        </div>

                        {!stats?.recent_unopened_messages || stats.recent_unopened_messages.length === 0 ? (
                          <p className="text-xs text-muted-foreground py-4 text-center">Aucun message non lu</p>
                        ) : (
                          stats.recent_unopened_messages.map((msg: any) => (
                            <div key={msg.id} className="p-3 rounded-xl bg-background border border-border hover:border-blue-500/50 transition-smooth flex items-center justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <p className="font-semibold text-sm truncate">{msg.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{msg.subject || msg.email}</p>
                              </div>
                              <button
                                onClick={() => openDetailModal(msg, 'message')}
                                className="shrink-0 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold shadow-sm hover:bg-blue-700 transition-smooth"
                              >
                                Ouvrir
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Secondary Counters */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-surface-elevated border border-border">
                    <p className="text-xs uppercase text-muted-foreground font-semibold">Formations</p>
                    <p className="text-2xl font-bold mt-1 font-display">{stats?.total_programs ?? 0}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-elevated border border-border">
                    <p className="text-xs uppercase text-muted-foreground font-semibold">Articles publiés</p>
                    <p className="text-2xl font-bold mt-1 font-display">{stats?.total_posts ?? 0}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-elevated border border-border col-span-2 sm:col-span-1">
                    <p className="text-xs uppercase text-muted-foreground font-semibold">Membres d’équipe</p>
                    <p className="text-2xl font-bold mt-1 font-display">{stats?.total_staff ?? 0}</p>
                  </div>
                </div>

                {/* Info Card */}
                <div className="p-5 rounded-2xl bg-surface border border-border space-y-2 text-sm">
                  <div className="flex items-center gap-2 font-semibold text-primary">
                    <Sparkles className="size-4" />
                    <span>Prise de contact rapide avec les étudiants</span>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Dans les onglets <strong>Préinscriptions</strong> et <strong>Messages</strong>, cliquez sur un élément pour afficher sa fiche complète (date de naissance, diplôme, tuteur, horaire) et le contacter directement par <strong>Email, Appel ou WhatsApp</strong> en 1 clic.
                  </p>
                </div>
              </div>
            )}

            {/* OTHER TABS */}
            {activeTab !== 'overview' && (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-xl font-bold font-display capitalize">
                    {activeTab === 'posts'
                      ? 'Articles Blog'
                      : activeTab === 'programs'
                        ? 'Formations'
                        : activeTab === 'staff'
                          ? 'Équipe Enseignante'
                          : activeTab === 'gallery'
                            ? 'Galerie Média'
                            : activeTab === 'media'
                              ? 'Bibliothèque Médias'
                              : activeTab === 'messages'
                                ? 'Messages Reçus'
                                : 'Dossiers de Préinscription'}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => loadTabData(activeTab)}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-border text-sm font-semibold hover:bg-surface-elevated"
                    >
                      <RefreshCw className="size-4" />
                      Actualiser
                    </button>
                    {(activeTab === 'media' || canCreate) && (
                      <label className="inline-flex items-center gap-2 px-4 py-2 bg-surface-elevated border border-border rounded-xl text-sm font-semibold cursor-pointer hover:border-primary transition-smooth">
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

                {/* Form editor for CRUD items */}
                {editing && canCreate && (
                  <div className="p-6 rounded-2xl border border-border bg-surface-elevated space-y-4 shadow-sm animate-in fade-in duration-300">
                    <h3 className="font-display font-semibold text-lg">{editing === 'new' ? 'Nouveau Contenu' : 'Modifier le Contenu'}</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {Object.keys(form).map((key) => (
                        <div key={key} className={key === 'content' || key === 'bio' || key === 'summary' || key === 'description' ? 'sm:col-span-2' : ''}>
                          <label className="text-xs font-semibold uppercase text-muted-foreground">{key}</label>
                          {key === 'content' || key === 'bio' || key === 'summary' || key === 'description' ? (
                            <textarea
                              rows={4}
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
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={saveForm}
                        className="px-5 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-semibold shadow-elegant"
                      >
                        Enregistrer
                      </button>
                      <button
                        onClick={() => setEditing(null)}
                        className="px-5 py-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-muted"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                )}

                {/* Items List */}
                {loading ? (
                  <div className="py-12 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
                    <div className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    Chargement des éléments...
                  </div>
                ) : items.length === 0 ? (
                  <div className="p-12 border border-dashed border-border rounded-2xl text-center text-sm text-muted-foreground">
                    Aucun enregistrement trouvé.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="group flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-border bg-surface-elevated hover:border-primary/40 transition-smooth"
                      >
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold truncate text-foreground">
                              {item.name || item.title || item.original_filename || item.email || item.id}
                            </p>
                            {item.status && getStatusBadge(item.status)}
                          </div>
                          
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {item.email && <span className="font-medium text-foreground mr-2"><Mail className="size-4 inline-block mr-1" /> {item.email}</span>}
                            {item.phone && <span className="font-medium text-foreground mr-2"><Phone className="size-4 inline-block mr-1" /> {item.phone}</span>}
                            {item.preferred_schedule && <span className="text-primary font-medium mr-2">🕒 {item.preferred_schedule}</span>}
                            {item.summary || item.role || item.category || item.message || item.public_url || ''}
                          </p>

                          {item.created_at && (
                            <p className="text-[11px] text-muted-foreground">
                              Reçu le : {new Date(item.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          )}

                          {(item.image_url || item.avatar || item.image || item.cover_image || item.public_url) && (
                            <img
                              src={item.image_url || item.avatar || item.image || item.cover_image || item.public_url}
                              alt=""
                              className="mt-2 h-14 w-20 object-cover rounded-lg border border-border"
                            />
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2 shrink-0">
                          {/* Messages / Admissions detail drawer button */}
                          {(activeTab === 'messages' || activeTab === 'admissions') && (
                            <button
                              onClick={() => openDetailModal(item, activeTab === 'messages' ? 'message' : 'admission')}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-primary text-primary-foreground text-xs font-semibold shadow-sm hover:shadow-glow transition-smooth"
                            >
                              <Eye className="size-3.5" />
                              Consulter le dossier
                            </button>
                          )}

                          {activeTab === 'posts' && (
                            <button
                              onClick={() => togglePublish(item)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold hover:bg-muted"
                            >
                              {item.is_published ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                              {item.is_published ? 'Dépublier' : 'Publier'}
                            </button>
                          )}

                          {canCreate && (
                            <button
                              onClick={() => openEdit(item)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold hover:bg-muted"
                            >
                              <Pencil className="size-3.5" />
                              Éditer
                            </button>
                          )}

                          {(canCreate || activeTab === 'media') && (
                            <button
                              onClick={() => removeItem(item.id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-destructive/30 text-destructive text-xs font-semibold hover:bg-destructive/10"
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

      {/* DETAIL MODAL FOR MESSAGES & ADMISSIONS */}
      {selectedDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-2xl rounded-2xl border border-border shadow-2xl overflow-hidden my-8 space-y-0">
            {/* Modal Header */}
            <div className="bg-surface px-6 py-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-gradient-primary text-primary-foreground flex items-center justify-center font-bold">
                  {selectedDetail.type === 'admission' ? <GraduationCap className="size-5" /> : <MessageSquare className="size-5" />}
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg">
                    {selectedDetail.type === 'admission' ? 'Dossier de Préinscription' : 'Message de Contact'}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    ID : {selectedDetail.data.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDetail(null)}
                className="size-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Quick Action Contact Bar */}
              <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-2">
                <p className="text-xs font-bold uppercase text-primary tracking-wider">
                  Action Rapide — Contactation & Relance
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedDetail.data.email && (
                    <a
                      href={`mailto:${selectedDetail.data.email}?subject=Réponse Wasomi — ${selectedDetail.type === 'admission' ? 'Demande de Préinscription' : 'Message de Contact'}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary/10 text-primary text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-smooth"
                    >
                      <Mail className="size-3.5" />
                      Email ({selectedDetail.data.email})
                    </a>
                  )}

                  {selectedDetail.data.phone && (
                    <>
                      <a
                        href={`tel:${selectedDetail.data.phone}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/10 text-emerald-500 text-xs font-semibold hover:bg-emerald-500 hover:text-white transition-smooth"
                      >
                        <Phone className="size-3.5" />
                        Appeler ({selectedDetail.data.phone})
                      </a>

                      <a
                        href={`https://wa.me/${selectedDetail.data.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Bonjour ${selectedDetail.data.name}, nous faisons suite à votre ${
                            selectedDetail.type === 'admission' ? 'préinscription' : 'message'
                          } sur Wasomi.`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold shadow-sm hover:bg-emerald-700 transition-smooth"
                      >
                        <MessageCircle className="size-3.5" />
                        WhatsApp Direct
                      </a>
                    </>
                  )}

                  {selectedDetail.data.guardian_phone && (
                    <>
                      <a
                        href={`tel:${selectedDetail.data.guardian_phone}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-500/10 text-purple-500 text-xs font-semibold hover:bg-purple-500 hover:text-white transition-smooth"
                      >
                        <Phone className="size-3.5" />
                        Tuteur ({selectedDetail.data.guardian_phone})
                      </a>

                      <a
                        href={`https://wa.me/${selectedDetail.data.guardian_phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Bonjour ${selectedDetail.data.guardian_name || 'Tuteur'}, nous vous contactons concernant la préinscription de ${selectedDetail.data.name} à l'école Wasomi.`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold shadow-sm hover:bg-purple-700 transition-smooth"
                      >
                        <MessageCircle className="size-3.5" />
                        WhatsApp Tuteur
                      </a>
                    </>
                  )}

                  {selectedDetail.data.emergency_phone && (
                    <a
                      href={`tel:${selectedDetail.data.emergency_phone}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 text-rose-500 text-xs font-semibold hover:bg-rose-500 hover:text-white transition-smooth"
                    >
                      <Phone className="size-3.5" />
                      Urgence ({selectedDetail.data.emergency_phone})
                    </a>
                  )}
                </div>
              </div>

              {/* Data Fields Grid */}
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="p-3 rounded-xl bg-surface border border-border">
                  <span className="text-xs text-muted-foreground font-semibold uppercase block">Nom Complet</span>
                  <span className="font-semibold text-foreground mt-0.5 block">{selectedDetail.data.name}</span>
                </div>

                <div className="p-3 rounded-xl bg-surface border border-border">
                  <span className="text-xs text-muted-foreground font-semibold uppercase block">Email</span>
                  <span className="font-semibold text-foreground mt-0.5 block">{selectedDetail.data.email}</span>
                </div>

                <div className="p-3 rounded-xl bg-surface border border-border">
                  <span className="text-xs text-muted-foreground font-semibold uppercase block">Téléphone / WhatsApp</span>
                  <span className="font-semibold text-foreground mt-0.5 block">{selectedDetail.data.phone || 'Non renseigné'}</span>
                </div>

                {selectedDetail.data.birth_date && (
                  <div className="p-3 rounded-xl bg-surface border border-border">
                    <span className="text-xs text-muted-foreground font-semibold uppercase block">Date de Naissance</span>
                    <span className="font-semibold text-foreground mt-0.5 block">{selectedDetail.data.birth_date}</span>
                  </div>
                )}

                {selectedDetail.data.gender && (
                  <div className="p-3 rounded-xl bg-surface border border-border">
                    <span className="text-xs text-muted-foreground font-semibold uppercase block">Genre</span>
                    <span className="font-semibold text-foreground mt-0.5 block">{selectedDetail.data.gender}</span>
                  </div>
                )}

                {selectedDetail.data.previous_school && (
                  <div className="p-3 rounded-xl bg-surface border border-border">
                    <span className="text-xs text-muted-foreground font-semibold uppercase block">École / Établissement de provenance</span>
                    <span className="font-semibold text-primary mt-0.5 block">{selectedDetail.data.previous_school}</span>
                  </div>
                )}

                {selectedDetail.data.last_grade_result && (
                  <div className="p-3 rounded-xl bg-surface border border-border">
                    <span className="text-xs text-muted-foreground font-semibold uppercase block">Dernier résultat / Mention</span>
                    <span className="font-semibold text-foreground mt-0.5 block">{selectedDetail.data.last_grade_result}</span>
                  </div>
                )}

                {selectedDetail.data.education_level && (
                  <div className="p-3 rounded-xl bg-surface border border-border">
                    <span className="text-xs text-muted-foreground font-semibold uppercase block">Niveau d’études général</span>
                    <span className="font-semibold text-foreground mt-0.5 block">{selectedDetail.data.education_level}</span>
                  </div>
                )}

                {selectedDetail.data.address && (
                  <div className="p-3 rounded-xl bg-surface border border-border">
                    <span className="text-xs text-muted-foreground font-semibold uppercase block">Adresse / Ville de résidence</span>
                    <span className="font-semibold text-foreground mt-0.5 block">{selectedDetail.data.address}</span>
                  </div>
                )}

                {selectedDetail.data.guardian_name && (
                  <div className="p-3 rounded-xl bg-surface border border-border">
                    <span className="text-xs text-muted-foreground font-semibold uppercase block">Nom du Parent / Tuteur</span>
                    <span className="font-semibold text-foreground mt-0.5 block">
                      {selectedDetail.data.guardian_name} {selectedDetail.data.guardian_relation ? `(${selectedDetail.data.guardian_relation})` : ''}
                    </span>
                  </div>
                )}

                {selectedDetail.data.guardian_email && (
                  <div className="p-3 rounded-xl bg-surface border border-border">
                    <span className="text-xs text-muted-foreground font-semibold uppercase block">Email du Tuteur</span>
                    <span className="font-semibold text-foreground mt-0.5 block">{selectedDetail.data.guardian_email}</span>
                  </div>
                )}

                {selectedDetail.data.start_term && (
                  <div className="p-3 rounded-xl bg-surface border border-border">
                    <span className="text-xs text-muted-foreground font-semibold uppercase block">Session / Rentrée souhaitée</span>
                    <span className="font-semibold text-primary mt-0.5 block">{selectedDetail.data.start_term}</span>
                  </div>
                )}

                {selectedDetail.data.preferred_schedule && (
                  <div className="p-3 rounded-xl bg-surface border border-border">
                    <span className="text-xs text-muted-foreground font-semibold uppercase block">Mode / Horaire souhaité</span>
                    <span className="font-semibold text-primary mt-0.5 block">{selectedDetail.data.preferred_schedule}</span>
                  </div>
                )}

                {selectedDetail.data.payment_mode_preference && (
                  <div className="p-3 rounded-xl bg-surface border border-border">
                    <span className="text-xs text-muted-foreground font-semibold uppercase block">Modalité de paiement envisagée</span>
                    <span className="font-semibold text-foreground mt-0.5 block">{selectedDetail.data.payment_mode_preference}</span>
                  </div>
                )}

                {selectedDetail.data.source && (
                  <div className="p-3 rounded-xl bg-surface border border-border">
                    <span className="text-xs text-muted-foreground font-semibold uppercase block">Source / Comment il a connu Wasomi</span>
                    <span className="font-semibold text-foreground mt-0.5 block">{selectedDetail.data.source}</span>
                  </div>
                )}

                {selectedDetail.data.created_at && (
                  <div className="p-3 rounded-xl bg-surface border border-border">
                    <span className="text-xs text-muted-foreground font-semibold uppercase block">Date de soumission</span>
                    <span className="font-semibold text-foreground mt-0.5 block">
                      {new Date(selectedDetail.data.created_at).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                )}

                {selectedDetail.data.subject && (
                  <div className="p-3 rounded-xl bg-surface border border-border sm:col-span-2">
                    <span className="text-xs text-muted-foreground font-semibold uppercase block">Sujet du Message</span>
                    <span className="font-semibold text-foreground mt-0.5 block">{selectedDetail.data.subject}</span>
                  </div>
                )}
              </div>

              {selectedDetail.data.special_needs && (
                <div className="p-4 rounded-xl bg-surface border border-border space-y-1">
                  <span className="text-xs text-muted-foreground font-semibold uppercase block">Besoins particuliers ou aménagements</span>
                  <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed mt-1">
                    {selectedDetail.data.special_needs}
                  </p>
                </div>
              )}

              {/* User Message / Motivation Text */}
              {selectedDetail.data.message && (
                <div className="p-4 rounded-xl bg-surface border border-border space-y-1">
                  <span className="text-xs text-muted-foreground font-semibold uppercase block">Message / Lettre de Motivation</span>
                  <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed mt-1">
                    {selectedDetail.data.message}
                  </p>
                </div>
              )}

              {/* Status & Admin Notes Section */}
              <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-4">
                <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
                  <UserCheck className="size-4 text-primary" />
                  Gestion du Dossier & Notes Internes
                </h4>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
                      Statut du dossier
                    </label>
                    <select
                      value={detailStatus}
                      onChange={(e) => setDetailStatus(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm focus:border-primary focus:outline-none"
                    >
                      <option value="new">Non Ouvert / Nouveau</option>
                      <option value="read">Ouvert / Lu</option>
                      <option value="in_progress">En cours de traitement</option>
                      <option value="handled">Traité / Prise de contact effectuée</option>
                      <option value="accepted">Accepté / Inscrit</option>
                      <option value="rejected">Rejeté / Classé</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
                      Notes Administrateur
                    </label>
                    <textarea
                      rows={2}
                      value={detailNotes}
                      onChange={(e) => setDetailNotes(e.target.value)}
                      placeholder="Ajouter des notes internes (ex: rendez-vous le 18 août)..."
                      className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm focus:border-primary focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-surface px-6 py-4 border-t border-border flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedDetail(null)}
                className="px-4 py-2 rounded-xl border border-border text-sm font-semibold hover:bg-muted"
              >
                Fermer
              </button>
              <button
                onClick={saveDetailUpdate}
                className="px-5 py-2 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-semibold shadow-elegant"
              >
                Enregistrer la mise à jour
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
