import { apiClient } from '@/api/client';
import { ApiResponse } from '@/types/api';
import { Program } from '@/types/domain';

export const programService = {
  list: () => apiClient.get<ApiResponse<Program[]>>('/programs'),
  getBySlug: (slug: string) => apiClient.get<ApiResponse<Program>>(`/programs/${slug}`),
};
