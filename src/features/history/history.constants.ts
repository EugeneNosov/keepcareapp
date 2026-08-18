import type {
  TaskHistoryEventType,
  TaskHistoryFilters,
} from './types/history.types.ts';

export const HISTORY_EVENT_TYPES = [
  'task_completed',
  'task_updated',
  'task_deleted',
  'task_created',
] as const satisfies readonly TaskHistoryEventType[];

export const HISTORY_DEFAULT_FILTERS: TaskHistoryFilters = {
  eventTypes: [...HISTORY_EVENT_TYPES],
  includeDeletedTasks: true,
};

export const HISTORY_QUERY_KEYS = {
  all: ['tasks', 'history'] as const,
  feed: (filters: TaskHistoryFilters) => [
    ...HISTORY_QUERY_KEYS.all,
    {
      eventTypes: filters.eventTypes,
      includeDeletedTasks: filters.includeDeletedTasks,
    },
  ] as const,
};

export const HISTORY_PAGE_LIMIT = 20;
