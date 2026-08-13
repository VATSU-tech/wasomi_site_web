import { apiClient } from '@/api/client';
import { ApiResponse } from '@/types/api';
import { GalleryCategory, GalleryItem } from '@/types/domain';

export interface GalleryQueryParams {
  category?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
}

export const galleryService = {
  getCategories: () => apiClient.get<ApiResponse<GalleryCategory[]>>('/gallery/categories'),
  getItems: (params?: GalleryQueryParams) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.featured !== undefined) query.append('featured', String(params.featured));
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));

    const qString = query.toString();
    return apiClient.get<ApiResponse<GalleryItem[]>>(`/gallery${qString ? `?${qString}` : ''}`);
  },
};
