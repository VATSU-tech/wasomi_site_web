import { env } from '@/config/env';
import { authStore } from '@/store/auth-store';
import { ApiError, ApiErrorResponse } from '@/types/api';

type HttpMethod = 'GET'|'POST'|'PUT'|'PATCH'|'DELETE';

async function request<T>(method: HttpMethod, path: string, body?: unknown): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), env.apiTimeoutMs);
  try {
    const token = authStore.getToken();
    const response = await fetch(`${env.apiBaseUrl}${path}`, {
      method,
      headers: { 'Content-Type':'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    if (!response.ok) {
      const errorPayload = (await response.json().catch(() => null)) as ApiErrorResponse | null;
      if (response.status === 401) authStore.clear();
      throw new ApiError(errorPayload?.message ?? 'API request failed', response.status, errorPayload?.errors);
    }
    if (response.status === 204) return undefined as T;
    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw new ApiError('Request timeout.', 408);
    throw error;
  } finally { clearTimeout(timeout); }
}

export const apiClient = { get:<T>(path:string)=>request<T>('GET',path), post:<T>(path:string,b?:unknown)=>request<T>('POST',path,b), put:<T>(path:string,b?:unknown)=>request<T>('PUT',path,b), patch:<T>(path:string,b?:unknown)=>request<T>('PATCH',path,b), delete:<T>(path:string)=>request<T>('DELETE',path) };
