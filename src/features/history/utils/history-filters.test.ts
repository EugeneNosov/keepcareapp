import { describe, expect, test } from 'vitest';
import { TASK_HISTORY_EVENT_TYPES } from '@/shared/task-history/task-history.constants.ts';
import type { TaskHistoryFilters } from '../types/history.types.ts';
import { hasActiveTaskHistoryFilters } from './history-filters.ts';

function createFilters(
  overrides: Partial<TaskHistoryFilters> = {},
): TaskHistoryFilters {
  return {
    eventTypes: [...TASK_HISTORY_EVENT_TYPES],
    includeDeletedTasks: true,
    ...overrides,
  };
}

describe('hasActiveTaskHistoryFilters', () => {
  test('returns false for the default filters', () => {
    expect(hasActiveTaskHistoryFilters(createFilters())).toBe(false);
  });

  test('returns false when every event type is selected in another order', () => {
    expect(hasActiveTaskHistoryFilters(createFilters({
      eventTypes: [...TASK_HISTORY_EVENT_TYPES].reverse(),
    }))).toBe(false);
  });

  test('returns true when an event type is excluded', () => {
    expect(hasActiveTaskHistoryFilters(createFilters({
      eventTypes: ['task_completed'],
    }))).toBe(true);
  });

  test('returns true when no event types are selected', () => {
    expect(hasActiveTaskHistoryFilters(createFilters({eventTypes: []}))).toBe(true);
  });

  test('returns true when deleted tasks are excluded', () => {
    expect(hasActiveTaskHistoryFilters(createFilters({
      includeDeletedTasks: false,
    }))).toBe(true);
  });

  test('treats duplicate event types as an active filter', () => {
    expect(hasActiveTaskHistoryFilters(createFilters({
      eventTypes: [
        'task_completed',
        'task_completed',
        'task_deleted',
        'task_created',
      ],
    }))).toBe(true);
  });
});
