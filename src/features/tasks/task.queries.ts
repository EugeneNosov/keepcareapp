import { queryOptions } from '@tanstack/react-query';
import {
  getTaskDetails,
  getTasks,
  getTaskSummary,
} from './api/task.api.ts';
import { TASK_QUERY_KEYS } from './task.constants.ts';

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

export function taskSummaryQueryOptions() {
  return queryOptions({
    queryKey: TASK_QUERY_KEYS.summary,
    queryFn: ({signal}) => getTaskSummary(signal),
  });
}
