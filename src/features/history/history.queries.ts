import { infiniteQueryOptions } from '@tanstack/react-query';
import { TASK_HISTORY_FEED_QUERY_KEYS } from '@/shared/task-history/task-history.constants.ts';
import { getTaskHistoryFeed } from './api/history.api.ts';
import { HISTORY_PAGE_LIMIT } from './history.constants.ts';
import type { TaskHistoryFilters } from './types/history.types.ts';

export function taskHistoryFeedQueryOptions(filters: TaskHistoryFilters) {
  return infiniteQueryOptions({
    queryKey: TASK_HISTORY_FEED_QUERY_KEYS.feed(filters),
    refetchOnWindowFocus: false,
    queryFn: ({pageParam, signal}) => getTaskHistoryFeed(
      {
        limit: HISTORY_PAGE_LIMIT,
        cursor: pageParam ?? undefined,
        ...filters,
      },
      signal,
    ),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => (
      lastPage.meta.pagination.hasMore
        ? lastPage.meta.pagination.nextCursor ?? undefined
        : undefined
    ),
  });
}
