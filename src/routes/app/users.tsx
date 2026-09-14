import { createFileRoute } from '@tanstack/react-router';
import { RequireAuth } from '@/layouts/AppShell';
import { EmptyState } from '@/components/ui/app-toast';

export const Route = createFileRoute('/app/users')({
  component: () => (
    <RequireAuth>
      <UsersPlaceholder />
    </RequireAuth>
  ),
});

function UsersPlaceholder() {
  return (
    <EmptyState
      title="Gestion du personnel"
      description="Création et gestion des enseignants, attribution des fonctions et suspension des comptes."
    />
  );
}
