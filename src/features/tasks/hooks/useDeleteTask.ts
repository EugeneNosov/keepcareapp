import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resetTaskHistoryFeedToFirstPage } from '@/features/history/utils/history-cache.ts';
import { removeTask } from '../api/task.api.ts';
import { TASK_QUERY_KEYS } from '../task.constants.ts';
import type { TaskListItem } from '../types/tasks.types.ts';
import { cancelTaskCacheQueries } from '../utils/task-cache.ts';
import { removeTaskFromSummaryCache } from '../utils/task-summary-cache.ts';

export default function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeTask,
    onSuccess: async (_, {taskId: deletedTaskId}) => {
      await cancelTaskCacheQueries(queryClient, deletedTaskId);

      const cachedTasks = queryClient.getQueryData<TaskListItem[]>(TASK_QUERY_KEYS.list);
      const deletedTask = cachedTasks?.find((task) => task.id === deletedTaskId);

      queryClient.removeQueries({
        queryKey: TASK_QUERY_KEYS.detail(deletedTaskId),
        exact: true,
      });
      queryClient.setQueryData<TaskListItem[]>(
        TASK_QUERY_KEYS.list,
        (tasks) => tasks?.filter((task) => task.id !== deletedTaskId) ?? [],
      );

      if (!deletedTask || !removeTaskFromSummaryCache(queryClient, deletedTask)) {
        await queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.summary });
      }

      await resetTaskHistoryFeedToFirstPage(queryClient);
    },
  });
}
