import { createFileRoute } from '@tanstack/react-router';
import { SchoolLoginPage } from '@/features/auth/SchoolLoginPage';

export const Route = createFileRoute('/app/login')({
  component: SchoolLoginPage,
});
