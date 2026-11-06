import React, { Profiler } from 'react'
import { act, cleanup, fireEvent, waitFor } from '@testing-library/react'

import mmdb from '../../apis/mmdb'
import { renderWithStore } from '../../testing/render'
import { setSelectedMedia, setTextFilter } from '../../actions/filters'
import UserPage from './index'
import { holdStill, reveal } from '../../utils/motion'

vi.mock('../../apis/mmdb', () => ({ default: { get: vi.fn(), defaults: { headers: { common: {} } } } }))
// The glide's maths is tested in utils/motion.test.js; here, only when and how the page asks for it.
vi.mock('../../utils/motion', async importOriginal => ({
  ...await importOriginal(),
  reveal: vi.fn(),
  holdStill: vi.fn((tile, top, done) => done())
}))

const movie = id => ({ id, title: `M${ id }`, sort_name: `m${ id }`, search_name: `m${ id }`, poster: `${ id }.jpg`, year: 2000 })
const movies = [1, 2, 3, 4, 5, 6, 7].map(movie)
const show = id => ({ id, title: `S${ id }`, sort_name: `s${ id }`, search_name: `s${ id }`, poster: `s${ id }.jpg`, seasonCount: 2, seasonNumbers: '1, 2' })
const shows = [50, 51].map(show)
const lists = { '/movies': movies, '/shows': shows, '/counts': { moviesCount: 7, showsCount: 1, episodesCount: 1 } }

// Details requests stay pending until the test answers them, so it controls the order they land in.
let pending
const answer = (id, data = { ...movie(id), plot: `Plot ${ id }` }) => act(async () => pending[`/movies/${ id }`].resolve({ data }))
const fail = id => act(async () => pending[`/movies/${ id }`].reject(new Error('down')))

// jsdom does no layout: tiles sit perRow to a row, and a drawer is on a line of its own.
let perRow = 3
const offsetTop = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetTop')
beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'offsetTop', {
    configurable: true,
    get() {
      if (this.classList.contains('info')) return -1
      const tiles = [...this.parentElement.children].filter(el => !el.classList.contains('info'))
      return Math.floor(tiles.indexOf(this) / perRow) * 300
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
  await waitFor(() => expect(result.container.querySelectorAll('.movie-preview')).toHaveLength(lists['/movies'].length))
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
  const { click, tile, drawers } = await setup()
  click(7)
  await answer(7)
  expect(drawers()[0].previousElementSibling).toBe(tile(7))
  expect(drawers()[0].nextElementSibling).toBeNull()
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

it('marks the open poster, and unmarks it as its drawer closes', async () => {
  const { click, tile } = await setup()
  click(5)
  await answer(5)
  expect(tile(5).classList.contains('open')).toBe(true)
  expect(tile(4).classList.contains('open')).toBe(false)
  click(5)
  expect(tile(5).classList.contains('open')).toBe(false)
})

it('moves the mark to the poster clicked next', async () => {
  const { click, tile } = await setup()
  click(1)
  await answer(1)
  click(4)
  await answer(4)
  expect(tile(1).classList.contains('open')).toBe(false)
  expect(tile(4).classList.contains('open')).toBe(true)
})

it('reopens a show on its active season after the drawer has shown another', async () => {
  const { store, container } = await setup()
  act(() => { store.dispatch(setSelectedMedia('tvShows')) })
  const season = (id, number, is_active = false) => ({ id, season: String(number), poster: `season${ id }.jpg`, plot: '', is_active, episodes: [] })
  const details = id => ({ ...show(id), seasons: [season(id * 10 + 1, 1, true), season(id * 10 + 2, 2)] })
  const openShow = async id => {
    fireEvent.click(container.querySelector(`.show-preview[id="${ id }"] img`))
    await act(async () => pending[`/shows/${ id }`].resolve({ data: details(id) }))
  }
  const drawer = () => container.querySelector('.info')

  await openShow(50)
  fireEvent.click([...drawer().querySelectorAll('.season-submit')].find(button => button.textContent === '2'))
  await openShow(51)
  await openShow(50)

  expect(drawer().querySelector('[aria-pressed="true"]').textContent).toBe('1')
  expect(drawer().querySelector('.description-poster img').style.backgroundImage).toBe('url("s50.jpg")')
})

it('opens a fresh drawer in the row of one that is still closing', async () => {
  const { click, drawers } = await setup()
  click(1)
  await answer(1)
  click(1)
  const closing = drawers()[0]
  click(2)
  await answer(2)
  expect(drawers()).toHaveLength(2)
  const opened = drawers().find(drawer => drawer !== closing)
  expect(opened.querySelector('h2').textContent).toBe('M2')
  closeTransition(closing)
  expect(drawers()).toEqual([opened])
})

describe('the glide', () => {
  beforeEach(() => {
    reveal.mockClear()
    holdStill.mockClear()
  })

  it('brings a new drawer into view, gliding up if it must', async () => {
    const { click, drawers } = await setup()
    click(5)
    await answer(5)
    expect(reveal).toHaveBeenCalledWith(drawers()[0], { up: true })
    expect(holdStill).not.toHaveBeenCalled()
  })

  it('aims at the eased height on a same-row swap, gliding down only', async () => {
    const { click, drawers } = await setup()
    click(4)
    await answer(4)
    reveal.mockClear()
    click(5)
    await answer(5)
    expect(reveal).toHaveBeenCalledWith(drawers()[0], { height: expect.any(Number) })
  })

  it('holds the clicked poster still on a move to another row, then glides', async () => {
    const { click, tile, drawers } = await setup()
    click(1)
    await answer(1)
    reveal.mockClear()
    click(4)
    await answer(4)
    expect(holdStill).toHaveBeenCalledWith(tile(4), expect.any(Number), expect.any(Function))
    const opened = drawers().find(drawer => drawer.querySelector('h2').textContent === 'M4')
    expect(reveal).toHaveBeenCalledWith(opened, { up: true })
  })
})

describe('a turned phone', () => {
  const resize = width => act(() => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: width })
    window.dispatchEvent(new Event('resize'))
  })
  afterEach(() => { perRow = 3 })

  it('moves the open drawer under its poster\'s new row, keeping its element', async () => {
    const { click, tile, drawers } = await setup()
    click(5)
    await answer(5)
    const drawer = drawers()[0]
    expect(tile(6).nextElementSibling).toBe(drawer)
    perRow = 4
    resize(window.innerWidth + 100)
    expect(drawers()).toEqual([drawer])
    expect(tile(7).nextElementSibling).toBe(drawer)
    expect(drawer.querySelector('h2').textContent).toBe('M5')
  })

  it('leaves the drawer alone when only the height changes', async () => {
    const { click, tile, drawers } = await setup()
    click(5)
    await answer(5)
    perRow = 4
    act(() => { window.dispatchEvent(new Event('resize')) })
    expect(tile(6).nextElementSibling).toBe(drawers()[0])
  })
})

describe('search results', () => {
  // As the search box runs a search. Its text also filters the grid, and UserPage shows its loading page while no
  // show matches, so '5' keeps movie 5 and show 50 showing.
  const search = (container, text) => {
    fireEvent.change(container.querySelector('input[name="search"]'), { target: { value: text } })
    fireEvent.submit(container.querySelector('form'))
  }
  const result = { id: 900, title: 'Dark', poster: 'dark.jpg', year: 2017, season: 1, tv_episode: 1 }

  it('close and clear when a movie poster is clicked, keeping the search text', async () => {
    const { click, store, container, drawers } = await setup()
    search(container, '5')
    act(() => { store.dispatch({ type: 'FETCH_SEARCH_NEW_MOVIES', payload: [result] }) })
    expect(container.querySelector('.movies-list').classList.contains('fixed')).toBe(true)
    click(5)
    await answer(5)
    expect(Object.values(store.getState().newMovies)).toEqual([])
    expect(container.querySelector('.movies-list').classList.contains('fixed')).toBe(false)
    expect(container.querySelector('input[name="search"]').value).toBe('5')
    expect(drawers()).toHaveLength(1)
  })

  it('clear the shows and episodes found when a show poster is clicked', async () => {
    const { store, container } = await setup()
    act(() => { store.dispatch(setSelectedMedia('tvShows')) })
    search(container, '5')
    act(() => {
      store.dispatch({ type: 'FETCH_SEARCH_NEW_SHOWS', payload: [result] })
      store.dispatch({ type: 'FETCH_SEARCH_NEW_EPISODES', payload: [result] })
    })
    fireEvent.click(container.querySelector('.show-preview[id="50"] img'))
    await act(async () => pending['/shows/50'].resolve({ data: { ...show(50), seasons: [{ id: 501, season: '1', poster: '', plot: '', is_active: true, episodes: [] }] } }))
    expect(Object.values(store.getState().newShows)).toEqual([])
    expect(Object.values(store.getState().newEpisodes)).toEqual([])
    expect(container.querySelector('.shows-list').classList.contains('fixed')).toBe(false)
  })
})

describe('blocks of tiles', () => {
  // 420 is a multiple of every possible column count, so each block but the last ends on a full row.
  // Padded so the grid's alphabetical order matches the ids, in the list and in the details alike.
  const padded = id => ({ ...movie(id), sort_name: `m${ String(id).padStart(4, '0') }` })
  const withMovies = async count => {
    lists['/movies'] = Array.from({ length: count }, (_, i) => padded(i + 1))
    try {
      return await setup()
    } finally {
      lists['/movies'] = movies
    }
  }
  const blocks = container => [...container.querySelectorAll('.movies-list > .grid-block')]

  it('groups a long collection into blocks of 420', async () => {
    const { container } = await withMovies(845)
    expect(blocks(container).map(block => block.querySelectorAll(':scope > .movie-preview').length)).toEqual([420, 420, 5])
    expect(blocks(container).map(block => block.classList.contains('grid-block--last'))).toEqual([false, false, true])
  })

  it('opens, swaps and re-places a drawer in the second block', async () => {
    const { click, tile, drawers, container } = await withMovies(845)
    click(425)
    await answer(425, padded(425))
    const drawer = drawers()[0]
    expect(blocks(container)[1].contains(drawer)).toBe(true)
    expect(tile(426).nextElementSibling).toBe(drawer)
    click(426)
    await answer(426, padded(426))
    expect(drawers()).toEqual([drawer])
    expect(drawer.querySelector('h2').textContent).toBe('M426')
    perRow = 4
    try {
      act(() => {
        Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: window.innerWidth + 100 })
        window.dispatchEvent(new Event('resize'))
      })
      expect(tile(428).nextElementSibling).toBe(drawer)
    } finally {
      perRow = 3
    }
  })

  // The page's width without a scrollbar; innerWidth stays the window's, as with a visible scrollbar.
  const widths = (page, scrollbar = 0) => {
    Object.defineProperty(document.documentElement, 'clientWidth', { configurable: true, value: page })
    Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: page + scrollbar })
  }
  afterEach(() => { delete document.documentElement.clientWidth })

  it('estimates each block\'s height from its rows, for when the browser skips it', async () => {
    // At 1024px the list fits 5 columns of 174px with 2rem gaps.
    widths(1024)
    const { container } = await withMovies(845)
    const heights = blocks(container).map(block => block.style.getPropertyValue('--block-height'))
    expect(heights).toEqual([`${ 84 * 303 + 83 * 8 }px`, `${ 84 * 303 + 83 * 8 }px`, '303px'])
  })

  it('counts columns from the page\'s width, leaving out a visible scrollbar', async () => {
    // 1405px fits 6 columns; the 1420px window around it would fit 7.
    widths(1405, 15)
    const { container } = await withMovies(845)
    expect(blocks(container)[0].style.getPropertyValue('--block-height')).toBe(`${ 70 * 303 + 69 * 8 }px`)
  })

  it('re-renders on a resize only when the column count changes', async () => {
    widths(1405)
    const commits = vi.fn()
    const { container } = renderWithStore(<Profiler id="page" onRender={ commits }><UserPage /></Profiler>)
    await waitFor(() => expect(container.querySelectorAll('.movie-preview')).toHaveLength(7))
    const resize = page => act(() => {
      widths(page)
      window.dispatchEvent(new Event('resize'))
    })
    commits.mockClear()
    // Still 6 columns of movies and of shows; 1410px would be the first width with 7.
    resize(1406)
    expect(commits).not.toHaveBeenCalled()
    resize(1500)
    expect(commits).toHaveBeenCalled()
  })

  it('keeps a short collection in one plain block', async () => {
    const { container } = await setup()
    expect(blocks(container)).toHaveLength(1)
    expect(blocks(container)[0].classList.contains('grid-block--last')).toBe(false)
  })
})
