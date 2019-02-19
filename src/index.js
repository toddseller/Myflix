import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import AppRouter from './routers/AppRouter'
import configureStore from './store/configureStore'
import LoadingPage from './components/LoadingPage'
import { getHomePageData } from './actions/homePage'

const store = configureStore()
const jsx = (
  <Provider store={ store }>
    <AppRouter />
  </Provider>
)
let hasRendered = false
const renderApp = () => {
  if (!hasRendered) {
    ReactDOM.render(jsx, document.getElementById('root'))
    hasRendered = true
  }
}

ReactDOM.render(<LoadingPage />, document.getElementById('root'))

store.dispatch(getHomePageData()).then(() => {
  renderApp()
})