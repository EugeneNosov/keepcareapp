import { expect, test } from '../fixtures/test.ts';
import { mockUnauthenticatedSession } from '../mocks/auth-api.ts';
import { mockHistoryApi } from '../mocks/history-api.ts';
import {
  DEFAULT_TASK,
  mockCreateTaskFailure,
  mockDelayedTaskList,
  mockTaskApi,
} from '../mocks/task-api.ts';

test('implemented side-menu navigation works', async ({taskListPage}) => {
  await mockTaskApi(taskListPage.page);
  await mockHistoryApi(taskListPage.page);
  await taskListPage.goto();

  await taskListPage.historyLink.click();
  await expect(taskListPage.page).toHaveURL('/app/history');
  await expect(
    taskListPage.page.getByRole('heading', {name: 'History', exact: true}),
  ).toBeVisible();

  await taskListPage.page.getByRole('link', {name: 'Tasks'}).click();
  await expect(taskListPage.page).toHaveURL('/app/tasks');
  await expect(taskListPage.heading).toBeVisible();
});

test('browser back and forward navigation works', async ({taskListPage}) => {
  await mockTaskApi(taskListPage.page);
  await taskListPage.goto();
  await taskListPage.openTaskDetails(DEFAULT_TASK.name);
  await expect(taskListPage.page).toHaveURL(`/app/tasks/${DEFAULT_TASK.id}`);

  await taskListPage.page.goBack();
  await expect(taskListPage.page).toHaveURL('/app/tasks');
  await expect(taskListPage.heading).toBeVisible();

  await taskListPage.page.goForward();
  await expect(taskListPage.page).toHaveURL(`/app/tasks/${DEFAULT_TASK.id}`);
  await expect(
    taskListPage.page.getByRole('heading', {
      name: DEFAULT_TASK.name,
      exact: true,
    }),
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

test('failed mutations display the global error toast', async ({taskListPage}) => {
  await mockTaskApi(taskListPage.page, []);
  await mockCreateTaskFailure(taskListPage.page);
  await taskListPage.goto();

  const dialog = await taskListPage.openCreateTaskDialog();
  await dialog.getByLabel('Task name').fill('Task that cannot be saved');
  await dialog.getByRole('button', {name: 'Create task'}).click();

  await expect(
    taskListPage.page
      .getByRole('alert')
      .filter({hasText: 'Something went wrong. Please try again.'}),
  ).toBeVisible();
  await expect(dialog).toBeVisible();
});

test('task loading state keeps page controls available', async ({taskListPage}) => {
  await mockTaskApi(taskListPage.page);
  const finishLoading = await mockDelayedTaskList(taskListPage.page);
  await taskListPage.goto();

  await expect(taskListPage.page.getByText('Loading tasks...')).toBeVisible();
  await expect(taskListPage.createTaskButton).toBeEnabled();
  await expect(taskListPage.historyLink).toBeVisible();

  finishLoading();
  await expect(taskListPage.taskLink(DEFAULT_TASK.name)).toBeVisible();
});
