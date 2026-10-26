import type { InfiniteData } from '@tanstack/react-query';
import { QueryClient } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { describe, expect, test } from 'vitest';
import { taskHistoryFeedQueryOptions } from '@/features/history/history.queries.ts';
import type {
  TaskHistoryFeedResponse,
} from '@/features/history/types/history.types.ts';
import { server } from '@/test/mocks/server.ts';
import {
  TASK_HISTORY_FEED_QUERY_KEYS,
} from '@/shared/task-history/task-history.constants.ts';
import type {
  TaskHistoryResponse,
} from '@/shared/task-history/task-history.types.ts';
import { TASK_QUERY_KEYS } from './task.constants.ts';
import { taskHistoryQueryOptions } from './task.queries.ts';

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {retry: false},
    },
  });
}

describe('task history query cache', () => {
  test('stores received task history under the task-specific key', async () => {
    const queryClient = createQueryClient();
    const response: TaskHistoryResponse = {
      data: [{
        id: 'history-1',
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
    server.use(
      http.get('*/tasks/:taskId/history', ({params}) => {
        expect(params.taskId).toBe('task-1');
        return HttpResponse.json(response);
      }),
    );

    await queryClient.fetchInfiniteQuery(taskHistoryQueryOptions('task-1'));

    expect(queryClient.getQueryData<InfiniteData<TaskHistoryResponse>>(
      TASK_QUERY_KEYS.history('task-1'),
    )).toEqual({
      pages: [response],
      pageParams: [null],
    });
  });

  test('keeps differently filtered history feeds in independent caches', async () => {
    const queryClient = createQueryClient();
    const completedFilters = {
      eventTypes: ['task_completed' as const],
      includeDeletedTasks: true,
    };
    const createdFilters = {
      eventTypes: ['task_created' as const],
      includeDeletedTasks: false,
    };
    server.use(
      http.get('*/tasks/history', ({request}) => {
        const eventTypes = new URL(request.url).searchParams.get('eventTypes');
        const response: TaskHistoryFeedResponse = {
          data: eventTypes === 'task_completed'
            ? [{
              id: 'history-completed',
              occurredAt: '2026-10-20T08:00:00.000Z',
              type: 'task_completed',
              details: {nextDueAt: '2026-11-20T08:00:00.000Z'},
              task: {id: 'task-1', name: 'Replace filter', isDeleted: false},
            }]
            : [{
              id: 'history-created',
              occurredAt: '2026-10-19T08:00:00.000Z',
              type: 'task_created',
              details: {},
              task: {id: 'task-2', name: 'Book checkup', isDeleted: false},
            }],
          meta: {
            pagination: {
              nextCursor: null,
              hasMore: false,
              limit: 20,
            },
          },
        };

        return HttpResponse.json(response);
      }),
    );

    await queryClient.fetchInfiniteQuery(
      taskHistoryFeedQueryOptions(completedFilters),
    );
    await queryClient.fetchInfiniteQuery(
      taskHistoryFeedQueryOptions(createdFilters),
    );

    const completedHistory = queryClient.getQueryData<
      InfiniteData<TaskHistoryFeedResponse>
    >(TASK_HISTORY_FEED_QUERY_KEYS.feed(completedFilters));
    const createdHistory = queryClient.getQueryData<
      InfiniteData<TaskHistoryFeedResponse>
    >(TASK_HISTORY_FEED_QUERY_KEYS.feed(createdFilters));

    expect(completedHistory?.pages[0].data[0].id).toBe('history-completed');
    expect(createdHistory?.pages[0].data[0].id).toBe('history-created');
    expect(completedHistory).not.toBe(createdHistory);
  });
});
