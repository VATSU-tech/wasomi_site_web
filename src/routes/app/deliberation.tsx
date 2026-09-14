import { createFileRoute } from '@tanstack/react-router';
import { RequireAuth } from '@/layouts/AppShell';
import { DeliberationPage } from '@/features/gradings/DeliberationPage';

export const Route = createFileRoute('/app/deliberation')({
  component: () => (
    <RequireAuth>
      <DeliberationPage />
    </RequireAuth>
  ),
});
