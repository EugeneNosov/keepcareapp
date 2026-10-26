// @vitest-environment jsdom

import '@/test/setup-dom.ts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  act,
  renderHook,
  waitFor,
} from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import {
  login as loginRequest,
  logout as logoutRequest,
  refreshSession,
} from '../api/auth.api.ts';
import { useAuth } from '../hooks/useAuth.ts';
import type { AuthResponse } from '../types/auth.types.ts';
import { AuthProvider } from './AuthProvider.tsx';

vi.mock('../api/auth.api.ts', () => ({
  login: vi.fn(),
  loginWithGoogle: vi.fn(),
  logout: vi.fn(),
  refreshSession: vi.fn(),
  register: vi.fn(),
}));

const authenticatedResponse: AuthResponse = {
  accessToken: 'access-token',
  user: {
    id: 'user-1',
    email: 'alex@example.com',
    displayName: 'Alex',
    emailVerifiedAt: null,
    timezone: 'Europe/Prague',
    createdAt: '2026-01-01T10:00:00.000Z',
    updatedAt: '2026-01-01T10:00:00.000Z',
  },
};

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {retry: false},
      mutations: {retry: false},
    },
  });
}

function createWrapper(queryClient: QueryClient) {
  return function AuthTestWrapper({children}: PropsWithChildren) {
    return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    );
  };
}

describe('AuthProvider', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('exposes the initial loading state while session restoration is pending', async () => {
    let resolveSession!: (response: AuthResponse) => void;
    const pendingSession = new Promise<AuthResponse>((resolve) => {
      resolveSession = resolve;
    });
    vi.mocked(refreshSession).mockReturnValue(pendingSession);
    const {result} = renderHook(() => useAuth(), {
      wrapper: createWrapper(createQueryClient()),
    });

    expect(result.current).toMatchObject({
      user: null,
      isAuthenticated: false,
      isLoading: true,
    });

    resolveSession(authenticatedResponse);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
  });

  test('becomes authenticated after login', async () => {
    vi.mocked(refreshSession).mockRejectedValue(new Error('No active session'));
    vi.mocked(loginRequest).mockResolvedValue(authenticatedResponse);
    const {result} = renderHook(() => useAuth(), {
      wrapper: createWrapper(createQueryClient()),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(() => result.current.login({
      email: 'alex@example.com',
      password: 'correct-password',
    }));

    expect(result.current).toMatchObject({
      user: authenticatedResponse.user,
      isAuthenticated: true,
      isLoading: false,
    });
  });

  test('clears local authentication and cached server data after logout', async () => {
    vi.mocked(refreshSession).mockResolvedValue(authenticatedResponse);
    vi.mocked(logoutRequest).mockRejectedValue(new TypeError('Failed to fetch'));
    const queryClient = createQueryClient();
    queryClient.setQueryData(['tasks', 'list'], [{id: 'task-1'}]);
    const {result} = renderHook(() => useAuth(), {
      wrapper: createWrapper(queryClient),
    });
    await waitFor(() => expect(result.current.isAuthenticated).toBe(true));

    await act(() => result.current.logout());

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(queryClient.getQueryData(['tasks', 'list'])).toBeUndefined();
  });

  test('finishes unauthenticated and clears cached data when restoration fails', async () => {
    vi.mocked(refreshSession).mockRejectedValue(new Error('Session expired'));
    const queryClient = createQueryClient();
    const clearCache = vi.spyOn(queryClient, 'clear');
    queryClient.setQueryData(['tasks', 'list'], [{id: 'task-1'}]);
    const {result} = renderHook(() => useAuth(), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(clearCache).toHaveBeenCalledOnce();
    expect(queryClient.getQueryData(['tasks', 'list'])).toBeUndefined();
  });
});
