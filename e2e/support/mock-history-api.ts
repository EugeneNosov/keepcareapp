import type { Page } from '@playwright/test';

type MockHistoryEventType =
  | 'task_completed'
  | 'task_updated'
  | 'task_deleted'
  | 'task_created';

type MockHistoryEvent = {
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

export const HISTORY_EVENTS: MockHistoryEvent[] = [
  {
    id: 'event-completed',
    type: 'task_completed',
    occurredAt: '2026-10-20T09:00:00.000Z',
    details: {
      nextDueAt: '2027-01-20T09:00:00.000Z',
      note: 'Installed a new filter.',
    },
    task: {
      id: 'task-1',
      name: 'Replace water filter',
      isDeleted: false,
    },
  },
  {
    id: 'event-created',
    type: 'task_created',
    occurredAt: '2026-01-01T10:00:00.000Z',
    details: {},
    task: {
      id: 'task-1',
      name: 'Replace water filter',
      isDeleted: false,
    },
  },
];

const HISTORY_API_PATTERN = /^https?:\/\/[^/]+\/tasks\/history(?:\?.*)?$/;

export async function mockHistoryApi(
  page: Page,
  events: MockHistoryEvent[] = HISTORY_EVENTS,
) {
  await page.route(HISTORY_API_PATTERN, async (route) => {
    const url = new URL(route.request().url());
    const selectedEventTypes = new Set(
      (url.searchParams.get('eventTypes') ?? '')
        .split(',')
        .filter(Boolean),
    );
    const includeDeletedTasks = url.searchParams.get('includeDeletedTasks') === 'true';
    const filteredEvents = events.filter((event) => (
      selectedEventTypes.has(event.type)
      && (includeDeletedTasks || !event.task.isDeleted)
    ));

    await route.fulfill({
      json: {
        data: filteredEvents,
        meta: {
          pagination: {
            nextCursor: null,
            hasMore: false,
            limit: 20,
          },
        },
      },
    });
  });
}
