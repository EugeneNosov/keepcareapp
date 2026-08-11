import type {
  InfiniteData,
  QueryClient,
  QueryKey,
} from '@tanstack/react-query';
import { resetTaskHistoryFeedToFirstPage } from '@/features/history/utils/history-cache.ts';
import { TASK_QUERY_KEYS } from '../task.constants.ts';
import type {
  Task,
  TaskHistoryResponse,
  TaskListItem,
} from '../types/tasks.types.ts';
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

async function resetHistoryToFirstPage<TResponse>(
  queryClient: QueryClient,
  historyQueryKey: QueryKey,
) {
  await queryClient.cancelQueries({queryKey: historyQueryKey, exact: true});

  queryClient.setQueryData<InfiniteData<TResponse, string | null>>(
    historyQueryKey,
    (history) => {
      if (!history || history.pages.length <= 1) {
        return history;
      }

      return {
        pages: history.pages.slice(0, 1),
        pageParams: history.pageParams.slice(0, 1),
      };
    },
  );

  return queryClient.invalidateQueries({queryKey: historyQueryKey});
}

function resetTaskHistoryToFirstPage(
  queryClient: QueryClient,
  taskId: string,
) {
  return resetHistoryToFirstPage<TaskHistoryResponse>(
    queryClient,
    TASK_QUERY_KEYS.history(taskId),
  );
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

  const invalidations = [
    resetTaskHistoryToFirstPage(queryClient, updatedTask.id),
    resetTaskHistoryFeedToFirstPage(queryClient),
  ];

  if (
    !previousTask
    || !replaceTaskInSummaryCache(queryClient, previousTask, updatedTaskListItem)
  ) {
    invalidations.push(
      queryClient.invalidateQueries({queryKey: TASK_QUERY_KEYS.summary}),
    );
  }

  await Promise.all(invalidations);
}
