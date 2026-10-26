import {
  afterEach,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from 'vitest';
import { TASK_STATUS } from '../task.constants.ts';
import type { TaskListItem } from '../types/tasks.types.ts';
import {
  formatRepeatEvery,
  formatTaskDate,
  isTaskCompletedToday,
  isTaskScheduled,
} from './task-display.ts';

function createTask(
  overrides: Partial<TaskListItem> = {},
): TaskListItem {
  return {
    id: 'task-1',
    name: 'Replace water filter',
    status: TASK_STATUS.overdue,
    repeatEvery: {value: 3, unit: 'months'},
    createdAt: '2026-01-01T10:00:00.000Z',
    startsAt: '2026-01-10T10:00:00.000Z',
    lastCompletedAt: null,
    dueDate: '2026-10-01T10:00:00.000Z',
    ...overrides,
  };
}

describe('task display utilities', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:30:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('formatRepeatEvery', () => {
    test.each([
      [{value: 1, unit: 'days' as const}, 'Every 1 day'],
      [{value: 1, unit: 'weeks' as const}, 'Every 1 week'],
      [{value: 1, unit: 'months' as const}, 'Every 1 month'],
      [{value: 2, unit: 'days' as const}, 'Every 2 days'],
    ])('formats %j as %s', (repeatEvery, expectedLabel) => {
      expect(formatRepeatEvery(repeatEvery)).toBe(expectedLabel);
    });
  });

  test('reuses the application date formatter', () => {
    expect(formatTaskDate('2026-03-05')).toBe('Mar 05, 2026');
  });

  describe('isTaskScheduled', () => {
    test('returns true when the start date is in the future', () => {
      expect(isTaskScheduled(createTask({
        startsAt: '2026-01-01T00:30:01.000Z',
      }))).toBe(true);
    });

    test('returns false when the start date is now or in the past', () => {
      expect(isTaskScheduled(createTask({
        startsAt: '2026-01-01T00:30:00.000Z',
      }))).toBe(false);
      expect(isTaskScheduled(createTask({
        startsAt: '2025-12-31T23:59:59.000Z',
      }))).toBe(false);
    });

    test.each(['', 'not-a-date'])(
      'falls back to task status for invalid input: %s',
      (startsAt) => {
        expect(isTaskScheduled(createTask({
          startsAt,
          status: TASK_STATUS.scheduled,
        }))).toBe(true);
        expect(isTaskScheduled(createTask({
          startsAt,
          status: TASK_STATUS.overdue,
        }))).toBe(false);
      },
    );
  });

  describe('isTaskCompletedToday', () => {
    test('returns false when completion is missing or invalid', () => {
      expect(isTaskCompletedToday(createTask())).toBe(false);
      expect(isTaskCompletedToday(createTask({
        lastCompletedAt: 'not-a-date',
      }))).toBe(false);
    });

    test('returns true for an equivalent instant across a timezone boundary', () => {
      expect(isTaskCompletedToday(createTask({
        lastCompletedAt: '2025-12-31T23:30:00-01:00',
      }))).toBe(true);
    });

    test('returns false when an offset places completion on the previous UTC day', () => {
      expect(isTaskCompletedToday(createTask({
        lastCompletedAt: '2026-01-01T00:30:00+14:00',
      }))).toBe(false);
    });
  });
});
