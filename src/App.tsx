import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router'
import './App.css'
import { LoginPage } from './features/auth/pages/LoginPage'
import { LandingPage } from './features/marketing/pages/LandingPage'
import { TasksListPage } from './features/tasks/pages/TasksListPage'
import { ProtectedLayout } from './layouts/ProtectedLayout'
import { PublicLayout } from './layouts/PublicLayout'

const router = createBrowserRouter([
  {
    element: <PublicLayout/>,
    children: [
      {
        path: '/',
        element: <LandingPage/>,
      },
      {
        path: '/login',
        element: <LoginPage/>,
      },
    ],
  },
  {
    element: <ProtectedLayout/>,
    children: [
      {
        path: '/tasks',
        element: <TasksListPage/>,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace/>,
  },
])

function App() {
  return <RouterProvider router={router}/>
}

export default App
