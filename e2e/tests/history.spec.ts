import { expect, test } from '../fixtures/test.ts';
import { mockHistoryApi } from '../mocks/history-api.ts';
import type { HistoryPage } from '../pages/history-page.ts';

async function openHistory(historyPage: HistoryPage) {
  await mockHistoryApi(historyPage.page);
  await historyPage.goto();
  await expect(historyPage.heading).toBeVisible();
}

test('history page loads', async ({historyPage}) => {
  await openHistory(historyPage);

  await expect(historyPage.page.getByText('2 events shown')).toBeVisible();
  await expect(
    historyPage.page
      .getByRole('link', {name: 'View details for Replace water filter'})
      .first(),
  ).toBeVisible();
});

test('completed task appears in history', async ({historyPage}) => {
  await openHistory(historyPage);

  await expect(
    historyPage.page.getByRole('heading', {name: 'Task completed'}),
  ).toBeVisible();
  await expect(
    historyPage.page.getByText('Installed a new filter.'),
  ).toBeVisible();
});

test('history filters change the displayed results', async ({historyPage}) => {
  await openHistory(historyPage);

  const filters = await historyPage.openFilters();
  const completedFilter = filters.getByLabel('Task completed');
  await historyPage.toggleEventType('Task completed');

  await expect(completedFilter).not.toBeChecked();
  await expect(
    historyPage.page.getByRole('heading', {name: 'Task completed'}),
  ).not.toBeVisible();
  await expect(
    historyPage.page.getByRole('heading', {name: 'Task created'}),
  ).toBeVisible();
  await expect(historyPage.page.getByText('1 event shown')).toBeVisible();
});

test('empty filter results display an appropriate empty state', async ({historyPage}) => {
  await openHistory(historyPage);
  await historyPage.openFilters();

  await historyPage.toggleEventType('Task completed');
  await historyPage.toggleEventType('Task created');
  await historyPage.toggleEventType('Task deleted');

  await expect(historyPage.page.getByText('No matching activity')).toBeVisible();
  await expect(
    historyPage.page.getByRole('button', {name: 'Reset filters'}),
  ).toBeVisible();
});
