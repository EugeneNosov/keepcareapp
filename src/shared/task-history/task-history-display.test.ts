import { describe, expect, test } from 'vitest';
import type { TaskHistoryEvent } from './task-history.types.ts';
import { getTaskHistoryDisplayItem } from './task-history-display.ts';

const occurredAt = '2026-03-05T10:30:00.000Z';

function createEvent(
  event: Omit<TaskHistoryEvent, 'id' | 'occurredAt'>,
): TaskHistoryEvent {
  return {
    id: 'history-1',
    occurredAt,
    ...event,
  } as TaskHistoryEvent;
}

describe('getTaskHistoryDisplayItem', () => {
  test('converts a created event for display', () => {
    expect(getTaskHistoryDisplayItem(createEvent({
      type: 'task_created',
      details: {},
    }))).toMatchObject({
      date: occurredAt,
      description: 'The task was added to your care list.',
      title: 'Task created',
    });
  });

  test('converts a deleted event for display', () => {
    expect(getTaskHistoryDisplayItem(createEvent({
      type: 'task_deleted',
      details: {},
    }))).toMatchObject({
      date: occurredAt,
      description: 'The task was removed from your care list.',
      title: 'Task deleted',
    });
  });

  test('uses a generic description when no updated fields are provided', () => {
    expect(getTaskHistoryDisplayItem(createEvent({
      type: 'task_updated',
      details: {updatedFields: []},
    }))).toMatchObject({
      date: occurredAt,
      description: 'Task details were updated.',
      title: 'Task updated',
    });
  });

  test.each([
    [['name'] as const, 'Name updated.'],
    [
      ['name', 'startsAt', 'repeatEvery'] as const,
      'Name, start date, and repeat schedule updated.',
    ],
  ])('lists the fields included in an update', (updatedFields, description) => {
    const displayItem = getTaskHistoryDisplayItem(createEvent({
      type: 'task_updated',
      details: {updatedFields: [...updatedFields]},
    }));

    expect(displayItem.description).toBe(description);
  });

  test('converts a completed event with its next due date and note', () => {
    expect(getTaskHistoryDisplayItem(createEvent({
      type: 'task_completed',
      details: {
        nextDueAt: '2026-06-05T10:30:00.000Z',
        note: 'Replaced successfully.',
      },
    }))).toMatchObject({
      date: occurredAt,
      description: 'Next due date: Jun 05, 2026.',
      note: 'Replaced successfully.',
      title: 'Task completed',
    });
  });

  test.each([null, 'not-a-date']) (
    'uses the completion fallback when the next due date is %s',
    (nextDueAt) => {
      const displayItem = getTaskHistoryDisplayItem(createEvent({
        type: 'task_completed',
        details: {nextDueAt},
      }));

      expect(displayItem).toMatchObject({
        date: occurredAt,
        description: 'The task was marked as done.',
        note: undefined,
        title: 'Task completed',
      });
    },
  );
});
