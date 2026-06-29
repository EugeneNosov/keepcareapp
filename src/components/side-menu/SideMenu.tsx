import { LuHeartPulse } from 'react-icons/lu'
import { NavLink } from 'react-router'
import './SideMenu.css'
import { SIDE_MENU_CONFIG } from './side-menu.config'

export function SideMenu() {
  return (
    <aside className="side-menu" aria-label="Main navigation">
      <div className="side-menu__brand" aria-label="KeepCare">
        <span className="side-menu__brand-mark">
          <LuHeartPulse aria-hidden="true"/>
        </span>
        <span className="side-menu__brand-name">KeepCare</span>
      </div>

      <nav className="side-menu__nav">
        {SIDE_MENU_CONFIG.map(({label, path, icon: Icon}) => (
          <NavLink
            key={path}
            to={path}
            className={({isActive}) =>
              `side-menu__item${isActive ? ' side-menu__item--active' : ''}`
            }
          >
            <Icon aria-hidden="true"/>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
