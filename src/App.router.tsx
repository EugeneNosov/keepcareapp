import { createBrowserRouter, Navigate } from 'react-router';
import { ROUTES } from './app.constants.ts';
import { PublicLayout } from './layouts/PublicLayout.tsx';
import { UnexpectedErrorPage } from './features/errors/pages/UnexpectedErrorPage.tsx';

export const router = createBrowserRouter([
  {
    errorElement: <UnexpectedErrorPage/>,
    children: [
      {
        element: <PublicLayout/>,
        children: [
          {
            path: ROUTES.home,
            lazy: async () => {
              const { LandingPage } = await import('./features/marketing/pages/LandingPage.tsx');

              return { Component: LandingPage };
            },
          },
          {
            path: ROUTES.login,
            lazy: async () => {
              const { LoginPage } = await import('./features/auth/pages/LoginPage.tsx');

              return { Component: LoginPage };
            },
          },
          {
            path: ROUTES.register,
            lazy: async () => {
              const { RegisterPage } = await import('./features/auth/pages/RegisterPage.tsx');

              return { Component: RegisterPage };
            },
          },
        ],
      },
      {
        path: ROUTES.app,
        lazy: async () => {
          const { ProtectedLayout } = await import('./layouts/ProtectedLayout.tsx');

          return { Component: ProtectedLayout };
        },
        children: [
          {
            index: true,
            element: <Navigate to={ROUTES.tasks} replace/>,
          },
          {
            path: 'tasks',
            lazy: async () => {
              const { TasksListPage } = await import('./features/tasks/pages/TasksListPage.tsx');

              return { Component: TasksListPage };
            },
          },
        ],
      },
      {
        path: '*',
        lazy: async () => {
          const { NotFoundPage } = await import('./features/errors/pages/NotFoundPage.tsx');

          return { Component: NotFoundPage };
        },
      },
    ],
  },
]);
