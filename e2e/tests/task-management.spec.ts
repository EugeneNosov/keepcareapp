import { expect, test } from '../fixtures/test.ts';
import {
  DEFAULT_TASK,
  mockTaskApi,
  type MockTask,
} from '../mocks/task-api.ts';
import type { TaskListPage } from '../pages/task-list-page.ts';

async function openTaskList(taskListPage: TaskListPage, tasks?: MockTask[]) {
  await mockTaskApi(taskListPage.page, tasks);
  await taskListPage.goto();
  await expect(taskListPage.heading).toBeVisible();
}

test('task list loads', async ({taskListPage}) => {
  await openTaskList(taskListPage);

  await expect(taskListPage.taskLink(DEFAULT_TASK.name)).toBeVisible();
  await expect(
    taskListPage.page.getByText('1 task', {exact: true}),
  ).toBeVisible();
});

test('user can create a task with the minimum required fields and see it in the list', async ({taskListPage}) => {
  await openTaskList(taskListPage, []);

  const dialog = await taskListPage.openCreateTaskDialog();
  await dialog.getByLabel('Task name').fill('Test smoke alarms');
  await dialog.getByRole('button', {name: 'Create task'}).click();

  await expect(dialog).not.toBeVisible();
  await expect(taskListPage.taskLink('Test smoke alarms')).toBeVisible();
});

test('user can open task details', async ({taskListPage}) => {
  await openTaskList(taskListPage);

  await taskListPage.openTaskDetails(DEFAULT_TASK.name);

  await expect(taskListPage.page).toHaveURL(`/app/tasks/${DEFAULT_TASK.id}`);
  await expect(
    taskListPage.page.getByRole('heading', {
      name: DEFAULT_TASK.name,
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    taskListPage.page.getByRole('heading', {name: 'Task information'}),
  ).toBeVisible();
});

test('user can edit a task', async ({taskListPage}) => {
  await openTaskList(taskListPage);
  await taskListPage.editTaskButton(DEFAULT_TASK.name).click();

  const dialog = taskListPage.page.getByRole('dialog', {name: 'Edit task'});
  const taskName = dialog.getByLabel('Task name');
  await expect(taskName).toHaveValue(DEFAULT_TASK.name);
  await taskName.fill('Replace kitchen water filter');
  await dialog.getByRole('button', {name: 'Save changes'}).click();

  await expect(dialog).not.toBeVisible();
  await expect(
    taskListPage.taskLink('Replace kitchen water filter'),
  ).toBeVisible();
});

test('user can mark a task as completed', async ({taskListPage}) => {
  await openTaskList(taskListPage);
  await taskListPage.page
    .getByRole('button', {name: 'Complete', exact: true})
    .click();

  const dialog = taskListPage.page.getByRole('dialog', {name: 'Complete task'});
  await expect(dialog.getByText(`“${DEFAULT_TASK.name}”`)).toBeVisible();
  await dialog.getByRole('button', {name: 'Complete task'}).click();

  await expect(dialog).not.toBeVisible();
  await expect(
    taskListPage.page.getByRole('button', {name: 'Completed'}),
  ).toBeDisabled();
});

test('user can delete a task after confirmation', async ({taskListPage}) => {
  await openTaskList(taskListPage);
  await taskListPage.deleteTaskButton(DEFAULT_TASK.name).click();

  const dialog = taskListPage.page.getByRole('dialog', {name: 'Delete task'});
  await expect(dialog.getByText(`"${DEFAULT_TASK.name}"`, {exact: false})).toBeVisible();
  await dialog.getByRole('button', {name: 'Delete task'}).click();

  await expect(dialog).not.toBeVisible();
  await expect(taskListPage.taskLink(DEFAULT_TASK.name)).not.toBeVisible();
  await expect(
    taskListPage.page.getByText('Your list is clear.'),
  ).toBeVisible();
});

test('cancelling the delete dialog keeps the task', async ({taskListPage}) => {
  await openTaskList(taskListPage);
  await taskListPage.deleteTaskButton(DEFAULT_TASK.name).click();

  const dialog = taskListPage.page.getByRole('dialog', {name: 'Delete task'});
  await dialog.getByRole('button', {name: 'Cancel'}).click();

  await expect(dialog).not.toBeVisible();
  await expect(taskListPage.taskLink(DEFAULT_TASK.name)).toBeVisible();
});
