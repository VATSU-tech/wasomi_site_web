import { User } from '@/types/domain';

let userState: User | null = null;
const listeners: Set<() => void> = new Set();

function notify() {
  listeners.forEach((listener) => listener());
}

export const authStore = {
  getUser: (): User | null => userState,
  setUser: (user: User | null) => {
    userState = user;
    notify();
  },
  clear: () => {
    userState = null;
    notify();
  },
  isAuthenticated: (): boolean => userState !== null,
  hasPermission: (permissionSlug: string): boolean => {
    if (!userState) return false;
    if (!userState.permissions) return false;
    return userState.permissions.some((p) =>
      typeof p === 'string' ? p === permissionSlug : p.slug === permissionSlug,
    );
  },
  hasRole: (roleSlug: string): boolean => {
    if (!userState) return false;
    if (!userState.roles) return false;
    return userState.roles.some((r) => r.slug === roleSlug);
  },
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
