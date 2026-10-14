import { apiClient } from '@/api/client';
import { ApiResponse } from '@/types/api';
import type {
  HeroSlide,
  Review,
  SchoolClass,
  ClassTree,
} from '@/types/domain';

export const cmsService = {
  // Public
  getHeroSlides: () => apiClient.get<ApiResponse<HeroSlide[]>>('/hero-slides'),
  getReviews: (params?: { featured?: boolean; limit?: number }) => {
    const q = new URLSearchParams();
    if (params?.featured) q.set('featured', 'true');
    if (params?.limit) q.set('limit', String(params.limit));
    const qs = q.toString();
    return apiClient.get<ApiResponse<Review[]>>(`/reviews${qs ? `?${qs}` : ''}`);
  },
  submitReview: (data: {
    author_name: string;
    author_role?: string;
    content: string;
    rating?: number;
  }) => apiClient.post<ApiResponse<{ id: string; message: string }>>('/reviews', data),
  getClasses: () => apiClient.get<ApiResponse<SchoolClass[]>>('/classes'),
  getClassesTree: () => apiClient.get<ApiResponse<ClassTree>>('/classes/tree'),
};

export const adminCmsService = {
  getHeroSlides: () => apiClient.get<ApiResponse<HeroSlide[]>>('/admin/hero-slides'),
  createHeroSlide: (data: Partial<HeroSlide>) =>
    apiClient.post<ApiResponse<HeroSlide>>('/admin/hero-slides', data),
  updateHeroSlide: (id: string | number, data: Partial<HeroSlide>) =>
    apiClient.patch<ApiResponse<HeroSlide>>(`/admin/hero-slides/${id}`, data),
  deleteHeroSlide: (id: string | number) =>
    apiClient.delete<ApiResponse<null>>(`/admin/hero-slides/${id}`),
  reorderHeroSlides: (ids: Array<string | number>) =>
    apiClient.post<ApiResponse<{ reordered: number }>>('/admin/hero-slides/reorder', { ids }),

  getReviews: (status?: string) =>
    apiClient.get<ApiResponse<Review[]>>(
      `/admin/reviews${status ? `?status=${encodeURIComponent(status)}` : ''}`,
    ),
  updateReview: (id: string | number, data: Partial<Review>) =>
    apiClient.patch<ApiResponse<Review>>(`/admin/reviews/${id}`, data),
  deleteReview: (id: string | number) =>
    apiClient.delete<ApiResponse<null>>(`/admin/reviews/${id}`),

  getClasses: () => apiClient.get<ApiResponse<SchoolClass[]>>('/admin/classes'),
  createClass: (data: Partial<SchoolClass>) =>
    apiClient.post<ApiResponse<SchoolClass>>('/admin/classes', data),
  updateClass: (id: string | number, data: Partial<SchoolClass>) =>
    apiClient.patch<ApiResponse<SchoolClass>>(`/admin/classes/${id}`, data),
  deleteClass: (id: string | number) =>
    apiClient.delete<ApiResponse<null>>(`/admin/classes/${id}`),

  reorderPrograms: (ids: Array<string | number>) =>
    apiClient.post<ApiResponse<{ reordered: number }>>('/admin/programs/reorder', { ids }),
};
