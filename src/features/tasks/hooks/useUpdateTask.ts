import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTask } from '../api/task.api.ts';
import { TASK_QUERY_KEYS } from '../task.constants.ts';
import type { Task, UpdateTaskPayload } from '../types/tasks.types.ts';
import { replaceTaskInSummaryCache } from '../utils/task-summary-cache.ts';

interface UpdateTaskVariables {
  taskId: string;
  payload: UpdateTaskPayload;
}

export default function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({taskId, payload}: UpdateTaskVariables) => updateTask(taskId, payload),
    onSuccess: async (updatedTask) => {
      await Promise.all([
        queryClient.cancelQueries({queryKey: TASK_QUERY_KEYS.list}),
        queryClient.cancelQueries({queryKey: TASK_QUERY_KEYS.summary}),
      ]);

      const cachedTasks = queryClient.getQueryData<Task[]>(TASK_QUERY_KEYS.list);
      const previousTask = cachedTasks?.find((task) => task.id === updatedTask.id);

      queryClient.setQueryData<Task[]>(
        TASK_QUERY_KEYS.list,
        (tasks) => tasks?.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        ) ?? [updatedTask],
      );

      if (!previousTask || !replaceTaskInSummaryCache(queryClient, previousTask, updatedTask)) {
        await queryClient.invalidateQueries({queryKey: TASK_QUERY_KEYS.summary});
      }
    },
  });
}
