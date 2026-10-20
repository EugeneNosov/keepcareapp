import { expect, test } from '@playwright/test';
import {
  mockAuthenticatedSession,
  mockInvalidLogin,
  mockLogout,
  mockSuccessfulLogin,
  mockUnauthenticatedSession,
} from './support/mock-api.ts';
import {mockTaskApi} from './support/mock-task-api.ts';

test('landing page opens successfully', async ({page}) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', {name: 'Keep up with the things that matter.'}),
  ).toBeVisible();
  await expect(page.getByRole('link', {name: 'Sign in'})).toBeVisible();
  await expect(page.getByRole('link', {name: 'Create account'})).toBeVisible();
});

test('user can navigate to login and registration', async ({page}) => {
  await mockUnauthenticatedSession(page);
  await page.goto('/');

  await page.getByRole('link', {name: 'Sign in'}).click();
  await expect(page).toHaveURL('/login');
  await expect(page.getByRole('heading', {name: 'Sign in'})).toBeVisible();

  await page.getByRole('link', {name: 'Create account'}).click();
  await expect(page).toHaveURL('/register');
  await expect(page.getByRole('heading', {name: 'Create account'})).toBeVisible();
});

test('valid login redirects to the task list', async ({page}) => {
  await mockUnauthenticatedSession(page);
  await mockSuccessfulLogin(page);
  await mockTaskApi(page, []);
  await page.goto('/login');

  await page.getByLabel('Email address').fill('alex@example.com');
  await page.getByLabel('Password').fill('correct-password');
  await page.getByRole('button', {name: 'Sign in'}).click();

  await expect(page).toHaveURL('/app/tasks');
  await expect(
    page.getByRole('heading', {name: 'Tasks', exact: true}),
  ).toBeVisible();
});

test('invalid login displays an error', async ({page}) => {
  await mockUnauthenticatedSession(page);
  await mockInvalidLogin(page);
  await page.goto('/login');

  await page.getByLabel('Email address').fill('alex@example.com');
  await page.getByLabel('Password').fill('wrong-password');
  await page.getByRole('button', {name: 'Sign in'}).click();

  await expect(page).toHaveURL('/login');
  await expect(page.getByRole('alert')).toHaveText('Invalid email or password.');
});

test('unauthenticated user cannot open protected routes', async ({page}) => {
  await mockUnauthenticatedSession(page);

  await page.goto('/app/tasks');

  await expect(page).toHaveURL('/login');
  await expect(page.getByRole('heading', {name: 'Sign in'})).toBeVisible();
});

test('logout returns the user to a public page', async ({page}) => {
  await mockAuthenticatedSession(page);
  await mockTaskApi(page, []);
  await mockLogout(page);
  await page.goto('/app/tasks');
  await expect(
    page.getByRole('heading', {name: 'Tasks', exact: true}),
  ).toBeVisible();

  await page.getByRole('button', {name: 'Logout'}).click();

  await expect(page).toHaveURL('/login');
  await expect(page.getByRole('heading', {name: 'Sign in'})).toBeVisible();
});
