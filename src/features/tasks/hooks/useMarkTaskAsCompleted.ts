import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markTaskAsCompleted } from '../api/task.api.ts';
import { TASK_QUERY_KEYS } from '../task.constants.ts';
import type { Task } from '../types/tasks.types.ts';

export default function useMarkTaskAsCompleted() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markTaskAsCompleted,
    onSuccess: async (updatedTask) => {
      await queryClient.cancelQueries({ queryKey: TASK_QUERY_KEYS.all });
      queryClient.setQueryData<Task[]>(
        TASK_QUERY_KEYS.all,
        (tasks) => tasks?.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        ) ?? [updatedTask],
      );
    },
  });
}
