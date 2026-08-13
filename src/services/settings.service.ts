import { apiClient } from '@/api/client';
import { ApiResponse } from '@/types/api';
import { PublicSettings } from '@/types/domain';

export const settingsService = {
  getPublic: () => apiClient.get<ApiResponse<PublicSettings>>('/settings/public'),
};
