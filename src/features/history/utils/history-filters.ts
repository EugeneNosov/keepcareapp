import { HISTORY_EVENT_TYPES } from '../history.constants.ts';
import type { TaskHistoryFilters } from '../types/history.types.ts';

export function hasActiveTaskHistoryFilters(
  filters: TaskHistoryFilters,
): boolean {
  return (
    filters.eventTypes.length !== HISTORY_EVENT_TYPES.length
    || !filters.includeDeletedTasks
  );
}
