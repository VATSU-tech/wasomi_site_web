import { apiClient, fetchCsrfToken } from '@/api/client';
import { ApiResponse } from '@/types/api';
import { User } from '@/types/domain';

export interface LoginDto {
  email: string;
  password: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export const authService = {
  getCsrf: () => fetchCsrfToken(),
  login: (dto: LoginDto) => apiClient.post<ApiResponse<User>>('/auth/login', dto),
  logout: () => apiClient.post<ApiResponse<null>>('/auth/logout'),
  me: () => apiClient.get<ApiResponse<User>>('/auth/me'),
  forgotPassword: (dto: ForgotPasswordDto) =>
    apiClient.post<ApiResponse<{ message: string }>>('/auth/forgot-password', dto),
  resetPassword: (dto: ResetPasswordDto) =>
    apiClient.post<ApiResponse<{ message: string }>>('/auth/reset-password', dto),
  verifyEmail: (token: string) =>
    apiClient.post<ApiResponse<{ message: string }>>('/auth/verify-email', { token }),
};
