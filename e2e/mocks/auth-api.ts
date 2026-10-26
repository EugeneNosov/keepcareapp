import type { Page } from '@playwright/test';

export const TEST_USER = {
  id: 'user-1',
  email: 'alex@example.com',
  displayName: 'Alex',
  emailVerifiedAt: '2026-01-01T00:00:00.000Z',
  timezone: 'Europe/Prague',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

const AUTH_RESPONSE = {
  accessToken: 'playwright-access-token',
  user: TEST_USER,
};

export async function mockUnauthenticatedSession(page: Page) {
  await page.route('**/auth/refresh', async (route) => {
    await route.fulfill({
      status: 401,
      json: {message: 'No active session.'},
    });
  });
}

export async function mockAuthenticatedSession(page: Page) {
  await page.route('**/auth/refresh', async (route) => {
    await route.fulfill({json: AUTH_RESPONSE});
  });
}

export async function mockSuccessfulLogin(page: Page) {
  await page.route('**/auth/login', async (route) => {
    await route.fulfill({json: AUTH_RESPONSE});
  });
}

export async function mockInvalidLogin(page: Page) {
  await page.route('**/auth/login', async (route) => {
    await route.fulfill({
      status: 401,
      json: {message: 'Invalid email or password.'},
    });
  });
}

export async function mockLogout(page: Page) {
  await page.route('**/auth/logout', async (route) => {
    await route.fulfill({status: 204});
  });
}
