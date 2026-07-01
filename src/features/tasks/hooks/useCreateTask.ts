import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask } from '../api/task.api.ts';
import { TASK_QUERY_KEYS } from '../task.constants.ts';

export default function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all }),
  });
}
