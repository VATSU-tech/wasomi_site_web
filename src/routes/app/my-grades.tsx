import { createFileRoute } from '@tanstack/react-router';
import { RequireAuth } from '@/layouts/AppShell';
import { EmptyState } from '@/components/ui/app-toast';

export const Route = createFileRoute('/app/my-grades')({
  component: () => (
    <RequireAuth>
      <EmptyState
        title="Mon bulletin"
        description="Consultez vos cours, notes et bulletin scolaire."
      />
    </RequireAuth>
  ),
});
