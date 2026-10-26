import type { Page } from '@playwright/test';
import {
  HISTORY_EVENTS,
  type MockHistoryEvent,
} from './data/history-fixtures.ts';

export { HISTORY_EVENTS } from './data/history-fixtures.ts';
export type { MockHistoryEvent } from './data/history-fixtures.ts';

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
