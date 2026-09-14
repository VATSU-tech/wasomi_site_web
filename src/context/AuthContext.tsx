import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { RoleSlug, SchoolInfo, SchoolProfile } from '@/api/types';
import { getAccessToken } from '@/api/core/client';
import { schoolAuthService } from '@/features/auth/school-auth.service';
import { schoolService } from '@/features/school/school.service';

interface AuthContextValue {
  user: SchoolProfile | null;
  school: SchoolInfo | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isSuspended: boolean;
  isPrefet: boolean;
  isProviseur: boolean;
  isEnseignant: boolean;
  isTitulaire: boolean;
  isParent: boolean;
  isEleve: boolean;
  isAdmin: boolean;
  hasRole: (slug: RoleSlug) => boolean;
  refreshProfile: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function hasRoleSlug(user: SchoolProfile | null, slug: RoleSlug): boolean {
  if (!user?.roles) return false;
  return user.roles.some((r) => r.slug === slug);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SchoolProfile | null>(null);
  const [school, setSchool] = useState<SchoolInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      setUser(null);
      setSchool(null);
      return;
    }

    try {
      const [profile, schoolInfo] = await Promise.all([
        schoolAuthService.me(),
        schoolService.getSchool(),
      ]);
      setUser(profile);
      setSchool(schoolInfo);
    } catch {
      setUser(null);
      setSchool(null);
    }
  }, []);

  useEffect(() => {
    refreshProfile().finally(() => setIsLoading(false));
  }, [refreshProfile]);

  const logout = useCallback(async () => {
    await schoolAuthService.logout();
    setUser(null);
    setSchool(null);
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const isSuspended =
      user?.status === 'SUSPENDED' || user?.is_active === false;

    return {
      user,
      school,
      isLoading,
      isAuthenticated: !!user && !isSuspended,
      isSuspended,
      isPrefet: hasRoleSlug(user, 'prefet'),
      isProviseur: hasRoleSlug(user, 'proviseur'),
      isEnseignant: hasRoleSlug(user, 'enseignant'),
      isTitulaire: hasRoleSlug(user, 'titulaire'),
      isParent: hasRoleSlug(user, 'parent'),
      isEleve: hasRoleSlug(user, 'eleve'),
      isAdmin: hasRoleSlug(user, 'admin') || hasRoleSlug(user, 'prefet'),
      hasRole: (slug: RoleSlug) => hasRoleSlug(user, slug),
      refreshProfile,
      logout,
    };
  }, [user, school, isLoading, refreshProfile, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

export function useRoleLabel(): string {
  const { user, isPrefet, isProviseur, isEnseignant, isParent, isEleve } = useAuth();
  if (!user) return '';
  if (isPrefet) return 'Préfet des études';
  if (isProviseur) return 'Proviseur';
  if (isEnseignant) return user.fonction ? `Enseignant — ${user.fonction}` : 'Enseignant';
  if (isParent) return 'Parent d\'élève';
  if (isEleve) return 'Élève';
  return user.roles[0]?.name ?? 'Utilisateur';
}
