import type { InfiniteData } from '@tanstack/react-query';
import { QueryClient } from '@tanstack/react-query';
import { describe, expect, test } from 'vitest';
import type {
  TaskHistoryResponse,
} from './task-history.types.ts';
import {
  TASK_HISTORY_FEED_QUERY_KEYS,
} from './task-history.constants.ts';
import { resetTaskHistoryFeedToFirstPage } from './task-history-cache.ts';

function createHistoryPage(id: string): TaskHistoryResponse {
  return {
    data: [{
      id,
      occurredAt: '2026-10-20T08:00:00.000Z',
      type: 'task_created',
      details: {},
    }],
    meta: {
      pagination: {
        nextCursor: null,
        hasMore: false,
        limit: 20,
      },
    },
  };
}

function createHistoryData(
  firstId: string,
): InfiniteData<TaskHistoryResponse, string | null> {
  return {
    pages: [createHistoryPage(firstId), createHistoryPage(`${firstId}-page-2`)],
    pageParams: [null, 'next-page'],
  };
}

describe('resetTaskHistoryFeedToFirstPage', () => {
  test('resets every filtered history feed without changing unrelated cache data', async () => {
    const queryClient = new QueryClient();
    const completedFeedKey = TASK_HISTORY_FEED_QUERY_KEYS.feed({
      eventTypes: ['task_completed'],
      includeDeletedTasks: true,
    });
    const createdFeedKey = TASK_HISTORY_FEED_QUERY_KEYS.feed({
      eventTypes: ['task_created'],
      includeDeletedTasks: false,
    });
    const unrelatedData = [{id: 'task-1'}];

    queryClient.setQueryData(completedFeedKey, createHistoryData('completed'));
    queryClient.setQueryData(createdFeedKey, createHistoryData('created'));
    queryClient.setQueryData(['unrelated'], unrelatedData);

    await resetTaskHistoryFeedToFirstPage(queryClient);

    expect(queryClient.getQueryData(completedFeedKey)).toEqual({
      pages: [createHistoryPage('completed')],
      pageParams: [null],
    });
    expect(queryClient.getQueryData(createdFeedKey)).toEqual({
      pages: [createHistoryPage('created')],
      pageParams: [null],
    });
    expect(queryClient.getQueryData(['unrelated'])).toBe(unrelatedData);
  });

  test('leaves a single-page feed unchanged', async () => {
    const queryClient = new QueryClient();
    const feedKey = TASK_HISTORY_FEED_QUERY_KEYS.feed({
      eventTypes: ['task_created'],
      includeDeletedTasks: true,
    });
    const history = {
      pages: [createHistoryPage('created')],
      pageParams: [null],
    };

    queryClient.setQueryData(feedKey, history);

    await resetTaskHistoryFeedToFirstPage(queryClient);

    expect(queryClient.getQueryData(feedKey)).toBe(history);
  });
});
