import { expect, test, type Page } from '@playwright/test';
import { mockAuthenticatedSession } from './support/mock-api.ts';
import { mockHistoryApi } from './support/mock-history-api.ts';

async function openHistory(page: Page) {
  await mockAuthenticatedSession(page);
  await mockHistoryApi(page);
  await page.goto('/app/history');
  await expect(
    page.getByRole('heading', {name: 'History', exact: true}),
  ).toBeVisible();
}

test('history page loads', async ({page}) => {
  await openHistory(page);

  await expect(page.getByText('2 events shown')).toBeVisible();
  await expect(
    page.getByRole('link', {name: 'View details for Replace water filter'}).first(),
  ).toBeVisible();
});

test('completed task appears in history', async ({page}) => {
  await openHistory(page);

  await expect(page.getByRole('heading', {name: 'Task completed'})).toBeVisible();
  await expect(page.getByText('Installed a new filter.')).toBeVisible();
});

test('history filters change the displayed results', async ({page}) => {
  await openHistory(page);
  await page.getByRole('button', {name: 'Filter history'}).click();

  const filters = page.getByRole('dialog', {name: 'History filters'});
  const completedFilter = filters.getByLabel('Task completed');
  await filters.getByText('Task completed', {exact: true}).click();

  await expect(completedFilter).not.toBeChecked();
  await expect(page.getByRole('heading', {name: 'Task completed'})).not.toBeVisible();
  await expect(page.getByRole('heading', {name: 'Task created'})).toBeVisible();
  await expect(page.getByText('1 event shown')).toBeVisible();
});

test('empty filter results display an appropriate empty state', async ({page}) => {
  await openHistory(page);
  await page.getByRole('button', {name: 'Filter history'}).click();

  const filters = page.getByRole('dialog', {name: 'History filters'});
  await filters.getByText('Task completed', {exact: true}).click();
  await filters.getByText('Task created', {exact: true}).click();
  await filters.getByText('Task deleted', {exact: true}).click();

  await expect(page.getByText('No matching activity')).toBeVisible();
  await expect(page.getByRole('button', {name: 'Reset filters'})).toBeVisible();
});
