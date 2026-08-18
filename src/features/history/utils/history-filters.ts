import { TASK_HISTORY_EVENT_TYPES } from '@/shared/task-history/task-history.constants.ts';
import type { TaskHistoryFilters } from '../types/history.types.ts';

export function hasActiveTaskHistoryFilters(
  filters: TaskHistoryFilters,
): boolean {
  return (
    filters.eventTypes.length !== TASK_HISTORY_EVENT_TYPES.length
    || !filters.includeDeletedTasks
  );
}
