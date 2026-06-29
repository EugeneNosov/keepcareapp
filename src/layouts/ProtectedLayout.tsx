import { Outlet } from 'react-router'

export function ProtectedLayout() {
  return (
    <main>
      <Outlet />
    </main>
  )
}
