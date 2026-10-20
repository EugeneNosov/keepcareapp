import { expect, test } from '@playwright/test';

test('serves the application', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: 'Keep up with the things that matter.' }),
  ).toBeVisible();
});
