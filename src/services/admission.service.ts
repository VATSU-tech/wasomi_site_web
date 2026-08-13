import { apiClient } from '@/api/client';
import { ApiResponse } from '@/types/api';
import { AdmissionRequestPayload } from '@/types/domain';

export const admissionService = {
  submit: (payload: AdmissionRequestPayload) =>
    apiClient.post<ApiResponse<{ id: string | number; message: string }>>('/admission-requests', payload),
};
