import { Outlet } from 'react-router'
import { SideMenu } from '../components/SideMenu'

export function ProtectedLayout() {
  return (
    <div className="protected-layout">
      <SideMenu/>
      <main className="protected-layout__content">
        <Outlet/>
      </main>
    </div>
  )
}
