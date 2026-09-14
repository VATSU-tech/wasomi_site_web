import { createFileRoute } from '@tanstack/react-router';
import { RequireAuth } from '@/layouts/AppShell';
import { EmptyState } from '@/components/ui/app-toast';

export const Route = createFileRoute('/app/settings')({
  component: () => (
    <RequireAuth>
      <EmptyState
        title="Paramètres de l'établissement"
        description="Configuration globale de l'école réservée au Préfet des études."
      />
    </RequireAuth>
  ),
});
