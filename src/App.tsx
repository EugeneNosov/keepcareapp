import { RouterProvider } from 'react-router'
import './App.css'
import { router } from './App.router.tsx';


function App() {
  return <RouterProvider router={router}/>
}

export default App
