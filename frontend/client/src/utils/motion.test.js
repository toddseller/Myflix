import { fireEvent } from '@testing-library/react'

import { afterTransition, easeHeight, holdStill, reveal } from './motion'

afterEach(() => vi.useRealTimers())

it('finishes after 450ms when no transition ends', () => {
  vi.useFakeTimers()
  const done = vi.fn()
  afterTransition(document.createElement('div'), 'height', done)
  vi.advanceTimersByTime(449)
  expect(done).not.toHaveBeenCalled()
  vi.advanceTimersByTime(1)
  expect(done).toHaveBeenCalledTimes(1)
})

it('finishes once, on its own property only', () => {
  vi.useFakeTimers()
  const el = document.createElement('div')
  const done = vi.fn()
  afterTransition(el, 'height', done)
  fireEvent.transitionEnd(el, { propertyName: 'opacity' })
  expect(done).not.toHaveBeenCalled()
  fireEvent.transitionEnd(el, { propertyName: 'height' })
  vi.advanceTimersByTime(450)
  expect(done).toHaveBeenCalledTimes(1)
})

it('does nothing once cancelled', () => {
  vi.useFakeTimers()
  const done = vi.fn()
  afterTransition(document.createElement('div'), 'height', done)()
  vi.advanceTimersByTime(450)
  expect(done).not.toHaveBeenCalled()
})

// jsdom does no layout, so the wrapper reports the height its content would have.
const wrapperOf = height => {
  const wrapper = document.createElement('div')
  Object.defineProperty(wrapper, 'offsetHeight', { get: () => height.now })
  Object.defineProperty(wrapper, 'scrollHeight', { get: () => height.now })
  return wrapper
}

it('eases a content swap from the old height to the new one, then lets go', () => {
  const height = { now: 100 }
  const wrapper = wrapperOf(height)
  let pinned
  easeHeight(wrapper, () => {
    pinned = wrapper.style.height
    height.now = 250
  })
  expect(pinned).toBe('100px')
  expect(wrapper.style.height).toBe('250px')
  fireEvent.transitionEnd(wrapper, { propertyName: 'height' })
  expect(wrapper.style.height).toBe('')
})

it('lets go at once when the height does not change', () => {
  const wrapper = wrapperOf({ now: 100 })
  easeHeight(wrapper, () => {})
  expect(wrapper.style.height).toBe('')
})

it('returns the height it eases to', () => {
  const height = { now: 100 }
  const wrapper = wrapperOf(height)
  expect(easeHeight(wrapper, () => { height.now = 250 })).toBe(250)
  expect(easeHeight(wrapperOf({ now: 100 }), () => {})).toBe(100)
})

describe('reveal', () => {
  // The page's pinned bars, the open tile and the drawer, at the positions each test gives them.
  const TABS_BOTTOM = 123
  const COUNT_TOP = 743
  const at = (el, top, bottom = top) => { el.getBoundingClientRect = () => ({ top, bottom }) }
  let tile, drawer, wrapper
  const page = ({ tileTop, contentTop, contentHeight }) => {
    document.body.innerHTML = `
      <ul class="mf-tabs--default"></ul>
      <div class="movies-list"><div class="movie-preview open"></div><div class="info"><div class="info-wrapper"></div></div></div>
      <div class="movie-count"></div>`
    at(document.querySelector('.mf-tabs--default'), TABS_BOTTOM - 40, TABS_BOTTOM)
    at(document.querySelector('.movie-count'), COUNT_TOP, COUNT_TOP + 25)
    tile = document.querySelector('.open')
    drawer = document.querySelector('.info')
    wrapper = drawer.firstElementChild
    at(tile, tileTop)
    at(wrapper, contentTop)
    Object.defineProperty(wrapper, 'scrollHeight', { configurable: true, value: contentHeight })
  }
  // The open drawer's top margin (-.5rem) it has yet to reach.
  const OPEN_MARGIN = -8

  beforeEach(() => { window.scrollBy = vi.fn() })
  afterEach(() => { delete window.scrollBy })

  it('glides down just far enough for the drawer to clear the count bar', () => {
    page({ tileTop: 500, contentTop: 820, contentHeight: 300 })
    reveal(drawer, { up: true })
    expect(window.scrollBy).toHaveBeenCalledWith({ top: 820 + 300 + OPEN_MARGIN - COUNT_TOP, behavior: 'smooth' })
  })

  it('stops with the row under the tabs bar when the drawer is taller than the screen', () => {
    page({ tileTop: 500, contentTop: 820, contentHeight: 900 })
    reveal(drawer, { up: true })
    expect(window.scrollBy).toHaveBeenCalledWith({ top: 500 - TABS_BOTTOM, behavior: 'smooth' })
  })

  it('leaves the page still when the drawer is already in view', () => {
    page({ tileTop: 200, contentTop: 520, contentHeight: 200 })
    reveal(drawer, { up: true })
    expect(window.scrollBy).not.toHaveBeenCalled()
  })

  it('glides up to a poster under the tabs bar only when opening', () => {
    page({ tileTop: 100, contentTop: 420, contentHeight: 200 })
    reveal(drawer)
    expect(window.scrollBy).not.toHaveBeenCalled()
    reveal(drawer, { up: true })
    expect(window.scrollBy).toHaveBeenCalledWith({ top: 100 - TABS_BOTTOM, behavior: 'smooth' })
  })

  it('aims at the height the content is easing to', () => {
    page({ tileTop: 500, contentTop: 620, contentHeight: 100 })
    reveal(drawer, { height: 400 })
    expect(window.scrollBy).toHaveBeenCalledWith({ top: 620 + 400 + OPEN_MARGIN - COUNT_TOP, behavior: 'smooth' })
  })

  it('does nothing for a drawer no longer on the page', () => {
    page({ tileTop: 500, contentTop: 820, contentHeight: 300 })
    drawer.remove()
    reveal(drawer, { up: true })
    expect(window.scrollBy).not.toHaveBeenCalled()
  })

  it('jumps instead of gliding when motion is reduced', () => {
    window.matchMedia = query => ({ matches: query === '(prefers-reduced-motion: reduce)' })
    try {
      page({ tileTop: 500, contentTop: 820, contentHeight: 300 })
      reveal(drawer, { up: true })
      expect(window.scrollBy).toHaveBeenCalledWith(expect.objectContaining({ behavior: 'auto' }))
    } finally {
      delete window.matchMedia
    }
  })
})

describe('holdStill', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    window.scrollBy = vi.fn()
  })
  afterEach(() => { delete window.scrollBy })

  const tileAt = top => {
    const tile = document.createElement('div')
    tile.getBoundingClientRect = () => ({ top: tile.top })
    tile.top = top
    return tile
  }

  it('scrolls by however far the tile moves, then lets go', () => {
    const tile = tileAt(300)
    const done = vi.fn()
    holdStill(tile, 300, done)
    tile.top = 200
    vi.advanceTimersByTime(20)
    expect(window.scrollBy).toHaveBeenCalledWith(0, -100)
    vi.advanceTimersByTime(500)
    expect(done).toHaveBeenCalledTimes(1)
  })

  it('leaves the page alone while the tile stays put', () => {
    holdStill(tileAt(300), 300, () => {})
    vi.advanceTimersByTime(500)
    expect(window.scrollBy).not.toHaveBeenCalled()
  })
})
