import { apiClient } from '@/api/client';
import { ApiResponse } from '@/types/api';
import { ContactMessagePayload } from '@/types/domain';

export const contactService = {
  send: (payload: ContactMessagePayload) =>
    apiClient.post<ApiResponse<{ id: string | number; message: string }>>('/contact-messages', payload),
};
