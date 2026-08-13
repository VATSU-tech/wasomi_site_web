import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
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
} from 'lucide-react';

export const Route = createFileRoute('/admin')({ component: AdminPage });

function AdminPage() {
  const navigate = useNavigate();
  const meQuery = useMeQuery();
  const logoutMutation = useLogoutMutation();

  const [activeTab, setActiveTab] = useState<'overview' | 'programs' | 'posts' | 'gallery' | 'staff' | 'media' | 'admissions' | 'messages'>('overview');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (meQuery.isError) {
      toast.error('Veuillez vous connecter pour accéder à l’administration.');
      navigate({ to: '/login' });
    }
  }, [meQuery.isError, navigate]);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast.success('Déconnexion réussie');
      navigate({ to: '/login' });
    } catch {
      authStore.clear();
      navigate({ to: '/login' });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      await adminService.uploadMedia(formData);
      toast.success('Fichier envoyé avec succès !');
    } catch (err: any) {
      toast.error(err?.message ?? 'Échec de l’envoi du média.');
    } finally {
      setUploading(false);
    }
  };

  if (meQuery.isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <div className="size-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <p className="text-sm text-muted-foreground">Vérification de la session en cours...</p>
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
          Vous devez être authentifié avec un compte administrateur pour accéder à cette section.
        </p>
        <Link
          to="/login"
          className="mt-6 px-6 py-2.5 bg-gradient-primary text-primary-foreground font-semibold rounded-xl shadow-elegant"
        >
          Se connecter
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Top Admin Header */}
      <div className="border-b border-border bg-surface px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-primary p-2 rounded-lg">
            <GraduationCap className="size-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg leading-tight">Espace Administration Wasomi</h1>
            <p className="text-xs text-muted-foreground">Connecté en tant que {user?.name} ({user?.email})</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass text-destructive hover:bg-destructive/10 text-sm font-semibold transition-smooth"
        >
          <LogOut className="size-4" />
          Déconnexion
        </button>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar navigation */}
          <div className="space-y-1 bg-card p-3 rounded-2xl border border-border shadow-sm h-fit">
            {[
              { id: 'overview', label: 'Vue d’ensemble', icon: LayoutDashboard },
              { id: 'programs', label: 'Formations', icon: BookOpen },
              { id: 'posts', label: 'Articles Blog', icon: FileText },
              { id: 'gallery', label: 'Galerie Photos', icon: ImageIcon },
              { id: 'staff', label: 'Équipe & Staff', icon: Users },
              { id: 'media', label: 'Gestion Médias', icon: Upload },
              { id: 'admissions', label: 'Préinscriptions', icon: GraduationCap },
              { id: 'messages', label: 'Messages Contact', icon: MessageSquare },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-smooth text-left ${
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

          {/* Tab Main Content */}
          <div className="lg:col-span-3 bg-card p-6 md:p-8 rounded-2xl border border-border shadow-elegant">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold font-display">Bienvenue, {user?.name}</h2>
                <p className="text-muted-foreground text-sm">
                  Ceci est votre console d’administration connectée à l’API NestJS/Fastify backend (`/api/v1`).
                </p>

                <div className="grid sm:grid-cols-3 gap-4 pt-4">
                  <div className="p-5 rounded-xl bg-surface-elevated border border-border">
                    <p className="text-xs uppercase text-muted-foreground font-semibold">Statut Session</p>
                    <p className="text-lg font-bold text-emerald-500 mt-1 flex items-center gap-1.5">
                      <CheckCircle className="size-4" /> Cookie HttpOnly actif
                    </p>
                  </div>
                  <div className="p-5 rounded-xl bg-surface-elevated border border-border">
                    <p className="text-xs uppercase text-muted-foreground font-semibold">Sécurité CSRF</p>
                    <p className="text-lg font-bold text-primary mt-1">Actif (X-CSRF-Token)</p>
                  </div>
                  <div className="p-5 rounded-xl bg-surface-elevated border border-border">
                    <p className="text-xs uppercase text-muted-foreground font-semibold">Permissions</p>
                    <p className="text-lg font-bold mt-1">{user?.roles?.map((r) => r.name).join(', ') || 'Administrateur'}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'media' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold font-display">Médiathèque</h2>
                    <p className="text-sm text-muted-foreground">Téléversez des fichiers vers `/admin/media/upload`</p>
                  </div>
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-primary text-primary-foreground rounded-xl text-sm font-semibold cursor-pointer shadow-elegant hover:shadow-glow">
                    <Upload className="size-4" />
                    {uploading ? 'Envoi...' : 'Téléverser'}
                    <input type="file" onChange={handleFileUpload} className="hidden" accept="image/*,pdf" />
                  </label>
                </div>
              </div>
            )}

            {['programs', 'posts', 'gallery', 'staff', 'admissions', 'messages'].includes(activeTab) && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold font-display capitalize">Gestion des {activeTab}</h2>
                  <button
                    onClick={() => toast.info('Gestion des enregistrements via API')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-primary text-primary-foreground rounded-xl text-sm font-semibold shadow-elegant"
                  >
                    <Plus className="size-4" />
                    Ajouter
                  </button>
                </div>
                <div className="p-8 border border-dashed border-border rounded-2xl text-center">
                  <p className="text-muted-foreground text-sm">
                    Les endpoints `/admin/{activeTab}` sont prêts et sécurisés par session cookie et jeton CSRF.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
