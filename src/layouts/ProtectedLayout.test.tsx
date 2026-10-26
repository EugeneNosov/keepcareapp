// @vitest-environment jsdom

import '@/test/setup-dom.ts';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, test, vi } from 'vitest';
import { AuthContext, type AuthContextValue } from '@/features/auth/context/auth-context.ts';
import { ProtectedLayout } from './ProtectedLayout.tsx';

function createAuthValue(
  overrides: Partial<AuthContextValue> = {},
): AuthContextValue {
  return {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    login: vi.fn(),
    loginWithGoogle: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    ...overrides,
  };
}

describe('ProtectedLayout authentication guard', () => {
  test('does not render protected content before authentication is known', () => {
    render(
      <AuthContext value={createAuthValue()}>
        <MemoryRouter initialEntries={['/app/tasks']}>
          <Routes>
            <Route element={<ProtectedLayout/>} path="/app">
              <Route element={<div>Protected task content</div>} path="tasks"/>
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthContext>,
    );

    expect(screen.getByRole('status')).toHaveTextContent('Restoring session...');
    expect(screen.queryByText('Protected task content')).not.toBeInTheDocument();
  });
});
