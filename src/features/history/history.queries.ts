import { infiniteQueryOptions } from '@tanstack/react-query';
import { getTaskHistoryFeed } from './api/history.api.ts';
import {
  HISTORY_PAGE_LIMIT,
  HISTORY_QUERY_KEYS,
} from './history.constants.ts';
import type { TaskHistoryFilters } from './types/history.types.ts';

export function taskHistoryFeedQueryOptions(filters: TaskHistoryFilters) {
  return infiniteQueryOptions({
    queryKey: HISTORY_QUERY_KEYS.feed(filters),
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
