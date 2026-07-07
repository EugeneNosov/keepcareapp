import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeTask } from '../api/task.api.ts';
import { TASK_QUERY_KEYS } from '../task.constants.ts';
import type { Task } from '../types/tasks.types.ts';
import { removeTaskFromSummaryCache } from '../utils/task-summary-cache.ts';

export default function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeTask,
    onSuccess: async (_, deletedTaskId) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: TASK_QUERY_KEYS.list }),
        queryClient.cancelQueries({ queryKey: TASK_QUERY_KEYS.summary }),
      ]);

      const cachedTasks = queryClient.getQueryData<Task[]>(TASK_QUERY_KEYS.list);
      const deletedTask = cachedTasks?.find((task) => task.id === deletedTaskId);

      queryClient.setQueryData<Task[]>(
        TASK_QUERY_KEYS.list,
        (tasks) => tasks?.filter((task) => task.id !== deletedTaskId) ?? [],
      );

      if (!deletedTask || !removeTaskFromSummaryCache(queryClient, deletedTask)) {
        await queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.summary });
      }
    },
  });
}
