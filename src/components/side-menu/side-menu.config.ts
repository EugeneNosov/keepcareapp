import { LuBell, LuListTodo, LuSettings } from 'react-icons/lu'
import type { IconType } from 'react-icons'
import { ROUTES } from '@/app.constants.ts';

type MenuItem = {
  label: string
  path: string
  icon: IconType
}

export const SIDE_MENU_CONFIG: MenuItem[] = [
  {
    label: 'Tasks',
    path: ROUTES.tasks,
    icon: LuListTodo,
  },
  {
    label: 'Notifications',
    path: ROUTES.notifications,
    icon: LuBell,
  },
  {
    label: 'Settings',
    path: ROUTES.settings,
    icon: LuSettings,
  },
]
