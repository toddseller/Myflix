import React from 'react'
import { RouterProvider } from 'react-router-dom'
import 'normalize.css'

import { router } from './router'
import '../styles/base.css'

const AppRouter = () => (
  <div className="site">
    <RouterProvider router={ router } />
  </div>
)

export default AppRouter
