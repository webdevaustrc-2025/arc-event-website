import { toast } from 'sonner';
import { AdminApiResponse } from '../types/admin';

interface FetchOptions extends RequestInit {
  showToast?: boolean;
  errorMessage?: string;
  successMessage?: string;
}

class AdminFetchError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = 'AdminFetchError';
  }
}

export async function adminFetch<T = any>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const {
    showToast = true,
    errorMessage,
    successMessage,
    method = 'GET',
    headers = {},
    ...restOptions
  } = options;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      ...restOptions,
    });

    const data: AdminApiResponse<T> = await response.json();

    if (!response.ok) {
      const error = new AdminFetchError(
        response.status,
        data.error || 'UNKNOWN_ERROR',
        data.message || errorMessage || 'An error occurred'
      );

      if (showToast) {
        toast.error(error.message);
      }

      throw error;
    }

    if (showToast && successMessage) {
      toast.success(successMessage);
    }

    return data.data as T;
  } catch (error) {
    if (error instanceof AdminFetchError) {
      throw error;
    }

    const message = error instanceof Error ? error.message : 'Network error';
    if (showToast) {
      toast.error(errorMessage || message);
    }

    throw new AdminFetchError(500, 'NETWORK_ERROR', message);
  }
}

export async function adminGet<T = any>(
  url: string,
  options?: FetchOptions
): Promise<T> {
  return adminFetch<T>(url, { ...options, method: 'GET' });
}

export async function adminPost<T = any>(
  url: string,
  body: any,
  options?: FetchOptions
): Promise<T> {
  return adminFetch<T>(url, {
    ...options,
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function adminPut<T = any>(
  url: string,
  body: any,
  options?: FetchOptions
): Promise<T> {
  return adminFetch<T>(url, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export async function adminPatch<T = any>(
  url: string,
  body: any,
  options?: FetchOptions
): Promise<T> {
  return adminFetch<T>(url, {
    ...options,
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export async function adminDelete<T = any>(
  url: string,
  options?: FetchOptions
): Promise<T> {
  return adminFetch<T>(url, { ...options, method: 'DELETE' });
}
