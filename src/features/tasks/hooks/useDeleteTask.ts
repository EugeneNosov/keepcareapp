import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeTask } from '../api/task.api.ts';
import { syncDeletedTaskCache } from '../utils/task-cache.ts';

export default function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeTask,
    onSuccess: (_, {taskId}) => syncDeletedTaskCache(queryClient, taskId),
  });
}
