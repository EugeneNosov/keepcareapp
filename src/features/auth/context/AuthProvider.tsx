import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  setApiAccessToken,
  setApiRefreshHandler,
  setApiUnauthorizedHandler,
} from '../../../shared/api';
import {
  login as loginRequest,
  logout as logoutRequest,
  refreshSession,
  register as registerRequest,
} from '../api/auth.api';
import type {
  AuthResponse,
  LoginInput,
  RegisterInput,
  User,
} from '../types/auth.types';
import { AuthContext, type AuthContextValue } from './auth-context';

let pendingSessionRefresh: Promise<AuthResponse> | null = null;

function restoreSession() {
  if (!pendingSessionRefresh) {
    pendingSessionRefresh = refreshSession().finally(() => {
      pendingSessionRefresh = null;
    });
  }

  return pendingSessionRefresh;
}

export function AuthProvider({children}: PropsWithChildren) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const applyAuthentication = useCallback((response: AuthResponse) => {
    setApiAccessToken(response.accessToken);
    setUser(response.user);
  }, []);

  const clearAuthentication = useCallback(() => {
    setApiAccessToken(null);
    setUser(null);
  }, []);

  const refreshAuthentication = useCallback(async () => {
    try {
      const response = await refreshSession();
      applyAuthentication(response);
      return response.accessToken;
    } catch (error) {
      clearAuthentication();
      queryClient.clear();
      throw error;
    }
  }, [applyAuthentication, clearAuthentication, queryClient]);

  const handleUnauthorized = useCallback(() => {
    clearAuthentication();
    queryClient.clear();
  }, [clearAuthentication, queryClient]);

  useEffect(() => {
    let isActive = true;

    setApiRefreshHandler(refreshAuthentication);
    setApiUnauthorizedHandler(handleUnauthorized);

    restoreSession()
      .then((response) => {
        if (isActive) {
          applyAuthentication(response);
        }
      })
      .catch(() => {
        if (isActive) {
          clearAuthentication();
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
      setApiRefreshHandler(null);
      setApiUnauthorizedHandler(null);
    };
  }, [
    applyAuthentication,
    clearAuthentication,
    handleUnauthorized,
    refreshAuthentication,
  ]);

  const login = useCallback(
    async (input: LoginInput) => {
      applyAuthentication(await loginRequest(input));
    },
    [applyAuthentication],
  );

  const register = useCallback(
    async (input: RegisterInput) => {
      applyAuthentication(await registerRequest(input));
    },
    [applyAuthentication],
  );

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } catch {
      // Local authentication must still be cleared if the server is unavailable.
    } finally {
      clearAuthentication();
      queryClient.clear();
    }
  }, [clearAuthentication, queryClient]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isLoading,
      login,
      register,
      logout,
    }),
    [isLoading, login, logout, register, user],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
