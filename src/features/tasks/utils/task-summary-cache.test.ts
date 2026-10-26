import { QueryClient } from '@tanstack/react-query';
import { describe, expect, test } from 'vitest';
import { TASK_QUERY_KEYS, TASK_STATUS } from '../task.constants.ts';
import type {
  TaskListItem,
  TaskStatus,
  TaskSummary,
} from '../types/tasks.types.ts';
import {
  addTaskToSummaryCache,
  removeTaskFromSummaryCache,
  replaceTaskInSummaryCache,
} from './task-summary-cache.ts';

const initialSummary: TaskSummary = {
  scheduledCount: 1,
  overdueCount: 2,
  dueSoonCount: 3,
  okCount: 4,
  allCount: 10,
};

function createQueryClient(summary?: TaskSummary) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {retry: false},
    },
  });

  if (summary) {
    queryClient.setQueryData(TASK_QUERY_KEYS.summary, summary);
  }

  return queryClient;
}

function createTask(status: TaskStatus): TaskListItem {
  return {
    id: `task-${status}`,
    name: 'Replace water filter',
    status,
    repeatEvery: {value: 3, unit: 'months'},
    createdAt: '2026-01-01T10:00:00.000Z',
    startsAt: '2026-01-10T10:00:00.000Z',
    lastCompletedAt: null,
    dueDate: '2026-04-10T10:00:00.000Z',
  };
}

function getSummary(queryClient: QueryClient) {
  return queryClient.getQueryData<TaskSummary>(TASK_QUERY_KEYS.summary);
}

describe('task summary cache utilities', () => {
  test.each([
    ['add', (queryClient: QueryClient) => addTaskToSummaryCache(
      queryClient,
      createTask(TASK_STATUS.scheduled),
    )],
    ['replace', (queryClient: QueryClient) => replaceTaskInSummaryCache(
      queryClient,
      createTask(TASK_STATUS.scheduled),
      createTask(TASK_STATUS.ok),
    )],
    ['remove', (queryClient: QueryClient) => removeTaskFromSummaryCache(
      queryClient,
      createTask(TASK_STATUS.scheduled),
    )],
  ])('does not create missing summary data during %s', (_name, updateCache) => {
    const queryClient = createQueryClient();

    expect(updateCache(queryClient)).toBe(false);
    expect(getSummary(queryClient)).toBeUndefined();
  });

  test.each([
    [TASK_STATUS.scheduled, 'scheduledCount'],
    [TASK_STATUS.overdue, 'overdueCount'],
    [TASK_STATUS.dueSoon, 'dueSoonCount'],
    [TASK_STATUS.ok, 'okCount'],
  ] as const)('adds a %s task to the matching count', (status, countKey) => {
    const queryClient = createQueryClient(initialSummary);

    expect(addTaskToSummaryCache(queryClient, createTask(status))).toBe(true);
    expect(getSummary(queryClient)).toEqual({
      ...initialSummary,
      [countKey]: initialSummary[countKey] + 1,
      allCount: initialSummary.allCount + 1,
    });
  });

  test('moves a task between status counts without changing the total', () => {
    const queryClient = createQueryClient(initialSummary);

    expect(replaceTaskInSummaryCache(
      queryClient,
      createTask(TASK_STATUS.overdue),
      createTask(TASK_STATUS.ok),
    )).toBe(true);
    expect(getSummary(queryClient)).toEqual({
      ...initialSummary,
      overdueCount: 1,
      okCount: 5,
    });
  });

  test('keeps summary counts unchanged when the task status is unchanged', () => {
    const queryClient = createQueryClient(initialSummary);

    replaceTaskInSummaryCache(
      queryClient,
      createTask(TASK_STATUS.dueSoon),
      createTask(TASK_STATUS.dueSoon),
    );

    expect(getSummary(queryClient)).toEqual(initialSummary);
  });

  test('removes a task from its status count and the total', () => {
    const queryClient = createQueryClient(initialSummary);

    expect(removeTaskFromSummaryCache(
      queryClient,
      createTask(TASK_STATUS.dueSoon),
    )).toBe(true);
    expect(getSummary(queryClient)).toEqual({
      ...initialSummary,
      dueSoonCount: 2,
      allCount: 9,
    });
  });

  test('does not allow removal to create negative counts', () => {
    const emptySummary: TaskSummary = {
      scheduledCount: 0,
      overdueCount: 0,
      dueSoonCount: 0,
      okCount: 0,
      allCount: 0,
    };
    const queryClient = createQueryClient(emptySummary);

    removeTaskFromSummaryCache(
      queryClient,
      createTask(TASK_STATUS.overdue),
    );

    expect(getSummary(queryClient)).toEqual(emptySummary);
  });
});
