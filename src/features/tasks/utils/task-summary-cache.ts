import type { QueryClient } from '@tanstack/react-query';
import { TASK_QUERY_KEYS, TASK_STATUS } from '../task.constants.ts';
import type {
  TaskListItem,
  TaskStatus,
  TaskSummary,
} from '../types/tasks.types.ts';

type TaskSummaryCountKey = 'scheduledCount' | 'overdueCount' | 'dueSoonCount' | 'okCount';

const TASK_SUMMARY_COUNT_KEYS: Record<TaskStatus, TaskSummaryCountKey> = {
  [TASK_STATUS.scheduled]: 'scheduledCount',
  [TASK_STATUS.overdue]: 'overdueCount',
  [TASK_STATUS.dueSoon]: 'dueSoonCount',
  [TASK_STATUS.ok]: 'okCount',
};

function updateSummaryCount(
  summary: TaskSummary,
  status: TaskStatus,
  difference: number,
) {
  const countKey = TASK_SUMMARY_COUNT_KEYS[status];

  return {
    ...summary,
    [countKey]: Math.max(0, summary[countKey] + difference),
  };
}

function updateTaskSummaryCache(
  queryClient: QueryClient,
  updater: (summary: TaskSummary) => TaskSummary,
) {
  const cachedSummary = queryClient.getQueryData<TaskSummary>(
    TASK_QUERY_KEYS.summary,
  );

  if (!cachedSummary) {
    return false;
  }

  queryClient.setQueryData<TaskSummary>(
    TASK_QUERY_KEYS.summary,
    updater(cachedSummary),
  );

  return true;
}

export function addTaskToSummaryCache(queryClient: QueryClient, task: TaskListItem) {
  return updateTaskSummaryCache(queryClient, (summary) => ({
    ...updateSummaryCount(summary, task.status, 1),
    allCount: summary.allCount + 1,
  }));
}

export function replaceTaskInSummaryCache(
  queryClient: QueryClient,
  previousTask: TaskListItem,
  updatedTask: TaskListItem,
) {
  return updateTaskSummaryCache(
    queryClient,
    (summary) => updateSummaryCount(
      updateSummaryCount(summary, previousTask.status, -1),
      updatedTask.status,
      1,
    ),
  );
}

export function removeTaskFromSummaryCache(queryClient: QueryClient, task: TaskListItem) {
  return updateTaskSummaryCache(queryClient, (summary) => ({
    ...updateSummaryCount(summary, task.status, -1),
    allCount: Math.max(0, summary.allCount - 1),
  }));
}
