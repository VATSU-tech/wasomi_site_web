import { apiClient } from '@/api/client';
import { ApiResponse } from '@/types/api';
import { PageContent } from '@/types/domain';

export const pageService = {
  getByKey: (key: string) => apiClient.get<ApiResponse<PageContent>>(`/pages/${key}`),
};
