import type { InfiniteData } from '@tanstack/react-query';
import { QueryClient } from '@tanstack/react-query';
import { describe, expect, test, vi } from 'vitest';
import {
  TASK_HISTORY_FEED_QUERY_KEYS,
} from '@/shared/task-history/task-history.constants.ts';
import type {
  TaskHistoryResponse,
} from '@/shared/task-history/task-history.types.ts';
import { TASK_QUERY_KEYS, TASK_STATUS } from '../task.constants.ts';
import type {
  Task,
  TaskListItem,
  TaskSummary,
} from '../types/tasks.types.ts';
import {
  cancelTaskCacheQueries,
  syncUpdatedTaskCache,
  toTaskListItem,
} from './task-cache.ts';

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {retry: false},
    },
  });
}

function createTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 'task-1',
    name: 'Replace water filter',
    notes: 'Use the spare filter.',
    status: TASK_STATUS.overdue,
    repeatEvery: {value: 3, unit: 'months'},
    createdAt: '2026-01-01T10:00:00.000Z',
    startsAt: '2026-01-10T10:00:00.000Z',
    lastCompletedAt: null,
    dueDate: '2026-04-10T10:00:00.000Z',
    ...overrides,
  };
}

function createHistoryPage(id: string): TaskHistoryResponse {
  return {
    data: [{
      id,
      occurredAt: '2026-01-01T10:00:00.000Z',
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

function createHistoryData(): InfiniteData<TaskHistoryResponse, string | null> {
  return {
    pages: [createHistoryPage('history-1'), createHistoryPage('history-2')],
    pageParams: [null, 'next-page'],
  };
}

describe('task cache utilities', () => {
  test('converts a task to the list shape without detail-only notes', () => {
    const task = createTask();

    expect(toTaskListItem(task)).toEqual({
      id: task.id,
      name: task.name,
      status: task.status,
      repeatEvery: task.repeatEvery,
      createdAt: task.createdAt,
      startsAt: task.startsAt,
      lastCompletedAt: task.lastCompletedAt,
      dueDate: task.dueDate,
    });
    expect(toTaskListItem(task)).not.toHaveProperty('notes');
  });

  test('cancels the task caches that can conflict with an update', async () => {
    const queryClient = createQueryClient();
    const cancelQueries = vi.spyOn(queryClient, 'cancelQueries');

    await cancelTaskCacheQueries(queryClient, 'task-1');

    expect(cancelQueries).toHaveBeenCalledTimes(3);
    expect(cancelQueries).toHaveBeenCalledWith({queryKey: TASK_QUERY_KEYS.list});
    expect(cancelQueries).toHaveBeenCalledWith({
      queryKey: TASK_QUERY_KEYS.detail('task-1'),
    });
    expect(cancelQueries).toHaveBeenCalledWith({queryKey: TASK_QUERY_KEYS.summary});
  });

  test('synchronizes detail, list, summary, and history caches', async () => {
    const queryClient = createQueryClient();
    const previousTask = createTask();
    const unrelatedTask = toTaskListItem(createTask({
      id: 'task-2',
      name: 'Book annual checkup',
      status: TASK_STATUS.scheduled,
    }));
    const summary: TaskSummary = {
      scheduledCount: 1,
      overdueCount: 1,
      dueSoonCount: 0,
      okCount: 0,
      allCount: 2,
    };
    const updatedTask = createTask({
      name: 'Replace kitchen water filter',
      status: TASK_STATUS.ok,
      lastCompletedAt: '2026-04-10T09:00:00.000Z',
    });
    const historyFeedKey = TASK_HISTORY_FEED_QUERY_KEYS.feed({
      eventTypes: ['task_completed'],
      includeDeletedTasks: true,
    });

    queryClient.setQueryData(TASK_QUERY_KEYS.detail(previousTask.id), previousTask);
    queryClient.setQueryData<TaskListItem[]>(TASK_QUERY_KEYS.list, [
      toTaskListItem(previousTask),
      unrelatedTask,
    ]);
    queryClient.setQueryData(TASK_QUERY_KEYS.summary, summary);
    queryClient.setQueryData(TASK_QUERY_KEYS.history(previousTask.id), createHistoryData());
    queryClient.setQueryData(historyFeedKey, createHistoryData());

    await syncUpdatedTaskCache(queryClient, updatedTask);

    expect(queryClient.getQueryData(TASK_QUERY_KEYS.detail(updatedTask.id)))
      .toEqual(updatedTask);
    expect(queryClient.getQueryData<TaskListItem[]>(TASK_QUERY_KEYS.list)).toEqual([
      toTaskListItem(updatedTask),
      unrelatedTask,
    ]);
    expect(queryClient.getQueryData<TaskSummary>(TASK_QUERY_KEYS.summary)).toEqual({
      ...summary,
      overdueCount: 0,
      okCount: 1,
    });
    expect(queryClient.getQueryData<InfiniteData<TaskHistoryResponse>>(
      TASK_QUERY_KEYS.history(updatedTask.id),
    )).toEqual({
      pages: [createHistoryPage('history-1')],
      pageParams: [null],
    });
    expect(queryClient.getQueryData<InfiniteData<TaskHistoryResponse>>(
      historyFeedKey,
    )).toEqual({
      pages: [createHistoryPage('history-1')],
      pageParams: [null],
    });
  });

  test('creates a missing list entry and invalidates a missing summary', async () => {
    const queryClient = createQueryClient();
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries');
    const updatedTask = createTask();

    await syncUpdatedTaskCache(queryClient, updatedTask);

    expect(queryClient.getQueryData(TASK_QUERY_KEYS.detail(updatedTask.id)))
      .toEqual(updatedTask);
    expect(queryClient.getQueryData(TASK_QUERY_KEYS.list)).toEqual([
      toTaskListItem(updatedTask),
    ]);
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: TASK_QUERY_KEYS.summary,
    });
  });
});
