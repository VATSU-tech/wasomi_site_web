import { type ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import type { RoleSlug } from '@/api/types';

interface PermissionGateProps {
  roles?: RoleSlug[];
  requireAll?: boolean;
  fallback?: ReactNode;
  children: ReactNode;
}

export function PermissionGate({
  roles = [],
  requireAll = false,
  fallback = null,
  children,
}: PermissionGateProps) {
  const { hasRole, isAdmin } = useAuth();

  if (roles.length === 0) {
    return <>{children}</>;
  }

  if (isAdmin) {
    return <>{children}</>;
  }

  const allowed = requireAll
    ? roles.every((r) => hasRole(r))
    : roles.some((r) => hasRole(r));

  if (!allowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
