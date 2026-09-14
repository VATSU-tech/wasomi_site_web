import { createFileRoute } from '@tanstack/react-router';
import { RequireAuth } from '@/layouts/AppShell';
import { DashboardPage } from '@/pages/DashboardPage';

export const Route = createFileRoute('/app/dashboard')({
  component: () => (
    <RequireAuth>
      <DashboardPage />
    </RequireAuth>
  ),
});
