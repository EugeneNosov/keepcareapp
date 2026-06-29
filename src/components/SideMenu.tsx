import {
  LuBell,
  LuHeartPulse,
  LuListTodo,
  LuSettings,
} from 'react-icons/lu'
import { NavLink } from 'react-router'

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
        <NavLink
          to="/tasks"
          className={({isActive}) =>
            `side-menu__item${isActive ? ' side-menu__item--active' : ''}`
          }
        >
          <LuListTodo aria-hidden="true"/>
          <span>Tasks</span>
        </NavLink>

        <NavLink
          to="/notifications"
          className={({isActive}) =>
            `side-menu__item${isActive ? ' side-menu__item--active' : ''}`
          }
        >
          <LuBell aria-hidden="true"/>
          <span>Notifications</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({isActive}) =>
            `side-menu__item${isActive ? ' side-menu__item--active' : ''}`
          }
        >
          <LuSettings aria-hidden="true"/>
          <span>Settings</span>
        </NavLink>
      </nav>

      <p className="side-menu__status">
        <span aria-hidden="true"/>
        System online
      </p>
    </aside>
  )
}
