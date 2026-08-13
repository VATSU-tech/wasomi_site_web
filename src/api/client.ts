import { env } from "@/config/env";
import { authStore } from "@/store/auth-store";
import { ApiError, ApiErrorResponse, ApiResponse } from "@/types/api";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

let csrfToken: string | null = null;
let isRefreshing = false;
let refreshSubscribers: ((success: boolean) => void)[] = [];

function onRefreshed(success: boolean) {
  refreshSubscribers.forEach((cb) => cb(success));
  refreshSubscribers = [];
}

export function setCsrfToken(token: string | null) {
  csrfToken = token;
}

export function getCsrfToken(): string | null {
  return csrfToken;
}

export async function fetchCsrfToken(): Promise<string | null> {
  try {
    const res = await fetch(`${env.apiBaseUrl}/auth/csrf`, {
      method: "GET",
      credentials: "include",
    });
    if (res.ok) {
      const json = await res.json();
      const token =
        json?.data?.csrfToken ??
        json?.data?.csrf_token ??
        json?.data?.token ??
        json?.csrfToken ??
        json?.token;
      if (typeof token === "string") {
        csrfToken = token;
        return token;
      }
    }
  } catch {
    // Ignore CSRF fetch network errors
  }
  return csrfToken;
}

async function performRefresh(): Promise<boolean> {
  if (isRefreshing) {
    return new Promise<boolean>((resolve) => {
      refreshSubscribers.push(resolve);
    });
  }

  isRefreshing = true;
  try {
    const response = await fetch(`${env.apiBaseUrl}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      isRefreshing = false;
      onRefreshed(true);
      // Fetch fresh CSRF after successful refresh
      await fetchCsrfToken();
      return true;
    } else {
      isRefreshing = false;
      onRefreshed(false);
      authStore.clear();
      return false;
    }
  } catch {
    isRefreshing = false;
    onRefreshed(false);
    authStore.clear();
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

  const isMutation = ["POST", "PUT", "PATCH", "DELETE"].includes(method);
  const isAuthBypassPath = ["/auth/login", "/auth/csrf", "/auth/refresh", "/auth/logout"].includes(path);

  // Obtain CSRF token for mutations if missing
  if (isMutation && !isAuthBypassPath && !csrfToken) {
    await fetchCsrfToken();
  }

  const headers: Record<string, string> = {};

  if (isMutation && csrfToken) {
    headers["X-CSRF-Token"] = csrfToken;
  }

  let requestBody: BodyInit | undefined = undefined;
  if (body !== undefined) {
    if (body instanceof FormData) {
      requestBody = body;
    } else {
      headers["Content-Type"] = "application/json";
      requestBody = JSON.stringify(body);
    }
  }

  try {
    const response = await fetch(`${env.apiBaseUrl}${path}`, {
      method,
      headers,
      body: requestBody,
      credentials: "include",
      signal: controller.signal,
    });

    // Check for CSRF header in response
    const newCsrf = response.headers.get("X-CSRF-Token");
    if (newCsrf) {
      csrfToken = newCsrf;
    }

    if (!response.ok) {
      let errorPayload: ApiErrorResponse | null = null;
      try {
        errorPayload = (await response.json()) as ApiErrorResponse;
      } catch {
        errorPayload = null;
      }

      // Handle 401 Unauthorized
      if (response.status === 401) {
        if (!isAuthBypassPath && !isRetry) {
          const refreshed = await performRefresh();
          if (refreshed) {
            return request<T>(method, path, body, true);
          }
        }
        authStore.clear();
      }

      const message =
        errorPayload?.error?.message ??
        (response.status === 401
          ? "Session expirée ou non autorisée."
          : response.status === 403
          ? "Accès refusé."
          : response.status === 404
          ? "Ressource introuvable."
          : `Erreur serveur (${response.status})`);

      const code =
        errorPayload?.error?.code ??
        (response.status === 401
          ? "UNAUTHENTICATED"
          : response.status === 403
          ? "FORBIDDEN"
          : response.status === 404
          ? "NOT_FOUND"
          : "INTERNAL_ERROR");

      throw new ApiError(
        message,
        response.status,
        code,
        errorPayload?.error?.fields,
        errorPayload?.meta?.requestId,
      );
    }

    if (response.status === 204) {
      return { data: null } as unknown as T;
    }

    const data = (await response.json()) as T;
    return data;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError("Délai d’attente dépassé (timeout).", 408, "TIMEOUT");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export const apiClient = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
  put: <T>(path: string, body?: unknown) => request<T>("PUT", path, body),
  patch: <T>(path: string, body?: unknown) => request<T>("PATCH", path, body),
  delete: <T>(path: string) => request<T>("DELETE", path),
};
