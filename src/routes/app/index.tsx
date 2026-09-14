import { createFileRoute } from '@tanstack/react-router';
import { RequireAuth } from '@/layouts/AppShell';
import { WelcomePage } from '@/pages/WelcomePage';

export const Route = createFileRoute('/app/')({
  component: () => (
    <RequireAuth>
      <WelcomePage />
    </RequireAuth>
  ),
});
