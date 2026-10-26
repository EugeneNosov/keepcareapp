# KeepCare

KeepCare is a React application for managing recurring household and personal care tasks. Users can create a repeating task once, see what is overdue or due soon, record completions, and review the resulting activity history.

This repository contains the frontend application. It expects a separate KeepCare API for authentication, task data, and history.


## Technology

- React 19 and TypeScript
- Vite 8
- React Router 8
- TanStack Query
- React Hook Form and Zod
- Tailwind CSS 4
- Vitest, React Testing Library, and MSW for unit and component tests
- Playwright for browser tests
- ESLint for static analysis

## Prerequisites

- Node.js 24
- npm
- A running KeepCare API
- A Google OAuth client ID if Google sign-in is required

React Router 8 requires Node.js 22.22 or newer. Node.js 24 is the recommended development version for this project.

If you use NVM:

```bash
nvm install 24
nvm use 24
```

## Local setup

Install dependencies:

```bash
npm install
```

Create the local environment file:

```bash
cp .env.example .env
```

Update the values in `.env`:

```dotenv
VITE_API_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
```

`VITE_API_URL` is the base URL of the KeepCare API. The client sends credentials with API requests so that the backend can maintain the refresh session in a cookie.

`VITE_GOOGLE_CLIENT_ID` identifies the browser OAuth client used by the Google sign-in button. Configure the corresponding local origin in Google Cloud before testing Google authentication.

Variables prefixed with `VITE_` are included in the browser bundle. Never put private keys, client secrets, passwords, or other server-side credentials in them.

Start the development server:

```bash
npm run dev
```

Vite prints the local URL when the server is ready. The default is `http://localhost:5173`.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server with hot module replacement. |
| `npm run build` | Type-check the project and create a production build in `dist/`. |
| `npm run preview` | Serve the production build locally for a final browser check. |
| `npm run lint` | Run ESLint across the repository. |
| `npm run test:unit` | Run all Vitest unit and component tests once. |
| `npm run test:unit:watch` | Run Vitest in watch mode during development. |
| `npm run test:unit:coverage` | Run Vitest and write text and HTML coverage reports. |
| `npm run test:e2e` | Run all Playwright tests headlessly. This is the default command for automation and CI. |
| `npm run test:e2e:ui` | Open Playwright UI Mode for selecting, running, and inspecting tests interactively. |
| `npm run test:e2e:headed` | Run tests with visible browser windows. |
| `npm run test:e2e:debug` | Open Playwright Inspector and step through a test. |
| `npm run test:e2e:report` | Open the HTML report from the latest Playwright run. |

## Unit and component tests

Vitest is the unit-test runner. React Testing Library exercises component behavior through the interface a user can observe, `user-event` provides realistic interactions, and MSW supplies deterministic API responses where a test needs HTTP behavior.

Tests are colocated with the code they cover and use `.test.ts` for TypeScript logic or `.test.tsx` for React components. Pure logic tests run in the faster Node environment. A component test opts into jsdom at the top of the file and loads the shared DOM cleanup and matchers:

```ts
// @vitest-environment jsdom

import '@/test/setup-dom.ts';
```

Run the complete suite once:

```bash
npm run test:unit
```

During development, use `npm run test:unit:watch`. To inspect coverage, run `npm run test:unit:coverage` and open `coverage/index.html`.

The suite focuses on deterministic behavior: date and display utilities, history filtering, environment validation, API errors, validation schemas, query-cache updates, authentication state, and selected interactive components. It intentionally avoids assertions about static layouts, simple wrappers, CSS classes, icons, and workflows already covered adequately by Playwright.

The authentication-state tests verify login, logout, initial session loading, failed session restoration, and protection of content until authentication is known. Component tests cover meaningful behavior in `ExpandableNote`, `Dialog`, `Checkbox`, and `DatePicker`. `TaskItem` and `TaskForm` workflows remain in Playwright because their user-visible actions are already covered there; their schemas and cache updates are tested directly with Vitest.

## Browser tests

Install the Playwright-managed browsers after installing the npm dependencies:

```bash
npx playwright install
```

The Playwright configuration starts the Vite server automatically. You do not need to run `npm run dev` in another terminal before running the tests. If a local server is already available, Playwright reuses it outside CI.

The suite currently runs against:

- Chromium
- Firefox
- WebKit

Run the suite:

```bash
npm run test:e2e
```

The current browser suite covers the landing page, core authentication flows, task management, form validation, navigation and error handling, and history workflows. Its route handlers in `e2e/mocks/` provide predictable data, keep tests independent, and avoid using production records. Failed runs retain screenshots and video; the first CI retry also records a Playwright trace.

Generated results are written to ignored directories such as `playwright-report/` and `test-results/`.

See the [Playwright installation guide](https://playwright.dev/docs/intro) for supported operating systems and browser installation details.

## Project structure

```text
e2e/
  fixtures/                Opt-in Playwright fixtures
  mocks/                   Domain API handlers and typed fixture data
  pages/                   Reusable Task List and History page objects
  tests/                   Playwright browser-test specifications
src/
  components/              Reusable interface components and interaction tests
  features/
    auth/                   Authentication API, state, validation, forms, and tests
    errors/                 Route and unexpected-error pages
    history/                Activity history queries, filters, and views
    marketing/              Public landing page
    tasks/                  Task API, cache logic, validation, forms, pages, and tests
  layouts/                  Public, authentication, and protected layouts
  shared/                   Shared API, history, cache, and date utilities with tests
  test/                     Shared Vitest, jsdom, and MSW setup
  App.router.tsx            Route definitions and lazy-loaded pages
  main.tsx                  Application providers and global error handling
playwright.config.ts        Browser-test configuration
vitest.config.ts            Unit-test environments, setup, aliases, and coverage
vite.config.ts              Vite, React, Tailwind, and import-alias setup
```

The `@/` import alias resolves to `src/`.

## Authentication model

The API returns a short-lived access token, which the frontend keeps in memory and sends as a bearer token. API requests also include credentials so the server can use its refresh cookie. When an authenticated request receives `401 Unauthorized`, the client performs one shared token-refresh request and retries the original request once.

If refresh fails, local authentication and cached server data are cleared. The backend remains responsible for cookie security, authorization, token lifetime, and refresh-token rotation.

## Before opening a pull request

Run the same basic checks used during development:

```bash
npm run lint
npm run build
npm run test:unit
npm run test:e2e
```

The browser tests require the Playwright-managed browsers to be installed. Both test suites use controlled mocks and do not require a running KeepCare API.
