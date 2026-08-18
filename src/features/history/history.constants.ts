import { TASK_HISTORY_EVENT_TYPES } from '@/shared/task-history/task-history.constants.ts';
import type { TaskHistoryFilters } from './types/history.types.ts';

export const HISTORY_DEFAULT_FILTERS: TaskHistoryFilters = {
  eventTypes: [...TASK_HISTORY_EVENT_TYPES],
  includeDeletedTasks: true,
};

export const HISTORY_PAGE_LIMIT = 20;
