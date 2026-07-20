import { Outlet } from 'react-router';
import { AuthProvider } from '@/features/auth/context/AuthProvider.tsx';

export function AuthLayout() {
  return (
    <AuthProvider>
      <Outlet/>
    </AuthProvider>
  );
}
