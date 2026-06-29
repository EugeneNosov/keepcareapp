export const TASK_STATUS = {
  overdue: 'overdue',
  dueSoon: 'due_soon',
  ok: 'ok',
} as const;
export const TASK_STATUSES = Object.values(TASK_STATUS);
export const TASK_REPEAT_UNITS = ['days', 'weeks', 'months'] as const;
export const TASK_QUERY_KEYS = {
  all: ['tasks'] as const,
}
export const TASKS_STORAGE_KEY = 'tasks';
