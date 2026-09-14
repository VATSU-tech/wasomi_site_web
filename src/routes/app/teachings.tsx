import { createFileRoute } from '@tanstack/react-router';
import { RequireAuth } from '@/layouts/AppShell';
import { TeachingsPage } from '@/features/teachings/TeachingsPage';

export const Route = createFileRoute('/app/teachings')({
  component: () => (
    <RequireAuth>
      <TeachingsPage />
    </RequireAuth>
  ),
});
