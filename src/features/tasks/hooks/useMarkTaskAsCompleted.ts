import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markTaskAsCompleted } from '../api/task.api.ts';
import { syncUpdatedTaskCache } from '../utils/task-cache.ts';

export default function useMarkTaskAsCompleted() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markTaskAsCompleted,
    onSuccess: (updatedTask) => syncUpdatedTaskCache(queryClient, updatedTask),
  });
}
