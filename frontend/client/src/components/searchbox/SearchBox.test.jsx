import React from 'react'
import { fireEvent } from '@testing-library/react'

import mmdb from '../../apis/mmdb'
import SearchBox from './SearchBox'
import { fetchSearchNewMovies } from '../../actions/newMovie'
import { renderWithStore } from '../../testing/render'

vi.mock('../../apis/mmdb', () => ({ default: { get: vi.fn(() => new Promise(() => {})) } }))

const setup = () => {
  const props = { onSearch: vi.fn(), onClose: vi.fn() }
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

it('opens on the toggle button', () => {
  const { container, toggle, props } = setup()
  const width = () => container.firstChild.style.width
  expect(width()).toBe('45px')
  fireEvent.click(toggle)
  expect(width()).toBe('345px')
})

it('filters as you type', () => {
  const { input, store } = setup()
  fireEvent.change(input, { target: { value: 'dark' } })
  expect(store.getState().filters.text).toBe('dark')
})

it('searches for new movies on submit', () => {
  const { input, form, props } = setup()
  fireEvent.change(input, { target: { value: 'dark' } })
  fireEvent.submit(form)
  expect(props.onSearch).toHaveBeenCalledTimes(1)
  expect(mmdb.get).toHaveBeenCalledWith('/add_movie', expect.objectContaining({ params: { query: 'dark' } }))
})

it('reports a second search too, so its results show', () => {
  const { form, props } = setup()
  fireEvent.submit(form)
  fireEvent.submit(form)
  expect(props.onSearch).toHaveBeenCalledTimes(2)
})

it('doesn\'t report a close when it opens', () => {
  const { toggle, props } = setup()
  fireEvent.click(toggle)
  expect(props.onClose).not.toHaveBeenCalled()
})

it.each([0, 1, 69])('reports a close after a search with %i results', count => {
  const { toggle, store, props } = setup()
  fireEvent.click(toggle)
  store.dispatch(fetchSearchNewMovies(Array.from({ length: count }, (_, i) => ({ title: `M${ i }` }))))
  fireEvent.click(toggle)
  expect(props.onClose).toHaveBeenCalledTimes(1)
})
