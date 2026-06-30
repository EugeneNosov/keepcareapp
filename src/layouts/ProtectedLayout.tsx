import { Navigate, Outlet, useLocation } from 'react-router';
import { SideMenu } from '../components/side-menu/SideMenu';
import { useAuth } from '../features/auth/hooks/useAuth';

export function ProtectedLayout() {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center text-[10px] tracking-[0.1em] text-[#a2a5a1] uppercase" role="status">
        Restoring session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="grid min-h-screen grid-cols-[218px_minmax(0,1fr)] max-[720px]:grid-cols-[68px_minmax(0,1fr)]">
      <SideMenu/>
      <main className="min-w-0 p-[clamp(24px,3vw,48px)] max-[720px]:px-4 max-[720px]:py-5">
        <Outlet/>
      </main>
    </div>
  );
}
