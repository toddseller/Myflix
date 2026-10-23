import React from 'react'
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import ShowPreview from './index'

const render = title => {
  const show = { id: 1, title, poster: 'poster.jpg', seasonCount: '1', seasonNumbers: '1' }
  const container = document.createElement('div')
  act(() => {
    ReactDOM.render(
      <Provider store={ createStore(() => ({ shows: { 1: show } })) }>
        <ShowPreview id={ 1 } onClick={ () => {} } />
      </Provider>,
      container
    )
  })
  return container
}

it('decodes entities in the title', () => {
  expect(render('Law &amp; Order').querySelector('.truncate').textContent).toBe('Law & Order')
})

it('never turns markup in a title into elements', () => {
  const container = render('<img src="x" onerror="window.__xss = true">Dark')
  expect(container.querySelector('.truncate').children).toHaveLength(0)
  expect(container.querySelector('img[src="x"]')).toBeNull()
  expect(window.__xss).toBeUndefined()
})
