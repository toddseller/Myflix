import React from 'react'
import { act, Simulate } from 'react-dom/test-utils'

import mmdb from '../../apis/mmdb'
import SearchBox from './SearchBox'
import { renderWithStore } from '../../testing/render'

jest.mock('../../apis/mmdb', () => ({ __esModule: true, default: { get: jest.fn(() => new Promise(() => {})) } }))

const step = event => act(() => { event() })

const setup = () => {
  const props = { isLoading: jest.fn(), onClick: jest.fn() }
  const { container, store } = renderWithStore(<SearchBox { ...props } />)
  const buttons = container.querySelectorAll('button')
  return { container, store, props, input: container.querySelector('input[name="search"]'), toggle: buttons[0], submit: buttons[1], form: container.querySelector('form') }
}

beforeEach(() => {
  window.localStorage.setItem('myflixUser', JSON.stringify({ token: 't', user: { id: 1 } }))
  mmdb.get.mockClear()
})

it('renders a search input, a toggle button and a submit button', () => {
  const { input, toggle, submit } = setup()
  expect(input).not.toBeNull()
  expect(toggle).not.toBeNull()
  expect(submit.getAttribute('type')).toBe('submit')
})

it('opens on the toggle button and reports loading', () => {
  const { container, toggle, props } = setup()
  const width = () => container.firstChild.style.width
  expect(width()).toBe('45px')
  step(() => Simulate.click(toggle))
  expect(width()).toBe('345px')
  expect(props.isLoading).toHaveBeenCalledTimes(1)
})

it('filters as you type', () => {
  const { input, store } = setup()
  step(() => Simulate.change(input, { target: { value: 'dark' } }))
  expect(store.getState().filters.text).toBe('dark')
})

it('searches for new movies on submit', () => {
  const { input, form, props } = setup()
  step(() => Simulate.change(input, { target: { value: 'dark' } }))
  step(() => Simulate.submit(form))
  expect(props.onClick).toHaveBeenCalledTimes(1)
  expect(mmdb.get).toHaveBeenCalledWith('/add_movie', expect.objectContaining({ params: { query: 'dark' } }))
})
