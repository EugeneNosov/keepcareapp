import type { QueryClient } from '@tanstack/react-query';
import { TASK_QUERY_KEYS } from '../task.constants.ts';
import type { Task, TaskListItem } from '../types/tasks.types.ts';
import { replaceTaskInSummaryCache } from './task-summary-cache.ts';

export function toTaskListItem(task: Task): TaskListItem {
  return {
    id: task.id,
    name: task.name,
    status: task.status,
    repeatEvery: task.repeatEvery,
    createdAt: task.createdAt,
    startsAt: task.startsAt,
    lastCompletedAt: task.lastCompletedAt,
    dueDate: task.dueDate,
  };
}

export async function cancelTaskCacheQueries(
  queryClient: QueryClient,
  taskId: string,
) {
  await Promise.all([
    queryClient.cancelQueries({queryKey: TASK_QUERY_KEYS.list}),
    queryClient.cancelQueries({queryKey: TASK_QUERY_KEYS.detail(taskId)}),
    queryClient.cancelQueries({queryKey: TASK_QUERY_KEYS.summary}),
  ]);
}

export async function syncUpdatedTaskCache(
  queryClient: QueryClient,
  updatedTask: Task,
) {
  await cancelTaskCacheQueries(queryClient, updatedTask.id);

  const cachedTasks = queryClient.getQueryData<TaskListItem[]>(TASK_QUERY_KEYS.list);
  const previousTask = cachedTasks?.find((task) => task.id === updatedTask.id);
  const updatedTaskListItem = toTaskListItem(updatedTask);

  queryClient.setQueryData(TASK_QUERY_KEYS.detail(updatedTask.id), updatedTask);
  queryClient.setQueryData<TaskListItem[]>(
    TASK_QUERY_KEYS.list,
    (tasks) => tasks?.map((task) =>
      task.id === updatedTask.id ? updatedTaskListItem : task
    ) ?? [updatedTaskListItem],
  );

  if (
    !previousTask
    || !replaceTaskInSummaryCache(queryClient, previousTask, updatedTaskListItem)
  ) {
    await queryClient.invalidateQueries({queryKey: TASK_QUERY_KEYS.summary});
  }
}
