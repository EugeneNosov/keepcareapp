import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask } from '../api/task.api.ts';
import { TASK_QUERY_KEYS } from '../task.constants.ts';
import type { Task } from '../types/tasks.types.ts';
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

      const cachedTasks = queryClient.getQueryData<Task[]>(TASK_QUERY_KEYS.list);

      if (!cachedTasks) {
        await queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.list });
      } else {
        queryClient.setQueryData<Task[]>(
          TASK_QUERY_KEYS.list,
          [
            createdTask,
            ...cachedTasks.filter((task) => task.id !== createdTask.id),
          ],
        );
      }

      if (!addTaskToSummaryCache(queryClient, createdTask)) {
        await queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.summary });
      }
    },
  });
}
