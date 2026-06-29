import { Outlet } from 'react-router'
import { SideMenu } from '../components/side-menu/SideMenu'

export function ProtectedLayout() {
  return (
    <div className="grid min-h-screen grid-cols-[218px_minmax(0,1fr)] max-[720px]:grid-cols-[68px_minmax(0,1fr)]">
      <SideMenu/>
      <main className="min-w-0 p-[clamp(24px,3vw,48px)] max-[720px]:px-4 max-[720px]:py-5">
        <Outlet/>
      </main>
    </div>
  )
}
