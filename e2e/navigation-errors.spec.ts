import {expect, test} from '@playwright/test';
import {
  mockAuthenticatedSession,
  mockUnauthenticatedSession,
} from './support/mock-api.ts';
import {mockHistoryApi} from './support/mock-history-api.ts';
import {
  DEFAULT_TASK,
  mockCreateTaskFailure,
  mockDelayedTaskList,
  mockTaskApi,
} from './support/mock-task-api.ts';

test('implemented side-menu navigation works', async ({page}) => {
  await mockAuthenticatedSession(page);
  await mockTaskApi(page);
  await mockHistoryApi(page);
  await page.goto('/app/tasks');

  await page.getByRole('link', {name: 'History'}).click();
  await expect(page).toHaveURL('/app/history');
  await expect(page.getByRole('heading', {name: 'History', exact: true})).toBeVisible();

  await page.getByRole('link', {name: 'Tasks'}).click();
  await expect(page).toHaveURL('/app/tasks');
  await expect(
    page.getByRole('heading', {name: 'Tasks', exact: true}),
  ).toBeVisible();
});

test('browser back and forward navigation works', async ({page}) => {
  await mockAuthenticatedSession(page);
  await mockTaskApi(page);
  await page.goto('/app/tasks');
  await page
    .getByRole('link', {name: `View details for ${DEFAULT_TASK.name}`})
    .click();
  await expect(page).toHaveURL(`/app/tasks/${DEFAULT_TASK.id}`);

  await page.goBack();
  await expect(page).toHaveURL('/app/tasks');
  await expect(
    page.getByRole('heading', {name: 'Tasks', exact: true}),
  ).toBeVisible();

  await page.goForward();
  await expect(page).toHaveURL(`/app/tasks/${DEFAULT_TASK.id}`);
  await expect(
    page.getByRole('heading', {name: DEFAULT_TASK.name, exact: true}),
  ).toBeVisible();
});

test('unknown URLs display the not-found page', async ({page}) => {
  await mockUnauthenticatedSession(page);

  await page.goto('/page-that-does-not-exist');

  await expect(page).toHaveURL('/page-that-does-not-exist');
  await expect(
    page.getByRole('heading', {name: 'This page wandered off.'}),
  ).toBeVisible();
  await expect(page.getByText('Error 404')).toBeVisible();
});

test('failed mutations display the global error toast', async ({page}) => {
  await mockAuthenticatedSession(page);
  await mockTaskApi(page, []);
  await mockCreateTaskFailure(page);
  await page.goto('/app/tasks');
  await page.getByRole('button', {name: 'Create task'}).click();

  const dialog = page.getByRole('dialog', {name: 'Create task'});
  await dialog.getByLabel('Task name').fill('Task that cannot be saved');
  await dialog.getByRole('button', {name: 'Create task'}).click();

  await expect(
    page.getByRole('alert').filter({hasText: 'Something went wrong. Please try again.'}),
  ).toBeVisible();
  await expect(dialog).toBeVisible();
});

test('task loading state keeps page controls available', async ({page}) => {
  await mockAuthenticatedSession(page);
  await mockTaskApi(page);
  const finishLoading = await mockDelayedTaskList(page);
  await page.goto('/app/tasks');

  await expect(page.getByText('Loading tasks...')).toBeVisible();
  await expect(page.getByRole('button', {name: 'Create task'})).toBeEnabled();
  await expect(page.getByRole('link', {name: 'History'})).toBeVisible();

  finishLoading();
  await expect(
    page.getByRole('link', {name: `View details for ${DEFAULT_TASK.name}`}),
  ).toBeVisible();
});
