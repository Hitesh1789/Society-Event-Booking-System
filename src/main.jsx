import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import Store from './store/store.js'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from "./pages/Home.jsx"
import Login from "./pages/Login.jsx"
import Signup from "./pages/Signup.jsx"
import Dashboard from './pages/Dashboard.jsx'
import AllSocieties from './pages/AllSocieties.jsx'
import Protected from './components/Protected.jsx'
import MySocieties from './pages/MySocieties.jsx'
import Event from './pages/Event.jsx';
import Society from './pages/Society.jsx'
import MyEvents from './pages/MyEvents.jsx'
import CreateSociety from './pages/CreateSociety.jsx'
import Drafts from './pages/Drafts.jsx'
import DraftForm from './components/DraftForm.jsx'
import EventApproval from './pages/EventApproval.jsx'
import Draft from './pages/Draft.jsx'
import DraftHistory from './pages/DraftHistory.jsx'
import UpdateEvent from './pages/UpdateEvent.jsx'
import RegisteredUsers from './pages/RegisteredUsers.jsx'
import EventSummary from './pages/EventSummary.jsx'

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
        path: '/my-societies',
        element: (
          <Protected authentication>
            <MySocieties />
          </Protected>
        )
      }
      , {
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
      {
        path: '/event/:eventId',
        element: (
          <Protected authentication>
            <Event />
          </Protected>
        )
      },
      {
        path: '/society/:societyId',
        element: (
          <Protected authentication>
            <Society />
          </Protected>
        )
      },
      {
        path: '/my-events',
        element: (
          <Protected authentication>
            <MyEvents />
          </Protected>
        )
      },
      {
        path: '/create-society',
        element: (
          <Protected authentication>
            <CreateSociety />
          </Protected>
        )
      },
      {
        path: '/drafts',
        element: (
          <Protected authentication>
            <Drafts />
          </Protected>
        )
      },
      {
        path:'/drafts/:draftId',
        element:(
          <Protected authentication>
            <Draft />
          </Protected>
        )
      },
      {
        path: '/create-draft',
        element: (
          <Protected authentication>
            <DraftForm/>
          </Protected>
        )
      },
      {
        path: '/event-approval',
        element: (
          <Protected authentication>
            <EventApproval/>
          </Protected>
        )
      },
      {
        path:'/draft-history/:draftId',
        element:(
          <Protected authentication>
            <DraftHistory/>
          </Protected>
        )
      },
      {
        path:'/update-event/:eventId',
        element:(
          <Protected authentication>
            <UpdateEvent />
          </Protected>
        )
      },
      {
        path:'/view-registered-users/:eventId',
        element:(
          <Protected authentication>
            <RegisteredUsers/>
          </Protected>
        )
      },
      {
        path: '/event-summary/:eventId',
        element: (
          <Protected authentication>
            <EventSummary />
          </Protected>
        )
      }
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