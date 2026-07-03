import { createBrowserRouter, Navigate } from 'react-router';
import { ROUTES } from './app.constants.ts';
import { PublicLayout } from './layouts/PublicLayout.tsx';
import { LandingPage } from './features/marketing/pages/LandingPage.tsx';
import { LoginPage } from './features/auth/pages/LoginPage.tsx';
import { RegisterPage } from './features/auth/pages/RegisterPage.tsx';
import { ProtectedLayout } from './layouts/ProtectedLayout.tsx';
import { TasksListPage } from './features/tasks/pages/TasksListPage.tsx';
import { NotFoundPage } from './features/errors/pages/NotFoundPage.tsx';
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
            element: <LandingPage/>,
          },
          {
            path: ROUTES.login,
            element: <LoginPage/>,
          },
          {
            path: ROUTES.register,
            element: <RegisterPage/>,
          },
        ],
      },
      {
        path: ROUTES.app,
        element: <ProtectedLayout/>,
        children: [
          {
            index: true,
            element: <Navigate to={ROUTES.tasks} replace/>,
          },
          {
            path: 'tasks',
            element: <TasksListPage/>,
          },
        ],
      },
      {
        path: '*',
        element: <NotFoundPage/>,
      },
    ],
  },
]);
