import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'

import configureStore from '../store/configureStore'

export const renderWithStore = (ui, store = configureStore()) => {
  const { container } = render(<Provider store={ store }>{ ui }</Provider>)
  return { container, store }
}
