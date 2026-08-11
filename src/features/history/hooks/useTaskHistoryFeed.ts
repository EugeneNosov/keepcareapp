import { useInfiniteQuery } from '@tanstack/react-query';
import { ApiError } from '@/shared/api';
import { taskHistoryFeedQueryOptions } from '../history.queries.ts';

export default function useTaskHistoryFeed() {
  const taskHistoryFeedQuery = useInfiniteQuery(taskHistoryFeedQueryOptions());
  const errorMessage = taskHistoryFeedQuery.error instanceof ApiError
    ? taskHistoryFeedQuery.error.message
    : taskHistoryFeedQuery.error
      ? 'Unable to load history.'
      : null;

  return {
    events: taskHistoryFeedQuery.data?.pages.flatMap((page) => page.data) ?? [],
    isLoading: taskHistoryFeedQuery.isLoading,
    isLoadingMore: taskHistoryFeedQuery.isFetchingNextPage,
    hasMore: taskHistoryFeedQuery.hasNextPage,
    loadMore: taskHistoryFeedQuery.fetchNextPage,
    retry: taskHistoryFeedQuery.refetch,
    error: taskHistoryFeedQuery.isFetchNextPageError ? null : errorMessage,
    loadMoreError: taskHistoryFeedQuery.isFetchNextPageError ? errorMessage : null,
  };
}
