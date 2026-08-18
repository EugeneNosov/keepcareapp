import type {
  TaskHistoryEventType,
  TaskHistoryFilters,
} from './task-history.types.ts';

export const TASK_HISTORY_EVENT_TYPES = [
  'task_completed',
  'task_updated',
  'task_deleted',
  'task_created',
] as const satisfies readonly TaskHistoryEventType[];

export const TASK_HISTORY_FEED_QUERY_KEYS = {
  all: ['tasks', 'history'] as const,
  feed: (filters: TaskHistoryFilters) => [
    ...TASK_HISTORY_FEED_QUERY_KEYS.all,
    {
      eventTypes: filters.eventTypes,
      includeDeletedTasks: filters.includeDeletedTasks,
    },
  ] as const,
};
