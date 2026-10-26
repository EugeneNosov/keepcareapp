import { TASK_HISTORY_EVENT_TYPES } from '@/shared/task-history/task-history.constants.ts';
import type { TaskHistoryFilters } from '../types/history.types.ts';

export function hasActiveTaskHistoryFilters(
  filters: TaskHistoryFilters,
): boolean {
  const includesEveryEventType = TASK_HISTORY_EVENT_TYPES.every(
    (eventType) => filters.eventTypes.includes(eventType),
  );

  return (
    !includesEveryEventType
    || !filters.includeDeletedTasks
  );
}
