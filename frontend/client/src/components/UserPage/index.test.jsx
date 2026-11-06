import React from 'react'
import { act, cleanup, fireEvent, waitFor } from '@testing-library/react'

import mmdb from '../../apis/mmdb'
import { renderWithStore } from '../../testing/render'
import { setSelectedMedia, setTextFilter } from '../../actions/filters'
import UserPage from './index'

vi.mock('../../apis/mmdb', () => ({ default: { get: vi.fn(), defaults: { headers: { common: {} } } } }))

const movie = id => ({ id, title: `M${ id }`, sort_name: `m${ id }`, search_name: `m${ id }`, poster: `${ id }.jpg`, year: 2000 })
const movies = [1, 2, 3, 4, 5, 6, 7].map(movie)
const shows = [{ id: 50, title: 'S', sort_name: 's', search_name: 's', poster: 's.jpg', seasonCount: 1, seasonNumbers: '1' }]
const lists = { '/movies': movies, '/shows': shows, '/counts': { moviesCount: 7, showsCount: 1, episodesCount: 1 } }

// Details requests stay pending until the test answers them, so it controls the order they land in.
let pending
const answer = (id, data = { ...movie(id), plot: `Plot ${ id }` }) => act(async () => pending[`/movies/${ id }`].resolve({ data }))
const fail = id => act(async () => pending[`/movies/${ id }`].reject(new Error('down')))

// jsdom does no layout: tiles sit three to a row, and a drawer is on a line of its own.
const offsetTop = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetTop')
beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'offsetTop', {
    configurable: true,
    get() {
      if (this.classList.contains('info')) return -1
      const tiles = [...this.parentElement.children].filter(el => !el.classList.contains('info'))
      return Math.floor(tiles.indexOf(this) / 3) * 300
    }
  })
})
afterAll(() => Object.defineProperty(HTMLElement.prototype, 'offsetTop', offsetTop))

beforeEach(() => {
  window.localStorage.setItem('myflixUser', '{"token":"t"}')
  pending = {}
  mmdb.get.mockImplementation(async url => {
    if (lists[url]) return { data: lists[url] }
    return new Promise((resolve, reject) => { pending[url] = { resolve, reject } })
  })
})

const setup = async () => {
  const result = renderWithStore(<UserPage />)
  await waitFor(() => expect(result.container.querySelectorAll('.movie-preview')).toHaveLength(7))
  const tile = id => result.container.querySelector(`.movie-preview[id="${ id }"]`)
  const click = id => fireEvent.click(tile(id).querySelector('img'))
  const drawers = () => [...result.container.querySelectorAll('.info')]
  return { ...result, tile, click, drawers }
}

const closeTransition = el => fireEvent.transitionEnd(el, { propertyName: 'grid-template-rows' })

it('opens the details under the clicked poster\'s row', async () => {
  const { click, tile, drawers } = await setup()
  click(5)
  await answer(5)
  expect(drawers()).toHaveLength(1)
  expect(tile(6).nextElementSibling).toBe(drawers()[0])
  expect(drawers()[0].querySelector('h2').textContent).toBe('M5')
})

it('opens under a last, partly filled row', async () => {
  const { click, container, drawers } = await setup()
  click(7)
  await answer(7)
  expect(container.querySelector('.movies-list').lastElementChild).toBe(drawers()[0])
})

it('opens nothing when the details fail to load', async () => {
  const { click, drawers } = await setup()
  click(2)
  await fail(2)
  expect(drawers()).toHaveLength(0)
})

it('opens only the poster clicked last', async () => {
  const { click, drawers } = await setup()
  click(1)
  click(2)
  await answer(2)
  await answer(1)
  expect(drawers()).toHaveLength(1)
  expect(drawers()[0].querySelector('h2').textContent).toBe('M2')
})

it('eases open a frame after it is added', async () => {
  const { click, drawers } = await setup()
  click(1)
  await answer(1)
  expect(drawers()[0].classList.contains('open')).toBe(false)
  await waitFor(() => expect(drawers()[0].classList.contains('open')).toBe(true))
})

it('closes on its own poster, then opens again with one click', async () => {
  const { click, drawers } = await setup()
  click(1)
  await answer(1)
  await waitFor(() => expect(drawers()[0].classList.contains('open')).toBe(true))
  click(1)
  expect(drawers()[0].classList.contains('open')).toBe(false)
  closeTransition(drawers()[0])
  expect(drawers()).toHaveLength(0)
  click(1)
  await answer(1)
  expect(drawers()).toHaveLength(1)
})

it('swaps the content in place for a poster in the same row', async () => {
  const { click, drawers } = await setup()
  click(1)
  await answer(1)
  const drawer = drawers()[0]
  click(3)
  await answer(3)
  expect(drawers()).toEqual([drawer])
  expect(drawer.querySelector('h2').textContent).toBe('M3')
})

it('closes the old drawer while one opens under another row', async () => {
  const { click, tile, drawers } = await setup()
  click(1)
  await answer(1)
  const old = drawers()[0]
  click(4)
  await answer(4)
  expect(drawers()).toHaveLength(2)
  expect(old.classList.contains('open')).toBe(false)
  closeTransition(old)
  expect(drawers()).toHaveLength(1)
  expect(tile(6).nextElementSibling).toBe(drawers()[0])
})

it('removes a closing drawer at once when motion is reduced', async () => {
  window.matchMedia = query => ({ matches: query === '(prefers-reduced-motion: reduce)' })
  try {
    const { click, drawers } = await setup()
    click(1)
    await answer(1)
    click(1)
    expect(drawers()).toHaveLength(0)
  } finally {
    delete window.matchMedia
  }
})

it('closes when the filter text changes', async () => {
  const { click, store, drawers } = await setup()
  click(1)
  await answer(1)
  act(() => { store.dispatch(setTextFilter('m')) })
  expect(drawers()).toHaveLength(0)
})

it('closes when switching to TV Shows and stays closed coming back', async () => {
  const { click, store, container, drawers } = await setup()
  click(1)
  await answer(1)
  act(() => { store.dispatch(setSelectedMedia('tvShows')) })
  expect(container.querySelectorAll('.info')).toHaveLength(0)
  act(() => { store.dispatch(setSelectedMedia('movies')) })
  expect(drawers()).toHaveLength(0)
})

it('closes when a title is added, since the rows shift', async () => {
  const { click, store, drawers } = await setup()
  click(5)
  await answer(5)
  act(() => { store.dispatch({ type: 'ADD_MOVIE', payload: { ...movie(0), sort_name: 'm0' } }) })
  expect(drawers()).toHaveLength(0)
})

it('ignores details that arrive after the page has gone', async () => {
  const { click } = await setup()
  click(5)
  cleanup()
  await expect(answer(5)).resolves.toBeUndefined()
  await new Promise(resolve => setTimeout(resolve))
})
