import { env } from '@/config/env';
import { ApiError, ApiErrorResponse } from '@/types/api';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

const ACCESS_KEY = 'school_access_token';
const REFRESH_KEY = 'school_refresh_token';

let isRefreshing = false;
let refreshSubscribers: Array<(success: boolean) => void> = [];

type ToastHandler = (message: string, type: 'error' | 'success' | 'warning') => void;
let globalToastHandler: ToastHandler | null = null;

export function setSchoolApiToastHandler(handler: ToastHandler | null) {
  globalToastHandler = handler;
}

function notifyRefresh(success: boolean) {
  refreshSubscribers.forEach((cb) => cb(success));
  refreshSubscribers = [];
}

export function getAccessToken(): string | null {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function setTokens(access: string, refresh: string) {
  localStorage.setItem(ACCESS_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

async function performRefresh(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  if (isRefreshing) {
    return new Promise<boolean>((resolve) => {
      refreshSubscribers.push(resolve);
    });
  }

  isRefreshing = true;
  try {
    const response = await fetch(`${env.schoolApiBaseUrl}/accounts/auth/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response.ok) {
      const data = (await response.json()) as { access: string };
      localStorage.setItem(ACCESS_KEY, data.access);
      isRefreshing = false;
      notifyRefresh(true);
      return true;
    }

    isRefreshing = false;
    notifyRefresh(false);
    clearTokens();
    return false;
  } catch {
    isRefreshing = false;
    notifyRefresh(false);
    clearTokens();
    return false;
  }
}

async function request<T>(
  method: HttpMethod,
  path: string,
  body?: unknown,
  isRetry = false,
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), env.apiTimeoutMs);

  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  const token = getAccessToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let requestBody: BodyInit | undefined;
  if (body !== undefined) {
    if (body instanceof FormData) {
      requestBody = body;
    } else {
      headers['Content-Type'] = 'application/json';
      requestBody = JSON.stringify(body);
    }
  }

  const isAuthBypass = [
    '/accounts/auth/login/',
    '/accounts/auth/refresh/',
    '/accounts/auth/activate/',
    '/accounts/auth/activate/validate/',
    '/accounts/auth/password/verify-otp/',
    '/accounts/auth/password/confirm/',
    '/accounts/auth/password/reset/',
  ].some((p) => path.endsWith(p));

  try {
    const response = await fetch(`${env.schoolApiBaseUrl}${path}`, {
      method,
      headers,
      body: requestBody,
      signal: controller.signal,
    });

    if (!response.ok) {
      let errorPayload: ApiErrorResponse | null = null;
      try {
        errorPayload = (await response.json()) as ApiErrorResponse;
      } catch {
        errorPayload = null;
      }

      if (response.status === 401 && !isAuthBypass && !isRetry) {
        const refreshed = await performRefresh();
        if (refreshed) {
          return request<T>(method, path, body, true);
        }
        clearTokens();
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/app/login')) {
          window.location.href = '/app/login';
        }
      }

      if (response.status === 403) {
        globalToastHandler?.(
          'Action réservée au rôle habilité (Préfet / Proviseur).',
          'error',
        );
      }

      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        const waitMsg = retryAfter
          ? `Trop de requêtes. Réessayez dans ${retryAfter} secondes.`
          : 'Trop de requêtes. Veuillez patienter avant de réessayer.';
        globalToastHandler?.(waitMsg, 'warning');
      }

      const message =
        errorPayload?.error?.message ??
        (response.status === 401
          ? 'Session expirée ou non autorisée.'
          : response.status === 403
            ? 'Accès refusé.'
            : response.status === 404
              ? 'Ressource introuvable.'
              : `Erreur serveur (${response.status})`);

      const code =
        errorPayload?.error?.code ??
        (response.status === 401
          ? 'UNAUTHENTICATED'
          : response.status === 403
            ? 'FORBIDDEN'
            : response.status === 404
              ? 'NOT_FOUND'
              : 'INTERNAL_ERROR');

      throw new ApiError(
        message,
        response.status,
        code,
        errorPayload?.error?.fields,
        errorPayload?.meta?.requestId,
      );
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError("Délai d'attente dépassé.", 408, 'TIMEOUT');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export const schoolApi = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  put: <T>(path: string, body?: unknown) => request<T>('PUT', path, body),
  patch: <T>(path: string, body?: unknown) => request<T>('PATCH', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
};
