import { createFileRoute } from '@tanstack/react-router';
import { RequireAuth } from '@/layouts/AppShell';
import { EmptyState } from '@/components/ui/app-toast';

export const Route = createFileRoute('/app/children')({
  component: () => (
    <RequireAuth>
      <EmptyState
        title="Mes enfants"
        description="Consultez les notes, présences et bulletins de vos enfants."
      />
    </RequireAuth>
  ),
});
