import { queryKeys } from '@/constants/query-keys';
import { authStore } from '@/store/auth-store';
import { authService, LoginDto, RegisterDto } from '@/services/auth.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useMeQuery() { return useQuery({ queryKey: queryKeys.auth.me, queryFn: authService.me, enabled: !!authStore.getToken() }); }
export function useLoginMutation() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (dto:LoginDto)=>authService.login(dto), onSuccess: ({data}) => { authStore.setSession(data.token, data.user); qc.invalidateQueries({queryKey: queryKeys.auth.me}); } });
}
export function useRegisterMutation() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (dto:RegisterDto)=>authService.register(dto), onSuccess: ({data}) => { authStore.setSession(data.token, data.user); qc.invalidateQueries({queryKey: queryKeys.auth.me}); } });
}
export function useLogoutMutation() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: authService.logout, onSettled: ()=>{authStore.clear(); qc.clear(); } });
}
