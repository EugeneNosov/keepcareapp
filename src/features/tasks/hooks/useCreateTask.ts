import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask } from '../api/task.api.ts';
import { TASK_QUERY_KEYS } from '../task.constants.ts';
import type { Task } from '../types/tasks.types.ts';

export default function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: async (createdTask) => {
      await queryClient.cancelQueries({ queryKey: TASK_QUERY_KEYS.all });

      const cachedTasks = queryClient.getQueryData<Task[]>(TASK_QUERY_KEYS.all);

      if (!cachedTasks) {
        await queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all });
        return;
      }

      queryClient.setQueryData<Task[]>(
        TASK_QUERY_KEYS.all,
        [
          createdTask,
          ...cachedTasks.filter((task) => task.id !== createdTask.id),
        ],
      );
    },
  });
}
