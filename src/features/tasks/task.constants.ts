import type { IconType } from 'react-icons';
import {
  LuCalendarClock,
  LuCircleCheck,
  LuClock3,
  LuTriangleAlert,
} from 'react-icons/lu';

export const TASK_STATUS = {
  scheduled: 'scheduled',
  overdue: 'overdue',
  dueSoon: 'due_soon',
  ok: 'ok',
} as const;
export const TASK_STATUSES = Object.values(TASK_STATUS);
export const TASK_REPEAT_UNITS = ['days', 'weeks', 'months'] as const;
export const TASK_QUERY_KEYS = {
  all: ['tasks'] as const,
  list: ['tasks', 'list'] as const,
  detail: (taskId: string) => ['tasks', 'detail', taskId] as const,
  summary: ['tasks', 'summary'] as const,
};

type TaskStatus = typeof TASK_STATUS[keyof typeof TASK_STATUS];

export const TASK_STATUS_STYLES: Record<
  TaskStatus,
  { label: string; color: string; icon: IconType }
> = {
  [TASK_STATUS.scheduled]: {
    label: 'SCHEDULED',
    color: 'var(--app-color-primary)',
    icon: LuCalendarClock,
  },
  [TASK_STATUS.overdue]: {
    label: 'OVERDUE',
    color: 'var(--app-color-danger)',
    icon: LuTriangleAlert,
  },
  [TASK_STATUS.dueSoon]: {
    label: 'DUE SOON',
    color: 'var(--app-color-warning)',
    icon: LuClock3,
  },
  [TASK_STATUS.ok]: {
    label: 'OK',
    color: 'var(--app-color-success)',
    icon: LuCircleCheck,
  },
};
