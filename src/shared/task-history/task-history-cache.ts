import type { InfiniteData, QueryClient } from '@tanstack/react-query';
import { TASK_HISTORY_FEED_QUERY_KEYS } from './task-history.constants.ts';

export async function resetTaskHistoryFeedToFirstPage(
  queryClient: QueryClient,
) {
  await queryClient.cancelQueries({
    queryKey: TASK_HISTORY_FEED_QUERY_KEYS.all,
  });

  queryClient.setQueriesData<InfiniteData<unknown, string | null>>(
    {queryKey: TASK_HISTORY_FEED_QUERY_KEYS.all},
    (history) => {
      if (!history || history.pages.length <= 1) {
        return history;
      }

      return {
        pages: history.pages.slice(0, 1),
        pageParams: history.pageParams.slice(0, 1),
      };
    },
  );

  return queryClient.invalidateQueries({
    queryKey: TASK_HISTORY_FEED_QUERY_KEYS.all,
  });
}
