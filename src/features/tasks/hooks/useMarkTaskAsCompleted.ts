import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markTaskAsCompleted } from '../api/task.api.ts';
import { TASK_QUERY_KEYS } from '../task.constants.ts';
import type { Task } from '../types/tasks.types.ts';
import { replaceTaskInSummaryCache } from '../utils/task-summary-cache.ts';

export default function useMarkTaskAsCompleted() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markTaskAsCompleted,
    onSuccess: async (updatedTask) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: TASK_QUERY_KEYS.list }),
        queryClient.cancelQueries({ queryKey: TASK_QUERY_KEYS.summary }),
      ]);

      const cachedTasks = queryClient.getQueryData<Task[]>(TASK_QUERY_KEYS.list);
      const previousTask = cachedTasks?.find((task) => task.id === updatedTask.id);

      queryClient.setQueryData<Task[]>(
        TASK_QUERY_KEYS.list,
        (tasks) => tasks?.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        ) ?? [updatedTask],
      );

      if (!previousTask || !replaceTaskInSummaryCache(queryClient, previousTask, updatedTask)) {
        await queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.summary });
      }
    },
  });
}
