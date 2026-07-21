import { useQuery } from '@tanstack/react-query';
import { ApiError } from '@/shared/api';
import { getTaskDetails } from '../api/task.api.ts';
import { TASK_QUERY_KEYS } from '../task.constants.ts';

export default function useTaskDetails(taskId: string, isEnabled = true) {
  const taskDetailsQuery = useQuery({
    queryKey: TASK_QUERY_KEYS.detail(taskId),
    queryFn: () => getTaskDetails(taskId),
    enabled: isEnabled && Boolean(taskId),
  });

  return {
    task: taskDetailsQuery.data ?? null,
    isLoading: taskDetailsQuery.isLoading,
    error: taskDetailsQuery.error instanceof ApiError
      ? taskDetailsQuery.error.message
      : taskDetailsQuery.error
        ? 'Unable to load task details.'
        : null,
  };
}
