import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import Store from './store/store.js'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from "./pages/Home.jsx"
import Login from "./pages/Login.jsx"
import Signup from "./pages/ram.jsx"
import Dashboard from './pages/Dashboard.jsx'
import AllSocieties from './pages/AllSocieties.jsx'
import Protected from './components/Protected.jsx'
import MySocieties from './pages/MySocieties.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/dashboard',
        element: (
          <Protected authentication>
            <Dashboard />
          </Protected>
        )
      },
      {
        path: '/all-societies',
        element: (
          <Protected authentication>
            <AllSocieties />
          </Protected>
        )
      },
      {
        path :'/my-societies',
        element :(
          <Protected authentication>
            <MySocieties />
          </Protected>
        )
      }
      ,{
        path: '/login',
        element: (
          <Protected authentication={false}>
            <Login />
          </Protected>
        )
      },
      {
        path: '/signup',
        element: (
          <Protected authentication={false}>
            <Signup />
          </Protected>
        )
      },
    ]
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={Store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)