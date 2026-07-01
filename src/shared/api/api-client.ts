import { ApiError } from './api-error';

const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '');

if (!apiUrl) {
  throw new Error('VITE_API_URL is not configured');
}

let accessToken: string | null = null;
let refreshHandler: (() => Promise<string>) | null = null;
let unauthorizedHandler: (() => void) | null = null;
let pendingTokenRefresh: Promise<string> | null = null;

export function setApiAccessToken(token: string | null) {
  accessToken = token;
}

export function setApiRefreshHandler(handler: (() => Promise<string>) | null) {
  refreshHandler = handler;
}

export function setApiUnauthorizedHandler(handler: (() => void) | null) {
  unauthorizedHandler = handler;
}

type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  skipAuthRefresh?: boolean;
};

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  return executeRequest<T>(path, options, true);
}

async function executeRequest<T>(
  path: string,
  options: ApiRequestOptions,
  canRetryAfterRefresh: boolean,
): Promise<T> {
  const {
    body,
    skipAuthRefresh = false,
    ...requestOptions
  } = options;
  const headers = new Headers(requestOptions.headers);

  headers.set('Accept', 'application/json');

  if (body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const response = await fetch(`${apiUrl}/${path.replace(/^\//, '')}`, {
    ...requestOptions,
    headers,
    credentials: 'include',
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (response.status === 401 && accessToken && !skipAuthRefresh) {
    if (refreshHandler && canRetryAfterRefresh) {
      await refreshAccessToken();
      return executeRequest<T>(path, options, false);
    }

    if (!canRetryAfterRefresh) {
      unauthorizedHandler?.();
    }
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = await parseResponse(response);

  if (!response.ok) {
    throw ApiError.fromResponse(response.status, payload);
  }

  return payload as T;
}

function refreshAccessToken(): Promise<string> {
  if (!refreshHandler) {
    return Promise.reject(new Error('No authentication refresh handler is configured'));
  }

  if (!pendingTokenRefresh) {
    pendingTokenRefresh = refreshHandler()
      .then((token) => {
        accessToken = token;
        return token;
      })
      .finally(() => {
        pendingTokenRefresh = null;
      });
  }

  return pendingTokenRefresh;
}

async function parseResponse(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type');

  if (contentType?.includes('application/json')) {
    return response.json();
  }

  const text = await response.text();
  return text || null;
}
