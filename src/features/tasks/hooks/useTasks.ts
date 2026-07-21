import { useQuery } from '@tanstack/react-query';
import { ApiError } from '@/shared/api';
import { taskListQueryOptions } from '../task.queries.ts';

export default function useTasks() {
  const tasksQuery = useQuery(taskListQueryOptions());

  return {
    tasks: tasksQuery.data ?? [],
    isLoading: tasksQuery.isLoading,
    error: tasksQuery.error instanceof ApiError
      ? tasksQuery.error.message
      : tasksQuery.error
        ? 'Unable to load tasks.'
        : null,
  };
}
