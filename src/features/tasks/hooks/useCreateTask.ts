import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resetTaskHistoryFeedToFirstPage } from '@/features/history/utils/history-cache.ts';
import { createTask } from '../api/task.api.ts';
import { TASK_QUERY_KEYS } from '../task.constants.ts';
import type { TaskListItem } from '../types/tasks.types.ts';
import { toTaskListItem } from '../utils/task-cache.ts';
import { addTaskToSummaryCache } from '../utils/task-summary-cache.ts';

export default function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: async (createdTask) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: TASK_QUERY_KEYS.list }),
        queryClient.cancelQueries({ queryKey: TASK_QUERY_KEYS.summary }),
      ]);

      const cachedTasks = queryClient.getQueryData<TaskListItem[]>(TASK_QUERY_KEYS.list);
      const createdTaskListItem = toTaskListItem(createdTask);

      queryClient.setQueryData(TASK_QUERY_KEYS.detail(createdTask.id), createdTask);

      if (!cachedTasks) {
        await queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.list });
      } else {
        queryClient.setQueryData<TaskListItem[]>(
          TASK_QUERY_KEYS.list,
          [
            createdTaskListItem,
            ...cachedTasks.filter((task) => task.id !== createdTask.id),
          ],
        );
      }

      if (!addTaskToSummaryCache(queryClient, createdTaskListItem)) {
        await queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.summary });
      }

      await resetTaskHistoryFeedToFirstPage(queryClient);
    },
  });
}
