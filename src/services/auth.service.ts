import { apiClient } from '@/api/client';
import { ApiSuccessResponse } from '@/types/api';
import { AuthPayload, User } from '@/types/domain';

export interface LoginDto { email:string; password:string; device_name:string }
export interface RegisterDto extends LoginDto { name:string; password_confirmation:string }

export const authService = {
  login: (dto: LoginDto) => apiClient.post<ApiSuccessResponse<AuthPayload>>('/auth/login', dto),
  register: (dto: RegisterDto) => apiClient.post<ApiSuccessResponse<AuthPayload>>('/auth/register', dto),
  logout: () => apiClient.post<ApiSuccessResponse<null>>('/auth/logout'),
  me: () => apiClient.get<User>('/auth/me'),
};
