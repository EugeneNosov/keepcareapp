import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import {
  getTaskDetails,
  getTaskHistory,
  getTasks,
  getTaskSummary,
} from './api/task.api.ts';
import { TASK_HISTORY_PAGE_LIMIT, TASK_QUERY_KEYS } from './task.constants.ts';

export function taskListQueryOptions() {
  return queryOptions({
    queryKey: TASK_QUERY_KEYS.list,
    queryFn: ({signal}) => getTasks(signal),
  });
}

export function taskDetailsQueryOptions(taskId: string) {
  return queryOptions({
    queryKey: TASK_QUERY_KEYS.detail(taskId),
    queryFn: ({signal}) => getTaskDetails(taskId, signal),
  });
}

export function taskHistoryQueryOptions(taskId: string) {
  return infiniteQueryOptions({
    queryKey: TASK_QUERY_KEYS.history(taskId),
    refetchOnWindowFocus: false,
    queryFn: ({pageParam, signal}) => getTaskHistory(
      taskId,
      {
        limit: TASK_HISTORY_PAGE_LIMIT,
        cursor: pageParam ?? undefined,
      },
      signal,
    ),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => (
      lastPage.meta.pagination.hasMore
        ? lastPage.meta.pagination.nextCursor ?? undefined
        : undefined
    ),
  });
}

export function taskSummaryQueryOptions() {
  return queryOptions({
    queryKey: TASK_QUERY_KEYS.summary,
    queryFn: ({signal}) => getTaskSummary(signal),
  });
}
