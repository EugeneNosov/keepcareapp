import { useInfiniteQuery } from '@tanstack/react-query';
import { ApiError } from '@/shared/api';
import { taskHistoryQueryOptions } from '../task.queries.ts';

export default function useTaskHistory(taskId: string, isEnabled = true) {
  const taskHistoryQuery = useInfiniteQuery({
    ...taskHistoryQueryOptions(taskId),
    enabled: isEnabled && Boolean(taskId),
  });

  return {
    events: taskHistoryQuery.data?.pages.flatMap((page) => page.data) ?? [],
    isLoading: taskHistoryQuery.isLoading,
    isLoadingMore: taskHistoryQuery.isFetchingNextPage,
    hasMore: taskHistoryQuery.hasNextPage,
    loadMore: taskHistoryQuery.fetchNextPage,
    retry: taskHistoryQuery.refetch,
    error: taskHistoryQuery.error instanceof ApiError
      ? taskHistoryQuery.error.message
      : taskHistoryQuery.error
        ? 'Unable to load task history.'
        : null,
  };
}
