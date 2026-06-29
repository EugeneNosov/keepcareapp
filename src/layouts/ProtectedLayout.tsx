import { Outlet } from 'react-router'
import { SideMenu } from '../components/side-menu/SideMenu'

export function ProtectedLayout() {
  return (
    <div className="grid min-h-screen grid-cols-[248px_minmax(0,1fr)] max-[720px]:grid-cols-[76px_minmax(0,1fr)]">
      <SideMenu/>
      <main className="min-w-0 p-[clamp(32px,5vw,72px)] max-[720px]:px-5 max-[720px]:py-7">
        <Outlet/>
      </main>
    </div>
  )
}
