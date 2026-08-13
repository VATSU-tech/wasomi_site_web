import { apiClient } from '@/api/client';
import { ApiResponse } from '@/types/api';

export interface HealthStatus {
  status: string;
  timestamp?: string;
  uptime?: number;
}

export const healthService = {
  check: () => apiClient.get<ApiResponse<HealthStatus>>('/health'),
};
