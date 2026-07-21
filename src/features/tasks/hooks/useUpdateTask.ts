import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTask } from '../api/task.api.ts';
import type { UpdateTaskPayload } from '../types/tasks.types.ts';
import { syncUpdatedTaskCache } from '../utils/task-cache.ts';

interface UpdateTaskVariables {
  taskId: string;
  payload: UpdateTaskPayload;
}

export default function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({taskId, payload}: UpdateTaskVariables) => updateTask(taskId, payload),
    onSuccess: (updatedTask) => syncUpdatedTaskCache(queryClient, updatedTask),
  });
}
