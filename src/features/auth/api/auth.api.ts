import { apiRequest } from '../../../shared/api';
import type {
  AuthResponse,
  GoogleAuthInput,
  LoginInput,
  RegisterInput,
  User,
} from '../types/auth.types';

export function login(input: LoginInput) {
  return apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: input,
  });
}

export function register(input: RegisterInput) {
  return apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: input,
  });
}

export function loginWithGoogle(input: GoogleAuthInput) {
  return apiRequest<AuthResponse>('/auth/google', {
    method: 'POST',
    body: input,
  });
}

export function refreshSession() {
  return apiRequest<AuthResponse>('/auth/refresh', {
    method: 'POST',
    skipAuthRefresh: true,
  });
}

export function logout() {
  return apiRequest<void>('/auth/logout', {
    method: 'POST',
  });
}

export function getCurrentUser() {
  return apiRequest<User>('/auth/me');
}
