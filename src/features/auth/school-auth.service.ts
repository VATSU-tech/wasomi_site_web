import { schoolApi, setTokens, clearTokens } from '@/api/core/client';
import { endpoints } from '@/api/endpoints';
import type {
  LoginRequest,
  LoginResponse,
  SchoolProfile,
  PasswordVerifyOtpRequest,
  PasswordVerifyOtpResponse,
  PasswordConfirmRequest,
  ActivateValidateRequest,
  ActivateRequest,
  ChannelPreferences,
} from '@/api/types';

export const schoolAuthService = {
  login: async (dto: LoginRequest): Promise<LoginResponse> => {
    const res = await schoolApi.post<LoginResponse>(endpoints.auth.login, dto);
    setTokens(res.access, res.refresh);
    return res;
  },

  logout: async (): Promise<void> => {
    try {
      await schoolApi.post(endpoints.auth.logout);
    } finally {
      clearTokens();
    }
  },

  me: () => schoolApi.get<SchoolProfile>(endpoints.auth.me),

  verifyOtp: (dto: PasswordVerifyOtpRequest) =>
    schoolApi.post<PasswordVerifyOtpResponse>(endpoints.auth.passwordVerifyOtp, dto),

  confirmPassword: (dto: PasswordConfirmRequest) =>
    schoolApi.post<{ detail: string }>(endpoints.auth.passwordConfirm, dto),

  resetPassword: (dto: PasswordConfirmRequest) =>
    schoolApi.post<{ detail: string }>(endpoints.auth.passwordReset, dto),

  validateActivation: (dto: ActivateValidateRequest) =>
    schoolApi.post<{ valid: boolean; email?: string }>(endpoints.auth.activateValidate, dto),

  activate: (dto: ActivateRequest) =>
    schoolApi.post<{ detail: string }>(endpoints.auth.activate, dto),

  getChannelPreferences: () =>
    schoolApi.get<ChannelPreferences>(endpoints.auth.preferencesChannel),

  updateChannelPreferences: (dto: ChannelPreferences) =>
    schoolApi.patch<ChannelPreferences>(endpoints.auth.preferencesChannel, dto),
};
