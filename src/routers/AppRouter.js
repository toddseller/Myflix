import React from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import createHistory from 'history/createBrowserHistory'

import HomePage from '../components/HomePage'
import Login from '../components/Login'
import Footer from '../components/Footer'
import '../styles/base.css'

export const history = createHistory()

const AppRouter = () => {
  return (
    <div className="site">
      <Router history={ history }>
        <div className="site-content">
          <Switch>
            <Route path="/" exact component={ HomePage } />
            <Route path="/login" component={ Login } />
          </Switch>
        </div>
      </Router>
      <Footer />
    </div>
)
}

export default AppRouter