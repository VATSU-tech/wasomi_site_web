import { apiClient } from '@/api/client';
import { ApiResponse } from '@/types/api';
import { ContactMessagePayload, User } from '@/types/domain';

export type ContactSendResult = {
  id?: string | number;
  message: string;
  authenticated?: boolean;
  user?: User;
};

export const contactService = {
  send: (payload: ContactMessagePayload) =>
    apiClient.post<ApiResponse<ContactSendResult>>('/contact-messages', payload),
};
