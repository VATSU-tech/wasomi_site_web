import { apiClient } from '@/api/client';
import { ApiResponse } from '@/types/api';

export const adminService = {
  // Posts
  getPosts: () => apiClient.get<ApiResponse<unknown[]>>('/admin/posts'),
  createPost: (data: unknown) => apiClient.post<ApiResponse<unknown>>('/admin/posts', data),
  updatePost: (id: string | number, data: unknown) => apiClient.patch<ApiResponse<unknown>>(`/admin/posts/${id}`, data),
  deletePost: (id: string | number) => apiClient.delete<ApiResponse<null>>(`/admin/posts/${id}`),
  publishPost: (id: string | number) => apiClient.post<ApiResponse<unknown>>(`/admin/posts/${id}/publish`),
  unpublishPost: (id: string | number) => apiClient.post<ApiResponse<unknown>>(`/admin/posts/${id}/unpublish`),

  // Programs
  getPrograms: () => apiClient.get<ApiResponse<unknown[]>>('/admin/programs'),
  createProgram: (data: unknown) => apiClient.post<ApiResponse<unknown>>('/admin/programs', data),
  updateProgram: (id: string | number, data: unknown) => apiClient.patch<ApiResponse<unknown>>(`/admin/programs/${id}`, data),
  deleteProgram: (id: string | number) => apiClient.delete<ApiResponse<null>>(`/admin/programs/${id}`),

  // Staff
  getStaff: () => apiClient.get<ApiResponse<unknown[]>>('/admin/staff'),
  createStaff: (data: unknown) => apiClient.post<ApiResponse<unknown>>('/admin/staff', data),
  updateStaff: (id: string | number, data: unknown) => apiClient.patch<ApiResponse<unknown>>(`/admin/staff/${id}`, data),
  deleteStaff: (id: string | number) => apiClient.delete<ApiResponse<null>>(`/admin/staff/${id}`),

  // Gallery Categories & Items
  getGalleryCategories: () => apiClient.get<ApiResponse<unknown[]>>('/admin/gallery/categories'),
  createGalleryCategory: (data: unknown) => apiClient.post<ApiResponse<unknown>>('/admin/gallery/categories', data),
  updateGalleryCategory: (id: string | number, data: unknown) => apiClient.patch<ApiResponse<unknown>>(`/admin/gallery/categories/${id}`, data),
  deleteGalleryCategory: (id: string | number) => apiClient.delete<ApiResponse<null>>(`/admin/gallery/categories/${id}`),

  getGalleryItems: () => apiClient.get<ApiResponse<unknown[]>>('/admin/gallery/items'),
  createGalleryItem: (data: unknown) => apiClient.post<ApiResponse<unknown>>('/admin/gallery/items', data),
  updateGalleryItem: (id: string | number, data: unknown) => apiClient.patch<ApiResponse<unknown>>(`/admin/gallery/items/${id}`, data),
  deleteGalleryItem: (id: string | number) => apiClient.delete<ApiResponse<null>>(`/admin/gallery/items/${id}`),

  // Media
  uploadMedia: (formData: FormData) => apiClient.post<ApiResponse<unknown>>('/admin/media/upload', formData),
  getMedia: () => apiClient.get<ApiResponse<unknown[]>>('/admin/media'),
  deleteMedia: (id: string | number) => apiClient.delete<ApiResponse<null>>(`/admin/media/${id}`),

  // Pages & Settings
  getPage: (key: string) => apiClient.get<ApiResponse<unknown>>(`/admin/pages/${key}`),
  updatePage: (key: string, data: unknown) => apiClient.patch<ApiResponse<unknown>>(`/admin/pages/${key}`, data),
  getSettings: () => apiClient.get<ApiResponse<unknown>>('/admin/settings'),
  updateSettings: (data: unknown) => apiClient.patch<ApiResponse<unknown>>('/admin/settings', data),

  // Messages & Admissions
  getOverviewStats: () =>
    apiClient.get<
      ApiResponse<{
        unread_messages: number;
        total_messages: number;
        pending_admissions: number;
        total_admissions: number;
        total_posts: number;
        total_programs: number;
        total_staff: number;
        recent_unopened_messages?: any[];
        recent_unopened_admissions?: any[];
      }>
    >('/admin/overview-stats'),
  getContactMessages: () => apiClient.get<ApiResponse<unknown[]>>('/admin/contact-messages'),
  updateContactMessage: (id: string | number, data: unknown) => apiClient.patch<ApiResponse<unknown>>(`/admin/contact-messages/${id}`, data),
  getAdmissionRequests: () => apiClient.get<ApiResponse<unknown[]>>('/admin/admission-requests'),
  updateAdmissionRequest: (id: string | number, data: unknown) => apiClient.patch<ApiResponse<unknown>>(`/admin/admission-requests/${id}`, data),

  // Users
  getUsers: () => apiClient.get<ApiResponse<unknown[]>>('/admin/users'),
  createUser: (data: unknown) => apiClient.post<ApiResponse<unknown>>('/admin/users', data),
  updateUser: (id: string | number, data: unknown) => apiClient.patch<ApiResponse<unknown>>(`/admin/users/${id}`, data),
  setUserRoles: (id: string | number, roles: string[]) => apiClient.post<ApiResponse<unknown>>(`/admin/users/${id}/roles`, { roles }),
  deactivateUser: (id: string | number) => apiClient.post<ApiResponse<unknown>>(`/admin/users/${id}/deactivate`),

  // Audit Logs
  getAuditLogs: () => apiClient.get<ApiResponse<unknown[]>>('/admin/audit-logs'),
};
