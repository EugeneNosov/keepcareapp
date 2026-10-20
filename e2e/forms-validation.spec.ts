import { expect, test, type Page } from '@playwright/test';
import { mockAuthenticatedSession } from './support/mock-api.ts';
import { mockTaskApi } from './support/mock-task-api.ts';

async function openCreateTaskDialog(page: Page) {
  await mockAuthenticatedSession(page);
  await mockTaskApi(page, []);
  await page.goto('/app/tasks');
  await page.getByRole('button', {name: 'Create task'}).click();

  return page.getByRole('dialog', {name: 'Create task'});
}

test('required-field validation is displayed', async ({page}) => {
  const dialog = await openCreateTaskDialog(page);
  const taskName = dialog.getByLabel('Task name');

  await taskName.fill('Temporary name');
  await taskName.clear();

  await expect(dialog.getByRole('alert')).toContainText('Task name is required');
  await expect(dialog.getByRole('button', {name: 'Create task'})).toBeDisabled();
});

test('invalid dates and repeat values are rejected', async ({page}) => {
  const dialog = await openCreateTaskDialog(page);
  await dialog.getByLabel('Task name').fill('Inspect smoke alarms');

  await dialog.getByLabel('Starts at').click();
  await page
    .getByRole('dialog', {name: 'Choose start date'})
    .getByRole('button', {name: 'Clear'})
    .click();

  const validationAlert = dialog.getByRole('alert');
  await expect(validationAlert).toContainText('Start date is required');

  await dialog.getByLabel('Starts at').click();
  await page
    .getByRole('dialog', {name: 'Choose start date'})
    .getByRole('button', {name: 'Today', exact: true})
    .click();
  const repeatValue = dialog.getByLabel('Repeat every');
  await repeatValue.fill('0');

  await expect(repeatValue).toHaveValue('0');
  await expect(dialog.getByRole('button', {name: 'Create task'})).toBeDisabled();
});

test('cancelling a create form clears draft values', async ({page}) => {
  let dialog = await openCreateTaskDialog(page);
  await dialog.getByLabel('Task name').fill('Unfinished task');
  await dialog.getByLabel('Notes').fill('This draft should be discarded.');
  await dialog.getByRole('button', {name: 'Cancel'}).click();
  await expect(dialog).not.toBeVisible();

  await page.getByRole('button', {name: 'Create task'}).click();
  dialog = page.getByRole('dialog', {name: 'Create task'});

  await expect(dialog.getByLabel('Task name')).toHaveValue('');
  await expect(dialog.getByLabel('Notes')).toHaveValue('');
  await expect(dialog.getByLabel('Repeat every')).toHaveValue('3');
});
