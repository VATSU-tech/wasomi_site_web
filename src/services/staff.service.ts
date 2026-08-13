import { apiClient } from '@/api/client';
import { ApiResponse } from '@/types/api';
import { StaffMember } from '@/types/domain';

export const staffService = {
  list: () => apiClient.get<ApiResponse<StaffMember[]>>('/staff'),
};
