import {
  expect,
  test as base,
  type Page,
} from '@playwright/test';
import { mockAuthenticatedSession } from '../mocks/auth-api.ts';
import { HistoryPage } from '../pages/history-page.ts';
import { TaskListPage } from '../pages/task-list-page.ts';

type AppFixtures = {
  authenticatedPage: Page;
  historyPage: HistoryPage;
  taskListPage: TaskListPage;
};

export const test = base.extend<AppFixtures>({
  authenticatedPage: async ({page}, provide) => {
    await mockAuthenticatedSession(page);
    await provide(page);
  },
  historyPage: async ({authenticatedPage}, provide) => {
    await provide(new HistoryPage(authenticatedPage));
  },
  taskListPage: async ({authenticatedPage}, provide) => {
    await provide(new TaskListPage(authenticatedPage));
  },
});

export { expect };
