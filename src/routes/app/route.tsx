import { createFileRoute, Outlet } from '@tanstack/react-router';
import { AuthProvider } from '@/context/AuthContext';
import { AppShell } from '@/layouts/AppShell';

export const Route = createFileRoute('/app')({
  component: AppLayout,
});

function AppLayout() {
  return (
    <AuthProvider>
      <AppShell>
        <Outlet />
      </AppShell>
    </AuthProvider>
  );
}
