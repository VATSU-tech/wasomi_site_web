import { createFileRoute } from '@tanstack/react-router';
import { RequireAuth } from '@/layouts/AppShell';
import { EnrollmentsPage } from '@/features/enrollments/EnrollmentsPage';

export const Route = createFileRoute('/app/enrollments')({
  component: () => (
    <RequireAuth>
      <EnrollmentsPage />
    </RequireAuth>
  ),
});
