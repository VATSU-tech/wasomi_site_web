import { queryKeys } from '@/constants/query-keys';
import { authService, LoginDto } from '@/services/auth.service';
import { authStore } from '@/store/auth-store';
import { fetchCsrfToken } from '@/api/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useMeQuery() {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: async () => {
      try {
        const res = await authService.me();
        authStore.setUser(res.data);
        return res.data;
      } catch (err) {
        authStore.setUser(null);
        throw err;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLoginMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: LoginDto) => authService.login(dto),
    onSuccess: async (res) => {
      if (res.data) {
        authStore.setUser(res.data);
      }
      // Le backend émet un nouveau cookie wasomi_csrf lors du login (issueSession).
      // En cross-site (localhost → onrender.com), document.cookie ne le voit pas.
      // force=true ignore le token JS en cache et re-fetche depuis /auth/csrf.
      await fetchCsrfToken(true);
      qc.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
  });
}

export function useLogoutMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authService.logout,
    onSettled: () => {
      authStore.clear();
      qc.clear();
    },
  });
}
