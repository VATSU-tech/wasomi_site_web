import { apiClient } from '@/api/client';
import { ApiResponse } from '@/types/api';
import { Post } from '@/types/domain';

export interface PostQueryParams {
  category?: string;
  page?: number;
  limit?: number;
  q?: string;
}

export const postService = {
  list: (params?: PostQueryParams) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));
    if (params?.q) query.append('q', params.q);

    const qString = query.toString();
    return apiClient.get<ApiResponse<Post[]>>(`/posts${qString ? `?${qString}` : ''}`);
  },
  getBySlug: (slug: string) => apiClient.get<ApiResponse<Post>>(`/posts/${slug}`),
};
