import { useEffect, useState, type ReactNode } from 'react';
import { Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { useAuth } from '@/context/AuthContext';
import { useSchoolApiToasts } from '@/components/ui/app-toast';
import { Skeleton } from '@/components/ui/app-skeleton';
import { schoolService } from '@/features/school/school.service';

const BARE_PATHS = ['/app/login', '/app/account-suspended'];

export function AppShell({ children }: { children?: ReactNode }) {
  const { isLoading, isAuthenticated, isSuspended } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isBarePage = BARE_PATHS.some((p) => pathname.startsWith(p));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anneeLabel, setAnneeLabel] = useState<string>('');
  useSchoolApiToasts();

  useEffect(() => {
    if (!isLoading && isSuspended && !pathname.startsWith('/app/account-suspended')) {
      navigate({ to: '/app/account-suspended' });
    }
  }, [isLoading, isSuspended, navigate, pathname]);

  if (isBarePage) {
    return <>{children ?? <Outlet />}</>;
  }

  useEffect(() => {
    schoolService
      .getActiveAnnee()
      .then((a) => setAnneeLabel(a?.libelle ?? ''))
      .catch(() => setAnneeLabel(''));
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center space-y-4">
          <span className="loading loading-spinner loading-lg text-primary" />
          <p className="text-sm text-base-content/60">Chargement du portail…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 flex" data-theme="school">
      <div className="hidden lg:block shrink-0">
        <Sidebar />
      </div>

      <div className="hidden md:block lg:hidden shrink-0">
        <Sidebar collapsed />
      </div>

      <div className={`drawer lg:drawer-open flex-1 min-w-0 ${drawerOpen ? 'drawer-open' : ''}`}>
        <input
          id="app-drawer"
          type="checkbox"
          className="drawer-toggle"
          checked={drawerOpen}
          onChange={(e) => setDrawerOpen(e.target.checked)}
        />
        <div className="drawer-content flex flex-col min-h-screen">
          <TopNavbar
            onMenuToggle={() => setDrawerOpen((v) => !v)}
            anneeLabel={anneeLabel}
          />
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            {children ?? <Outlet />}
          </main>
        </div>
        <div className="drawer-side z-40 lg:hidden">
          <label
            htmlFor="app-drawer"
            className="drawer-overlay"
            aria-label="Fermer le menu"
          />
          <Sidebar onNavigate={() => setDrawerOpen(false)} />
        </div>
      </div>
    </div>
  );
}

export function AppLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-box" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-box" />
    </div>
  );
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: '/app/login' });
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading || !isAuthenticated) {
    return <AppLoadingSkeleton />;
  }

  return <>{children}</>;
}
