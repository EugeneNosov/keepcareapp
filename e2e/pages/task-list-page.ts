import type { Locator, Page } from '@playwright/test';

export class TaskListPage {
  readonly createTaskButton: Locator;
  readonly heading: Locator;
  readonly historyLink: Locator;
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
    this.createTaskButton = page.getByRole('button', {name: 'Create task'});
    this.heading = page.getByRole('heading', {name: 'Tasks', exact: true});
    this.historyLink = page.getByRole('link', {name: 'History'});
  }

  async goto() {
    await this.page.goto('/app/tasks');
  }

  async openCreateTaskDialog() {
    await this.createTaskButton.click();
    return this.page.getByRole('dialog', {name: 'Create task'});
  }

  async openEditTaskDialog(taskName: string) {
    await this.editTaskButton(taskName).click();
    return this.page.getByRole('dialog', {name: 'Edit task'});
  }

  async openTaskDetails(taskName: string) {
    await this.taskLink(taskName).click();
  }

  taskLink(taskName: string) {
    return this.page.getByRole('link', {
      name: `View details for ${taskName}`,
    });
  }

  editTaskButton(taskName: string) {
    return this.page.getByRole('button', {name: `Edit ${taskName}`});
  }

  deleteTaskButton(taskName: string) {
    return this.page.getByRole('button', {name: `Delete ${taskName}`});
  }
}
