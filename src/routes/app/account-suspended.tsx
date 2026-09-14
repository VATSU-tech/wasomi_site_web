import { createFileRoute } from '@tanstack/react-router';
import { AccountSuspendedPage } from '@/pages/AccountSuspendedPage';

export const Route = createFileRoute('/app/account-suspended')({
  component: AccountSuspendedPage,
});
