import React from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import createHistory from 'history/createBrowserHistory'
import 'normalize.css'

import HomePage from '../components/HomePage'
import Header from '../components/header/Header'
import Login from '../components/Login'
import Signup from '../components/Signup'
import UserPage from '../components/UserPage'
import Footer from '../components/Footer'
import '../styles/base.css'

export const history = createHistory()

const AppRouter = () => {
  return (
    <div className="site">
      <Router history={ history }>
        <div>
          <Header />
          <div className="site-content">
            <Switch>
              <Route path="/" exact component={ HomePage } />
              <Route path="/login" component={ Login } />
              <Route path="/signup" component={ Signup } />
              <Route path="/browse/:id" component={ UserPage } />
            </Switch>
          </div>
        </div>
      </Router>
      <Footer />
    </div>
  )
}

export default AppRouter