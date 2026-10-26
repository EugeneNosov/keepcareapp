import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask } from '../api/task.api.ts';
import { syncCreatedTaskCache } from '../utils/task-cache.ts';

export default function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: (createdTask) => syncCreatedTaskCache(queryClient, createdTask),
  });
}
