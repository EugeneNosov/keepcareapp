export type MockHistoryEventType =
  | 'task_completed'
  | 'task_updated'
  | 'task_deleted'
  | 'task_created';

export type MockHistoryEvent = {
  id: string;
  type: MockHistoryEventType;
  occurredAt: string;
  details: Record<string, unknown>;
  task: {
    id: string;
    name: string;
    isDeleted: boolean;
  };
};

type MockHistoryEventOverrides = Partial<Omit<MockHistoryEvent, 'task'>> & {
  task?: Partial<MockHistoryEvent['task']>;
};

const BASE_HISTORY_EVENT: MockHistoryEvent = {
  id: 'event-created',
  type: 'task_created',
  occurredAt: '2026-01-01T10:00:00.000Z',
  details: {},
  task: {
    id: 'task-1',
    name: 'Replace water filter',
    isDeleted: false,
  },
};

export function createHistoryEventFixture(
  overrides: MockHistoryEventOverrides = {},
): MockHistoryEvent {
  return {
    ...BASE_HISTORY_EVENT,
    ...overrides,
    details: overrides.details ?? BASE_HISTORY_EVENT.details,
    task: {
      ...BASE_HISTORY_EVENT.task,
      ...overrides.task,
    },
  };
}

export const HISTORY_EVENTS: MockHistoryEvent[] = [
  createHistoryEventFixture({
    id: 'event-completed',
    type: 'task_completed',
    occurredAt: '2026-10-20T09:00:00.000Z',
    details: {
      nextDueAt: '2027-01-20T09:00:00.000Z',
      note: 'Installed a new filter.',
    },
  }),
  createHistoryEventFixture(),
];
