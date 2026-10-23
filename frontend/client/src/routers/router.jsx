import React from 'react'
import { createBrowserRouter, Outlet } from 'react-router-dom'

import HomePage from '../components/HomePage'
import Header from '../components/header/Header'
import Login from '../components/Login'
import Signup from '../components/Signup'
import UserPage from '../components/UserPage'

const Layout = () => (
  <div>
    <Header />
    <div className="site-content">
      <Outlet />
    </div>
  </div>
)

// Exported so code outside components (actions, the session-expiry interceptor) can navigate.
export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/login', element: <Login /> },
      { path: '/signup', element: <Signup /> },
      { path: '/browse/:id', element: <UserPage /> }
    ]
  }
])
