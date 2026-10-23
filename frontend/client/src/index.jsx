import React from 'react'
import { createRoot } from 'react-dom/client'
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
  <Provider store={ store }>
    <AppRouter />
  </Provider>
)
const root = createRoot(document.getElementById('root'))
root.render(<LoadingPage />)

store.dispatch(getHomePageData()).then(() => {
  root.render(jsx)
})