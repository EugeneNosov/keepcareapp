import type { InfiniteData, QueryClient } from '@tanstack/react-query';
import { HISTORY_QUERY_KEYS } from '../history.constants.ts';
import type { TaskHistoryFeedResponse } from '../types/history.types.ts';

export async function resetTaskHistoryFeedToFirstPage(
  queryClient: QueryClient,
) {
  await queryClient.cancelQueries({
    queryKey: HISTORY_QUERY_KEYS.all,
  });

  queryClient.setQueriesData<InfiniteData<TaskHistoryFeedResponse, string | null>>(
    {queryKey: HISTORY_QUERY_KEYS.all},
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

  return queryClient.invalidateQueries({queryKey: HISTORY_QUERY_KEYS.all});
}
