import type { Locator, Page } from '@playwright/test';

export class HistoryPage {
  readonly filterButton: Locator;
  readonly heading: Locator;
  readonly page: Page;
  readonly tasksLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.filterButton = page.getByRole('button', {name: 'Filter history'});
    this.heading = page.getByRole('heading', {name: 'History', exact: true});
    this.tasksLink = page.getByRole('link', {name: 'Tasks'});
  }

  async goto() {
    await this.page.goto('/app/history');
  }

  async openFilters() {
    await this.filterButton.click();
    return this.page.getByRole('dialog', {name: 'History filters'});
  }

  async toggleEventType(eventType: string) {
    const filters = this.page.getByRole('dialog', {name: 'History filters'});
    await filters.getByText(eventType, {exact: true}).click();
  }
}
