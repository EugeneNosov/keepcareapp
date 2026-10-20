import {expect, test, type Page} from '@playwright/test';
import {mockAuthenticatedSession} from './support/mock-api.ts';
import {
  DEFAULT_TASK,
  mockTaskApi,
  type MockTask,
} from './support/mock-task-api.ts';

async function openTaskList(page: Page, tasks?: MockTask[]) {
  await mockAuthenticatedSession(page);
  await mockTaskApi(page, tasks);
  await page.goto('/app/tasks');
  await expect(
    page.getByRole('heading', {name: 'Tasks', exact: true}),
  ).toBeVisible();
}

test('task list loads', async ({page}) => {
  await openTaskList(page);

  await expect(
    page.getByRole('link', {name: `View details for ${DEFAULT_TASK.name}`}),
  ).toBeVisible();
  await expect(page.getByText('1 task', {exact: true})).toBeVisible();
});

test('user can create a task with the minimum required fields and see it in the list', async ({page}) => {
  await openTaskList(page, []);
  await page.getByRole('button', {name: 'Create task'}).click();

  const dialog = page.getByRole('dialog', {name: 'Create task'});
  await dialog.getByLabel('Task name').fill('Test smoke alarms');
  await dialog.getByRole('button', {name: 'Create task'}).click();

  await expect(dialog).not.toBeVisible();
  await expect(
    page.getByRole('link', {name: 'View details for Test smoke alarms'}),
  ).toBeVisible();
});

test('user can open task details', async ({page}) => {
  await openTaskList(page);

  await page
    .getByRole('link', {name: `View details for ${DEFAULT_TASK.name}`})
    .click();

  await expect(page).toHaveURL(`/app/tasks/${DEFAULT_TASK.id}`);
  await expect(
    page.getByRole('heading', {name: DEFAULT_TASK.name, exact: true}),
  ).toBeVisible();
  await expect(page.getByRole('heading', {name: 'Task information'})).toBeVisible();
});

test('user can edit a task', async ({page}) => {
  await openTaskList(page);
  await page.getByRole('button', {name: `Edit ${DEFAULT_TASK.name}`}).click();

  const dialog = page.getByRole('dialog', {name: 'Edit task'});
  const taskName = dialog.getByLabel('Task name');
  await expect(taskName).toHaveValue(DEFAULT_TASK.name);
  await taskName.fill('Replace kitchen water filter');
  await dialog.getByRole('button', {name: 'Save changes'}).click();

  await expect(dialog).not.toBeVisible();
  await expect(
    page.getByRole('link', {name: 'View details for Replace kitchen water filter'}),
  ).toBeVisible();
});

test('user can mark a task as completed', async ({page}) => {
  await openTaskList(page);
  await page.getByRole('button', {name: 'Complete', exact: true}).click();

  const dialog = page.getByRole('dialog', {name: 'Complete task'});
  await expect(dialog.getByText(`“${DEFAULT_TASK.name}”`)).toBeVisible();
  await dialog.getByRole('button', {name: 'Complete task'}).click();

  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole('button', {name: 'Completed'})).toBeDisabled();
});

test('user can delete a task after confirmation', async ({page}) => {
  await openTaskList(page);
  await page.getByRole('button', {name: `Delete ${DEFAULT_TASK.name}`}).click();

  const dialog = page.getByRole('dialog', {name: 'Delete task'});
  await expect(dialog.getByText(`"${DEFAULT_TASK.name}"`, {exact: false})).toBeVisible();
  await dialog.getByRole('button', {name: 'Delete task'}).click();

  await expect(dialog).not.toBeVisible();
  await expect(
    page.getByRole('link', {name: `View details for ${DEFAULT_TASK.name}`}),
  ).not.toBeVisible();
  await expect(page.getByText('Your list is clear.')).toBeVisible();
});

test('cancelling the delete dialog keeps the task', async ({page}) => {
  await openTaskList(page);
  await page.getByRole('button', {name: `Delete ${DEFAULT_TASK.name}`}).click();

  const dialog = page.getByRole('dialog', {name: 'Delete task'});
  await dialog.getByRole('button', {name: 'Cancel'}).click();

  await expect(dialog).not.toBeVisible();
  await expect(
    page.getByRole('link', {name: `View details for ${DEFAULT_TASK.name}`}),
  ).toBeVisible();
});
