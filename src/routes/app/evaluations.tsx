import { createFileRoute } from '@tanstack/react-router';
import { RequireAuth } from '@/layouts/AppShell';
import { EvaluationsPage } from '@/features/teachings/EvaluationsPage';

export const Route = createFileRoute('/app/evaluations')({
  component: () => (
    <RequireAuth>
      <EvaluationsPage />
    </RequireAuth>
  ),
});
