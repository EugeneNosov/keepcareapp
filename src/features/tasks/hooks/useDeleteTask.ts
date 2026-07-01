import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeTask } from '../api/task.api.ts';
import { TASK_QUERY_KEYS } from '../task.constants.ts';
import type { Task } from '../types/tasks.types.ts';

export default function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeTask,
    onSuccess: async (_, deletedTaskId) => {
      await queryClient.cancelQueries({ queryKey: TASK_QUERY_KEYS.all });
      queryClient.setQueryData<Task[]>(
        TASK_QUERY_KEYS.all,
        (tasks) => tasks?.filter((task) => task.id !== deletedTaskId) ?? [],
      );
    },
  });
}
