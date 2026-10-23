import React from 'react'
import ReactDOM from 'react-dom'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { Provider } from 'react-redux'

import AppRouter, { history } from './routers/AppRouter'
import configureStore from './store/configureStore'
import LoadingPage from './components/LoadingPage'
import { getHomePageData } from './actions/homePage'
import mmdb from './apis/mmdb'
import { installSessionExpiry } from './apis/sessionExpiry'

const store = configureStore()
installSessionExpiry(mmdb, { dispatch: store.dispatch, history, storages: [window.localStorage, window.sessionStorage] })
const jsx = (
  <MuiThemeProvider>
    <Provider store={ store }>
      <AppRouter />
    </Provider>
  </MuiThemeProvider>
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