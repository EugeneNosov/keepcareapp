import { useQuery } from '@tanstack/react-query';
import { ApiError } from '@/shared/api';
import { taskDetailsQueryOptions } from '../task.queries.ts';

export default function useTaskDetails(taskId: string, isEnabled = true) {
  const taskDetailsQuery = useQuery({
    ...taskDetailsQueryOptions(taskId),
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
