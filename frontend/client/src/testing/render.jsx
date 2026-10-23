import React from 'react'
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'

import configureStore from '../store/configureStore'

export const renderWithStore = (ui, store = configureStore()) => {
  const container = document.createElement('div')
  document.body.appendChild(container)
  act(() => {
    ReactDOM.render(<Provider store={ store }>{ ui }</Provider>, container)
  })
  return { container, store }
}
