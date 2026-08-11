import { infiniteQueryOptions } from '@tanstack/react-query';
import { getTaskHistoryFeed } from './api/history.api.ts';
import {
  HISTORY_PAGE_LIMIT,
  HISTORY_QUERY_KEYS,
} from './history.constants.ts';

export function taskHistoryFeedQueryOptions() {
  return infiniteQueryOptions({
    queryKey: HISTORY_QUERY_KEYS.feed,
    refetchOnWindowFocus: false,
    queryFn: ({pageParam, signal}) => getTaskHistoryFeed(
      {
        limit: HISTORY_PAGE_LIMIT,
        cursor: pageParam ?? undefined,
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
