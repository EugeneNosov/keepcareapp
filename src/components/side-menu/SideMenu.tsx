import { useState } from 'react';
import { LuHeartPulse, LuLogOut } from 'react-icons/lu';
import { NavLink, useNavigate } from 'react-router';
import { ROUTES } from '../../app.constants.ts';
import { useAuth } from '../../features/auth/hooks/useAuth';
import './SideMenu.css';
import { SIDE_MENU_CONFIG } from './side-menu.config';

export function SideMenu() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      await logout();
    } finally {
      navigate(ROUTES.login, { replace: true });
      setIsLoggingOut(false);
    }
  }

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

      <button
        className="side-menu__item side-menu__logout"
        disabled={isLoggingOut}
        onClick={handleLogout}
        type="button"
      >
        <LuLogOut aria-hidden="true"/>
        <span>{isLoggingOut ? 'Signing out...' : 'Logout'}</span>
      </button>
    </aside>
  );
}
