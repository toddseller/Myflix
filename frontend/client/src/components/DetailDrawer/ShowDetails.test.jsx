import React from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'

import mmdb from '../../apis/mmdb'
import ShowDetails from './ShowDetails'

vi.mock('../../apis/mmdb', () => ({ default: { get: vi.fn() } }))

const episode = (tv_episode, plot = `Plot ${ tv_episode }`) => ({ id: tv_episode, tv_episode, title: `Episode title ${ tv_episode }`, date: `2020-01-0${ tv_episode }`, runtime: '50 min', plot })
const season = (number, overrides) => ({ id: number, season: String(number), poster: `s${ number }.jpg`, plot: `Season ${ number } plot`, is_active: false, episodes: [episode(1)], ...overrides })
const show = overrides => ({ id: 9, title: 'Dark', genre: 'Drama', year: '2017', rating: 'TV-MA', hd: 1080, seasons: [season(1, { is_active: true })], ...overrides })

const open = overrides => render(<ShowDetails show={ show(overrides) } />).container

// jsdom does no layout: a plot is cut when its text is taller than its box, and an empty plot has no height.
let plotsCut
beforeAll(() => {
  const plot = el => el.classList.contains('plot-truncate') && el.textContent ? 20 : 0
  Object.defineProperty(HTMLElement.prototype, 'clientHeight', { configurable: true, get() { return plot(this) } })
  Object.defineProperty(HTMLElement.prototype, 'scrollHeight', { configurable: true, get() { return plot(this) * (plotsCut ? 2 : 1) } })
})
afterAll(() => {
  delete HTMLElement.prototype.clientHeight
  delete HTMLElement.prototype.scrollHeight
})
beforeEach(() => { plotsCut = true })
const pressed = () => screen.getAllByRole('button', { pressed: true }).map(button => button.textContent)

it('shows the title, genre, year and badges', () => {
  open()
  expect(screen.getByRole('heading', { name: 'Dark' })).toBeTruthy()
  expect(screen.getByText('Drama')).toBeTruthy()
  expect(screen.getByText('2017')).toBeTruthy()
  expect(screen.getByRole('img', { name: 'Rated TV-MA' })).toBeTruthy()
  expect(screen.getByRole('img', { name: 'HD' })).toBeTruthy()
})

it('counts seasons and episodes, singular where there is one', () => {
  open({ seasons: [season(1, { is_active: true, episodes: [episode(1)] }), season(2, { episodes: [] })] })
  expect(screen.getByText('2 seasons, 1 episode')).toBeTruthy()
})

it('names a single season by its number', () => {
  open({ seasons: [season(3, { is_active: true, episodes: [episode(1), episode(2)] })] })
  expect(screen.getByText('Season 3')).toBeTruthy()
  expect(screen.getByText('1 season, 2 episodes')).toBeTruthy()
})

it('opens on the active season', () => {
  const container = open({ seasons: [season(4), season(2, { is_active: true }), season(1), season(3)] })
  expect(screen.getByText('4 seasons')).toBeTruthy()
  expect(screen.getByText('Season 2 plot')).toBeTruthy()
  expect(container.querySelector('.description-poster img').getAttribute('src')).toBe('s2.jpg')
  expect(pressed()).toEqual(['2'])
  expect(screen.getAllByRole('button', { pressed: false }).map(button => button.textContent)).toEqual(['1', '3', '4'])
})

it('opens on the lowest season when none is active', () => {
  open({ seasons: [season(2), season(1)] })
  expect(pressed()).toEqual(['1'])
})

it('switches seasons without a request', () => {
  const container = open({ seasons: [season(1, { is_active: true }), season(2, { episodes: [episode(1, 'Second season opener')] })] })
  fireEvent.click(screen.getByRole('button', { name: '2' }))
  expect(pressed()).toEqual(['2'])
  expect(screen.getByText('Season 2 plot')).toBeTruthy()
  expect(screen.getByText('Second season opener')).toBeTruthy()
  expect(container.querySelector('.description-poster img').getAttribute('src')).toBe('s2.jpg')
  expect(mmdb.get).not.toHaveBeenCalled()
})

it('lists episodes in order with their details', () => {
  const container = open({ seasons: [season(1, { is_active: true, episodes: [episode(3), episode(1), episode(2)] })] })
  expect([...container.querySelectorAll('.episode-title')].map(el => el.textContent)).toEqual(['Episode title 1', 'Episode title 2', 'Episode title 3'])
  expect(screen.getByText('EPISODE 1')).toBeTruthy()
  expect(screen.getByText('2020-01-01')).toBeTruthy()
  expect(screen.getAllByText('50 min')).toHaveLength(3)
})

it('shows a whole plot on "more" and cuts it short again on "less"', () => {
  open()
  const plot = screen.getByText('Plot 1')
  expect(plot.classList.contains('active')).toBe(false)
  fireEvent.click(screen.getByRole('button', { name: 'more' }))
  expect(plot.classList.contains('active')).toBe(true)
  fireEvent.click(screen.getByRole('button', { name: 'less' }))
  expect(plot.classList.contains('active')).toBe(false)
  expect(screen.getByRole('button', { name: 'more' })).toBeTruthy()
})

it('offers no "more" for an episode without a plot', () => {
  open({ seasons: [season(1, { is_active: true, episodes: [episode(1, '')] })] })
  expect(screen.queryByRole('button', { name: 'more' })).toBeNull()
})


it('decodes entities in the title', () => {
  open({ title: 'Law &amp; Order' })
  expect(screen.getByRole('heading', { name: 'Law & Order' })).toBeTruthy()
})

it('decodes entities in every text it shows', () => {
  const container = open({
    genre: 'Action &amp; Adventure',
    seasons: [season(1, { is_active: true, plot: 'A whip&#8211;smart coder', episodes: [{ ...episode(1), plot: 'People&#39;s wants' }] })]
  })
  expect(screen.getByText('Action & Adventure')).toBeTruthy()
  expect(container.querySelector('.season-plot').textContent).toBe('A whip–smart coder')
  expect(container.querySelector('.plot-truncate').textContent).toBe('People\'s wants')
})

describe('the poster placeholder', () => {
  const poster = container => container.querySelector('.description-poster img')

  it('is the grid poster when the drawer opens', () => {
    const container = open({ poster: 'dark.jpg' })
    expect(poster(container).getAttribute('src')).toBe('s1.jpg')
    expect(poster(container).style.backgroundImage).toBe('url("dark.jpg")')
  })

  it('is the previous season\'s poster after a season switch', () => {
    const container = open({ poster: 'dark.jpg', seasons: [season(1, { is_active: true }), season(2)] })
    fireEvent.click(screen.getByRole('button', { name: '2' }))
    expect(poster(container).getAttribute('src')).toBe('s2.jpg')
    expect(poster(container).style.backgroundImage).toBe('url("s1.jpg")')
  })

  it('is left out for a season with no poster', () => {
    const container = open({ poster: 'dark.jpg', seasons: [season(1, { is_active: true }), season(2, { poster: '' })] })
    fireEvent.click(screen.getByRole('button', { name: '2' }))
    expect(poster(container).style.backgroundImage).toBe('')
  })
})

describe('the season line', () => {
  const SEASON = 40
  const ARROW = 34
  let lineWidth
  const scrolled = new WeakMap()
  const stubs = {
    clientWidth: { get() { return this.classList.contains('season-line') ? lineWidth : 0 } },
    scrollWidth: { get() { return this.classList.contains('season-line') ? this.children.length * SEASON : 0 } },
    offsetLeft: { get() { return this.classList.contains('season-submit') ? [...this.parentElement.children].indexOf(this) * SEASON : 0 } },
    offsetWidth: { get() { return this.classList.contains('season-submit') ? SEASON : 0 } },
    scrollLeft: { get() { return scrolled.get(this) ?? 0 }, set(value) { scrolled.set(this, value) } }
  }
  const originals = {}
  beforeAll(() => {
    for (const [name, stub] of Object.entries(stubs)) {
      originals[name] = Object.getOwnPropertyDescriptor(Element.prototype, name) ?? Object.getOwnPropertyDescriptor(HTMLElement.prototype, name)
      Object.defineProperty(HTMLElement.prototype, name, { configurable: true, ...stub })
    }
    HTMLElement.prototype.scrollBy = vi.fn()
  })
  afterAll(() => {
    for (const name of Object.keys(stubs)) delete HTMLElement.prototype[name]
    delete HTMLElement.prototype.scrollBy
  })
  beforeEach(() => {
    lineWidth = 1000
    HTMLElement.prototype.scrollBy.mockClear()
  })

  const longShow = (active, overrides) => show({ seasons: Array.from({ length: 48 }, (_, i) => season(i + 1, { is_active: i + 1 === active })), ...overrides })
  const line = container => container.querySelector('.season-line')
  const arrows = () => screen.queryAllByRole('button', { name: /seasons$/ }).map(button => button.getAttribute('aria-label'))

  it('shows no arrows when every season fits', () => {
    open({ seasons: [season(1, { is_active: true }), season(2), season(3)] })
    expect(arrows()).toEqual([])
  })

  it('opens at its start when the active season fits there, with only the right arrow', () => {
    const container = render(<ShowDetails show={ longShow(3) } />).container
    expect(line(container).scrollLeft).toBe(0)
    expect(arrows()).toEqual(['Later seasons'])
  })

  it('opens with a late active season in view, clear of the right arrow', () => {
    const container = render(<ShowDetails show={ longShow(48) } />).container
    expect(line(container).scrollLeft).toBe(48 * SEASON - 1000)
    expect(arrows()).toEqual(['Earlier seasons'])
  })

  it('places the active season just clear of the right arrow', () => {
    const container = render(<ShowDetails show={ longShow(30) } />).container
    expect(line(container).scrollLeft).toBe(30 * SEASON + ARROW - 1000)
    expect(arrows()).toEqual(['Earlier seasons', 'Later seasons'])
  })

  it('shows its arrows however the line is scrolled', () => {
    const container = render(<ShowDetails show={ longShow(1) } />).container
    line(container).scrollLeft = 400
    fireEvent.scroll(line(container))
    expect(arrows()).toEqual(['Earlier seasons', 'Later seasons'])
  })

  it('updates its arrows when the window resizes', () => {
    open({ seasons: [season(1, { is_active: true }), season(2), season(3)] })
    lineWidth = 100
    act(() => { window.dispatchEvent(new Event('resize')) })
    expect(arrows()).toEqual(['Later seasons'])
  })

  it('glides one visible width per arrow click', () => {
    const container = render(<ShowDetails show={ longShow(30) } />).container
    fireEvent.click(screen.getByRole('button', { name: 'Later seasons' }))
    fireEvent.click(screen.getByRole('button', { name: 'Earlier seasons' }))
    expect(line(container).scrollBy.mock.calls).toEqual([[{ left: 1000, behavior: 'smooth' }], [{ left: -1000, behavior: 'smooth' }]])
  })

  it('jumps instead of gliding when motion is reduced', () => {
    window.matchMedia = query => ({ matches: query === '(prefers-reduced-motion: reduce)' })
    try {
      const container = render(<ShowDetails show={ longShow(1) } />).container
      fireEvent.click(screen.getByRole('button', { name: 'Later seasons' }))
      expect(line(container).scrollBy).toHaveBeenCalledWith({ left: 1000, behavior: 'auto' })
    } finally {
      delete window.matchMedia
    }
  })

  it('stays put when the user switches seasons', () => {
    const container = render(<ShowDetails show={ longShow(1) } />).container
    line(container).scrollLeft = 760
    fireEvent.click(screen.getByRole('button', { name: '20' }))
    expect(line(container).scrollLeft).toBe(760)
  })

})

describe('"more"', () => {
  it('is not offered for a plot that fits', () => {
    plotsCut = false
    open()
    expect(screen.queryByRole('button', { name: 'more' })).toBeNull()
  })

  it('is offered for a plot that is cut short', () => {
    open()
    expect(screen.getByRole('button', { name: 'more' })).toBeTruthy()
  })

  it('appears when the window narrows until the plot is cut', () => {
    plotsCut = false
    open()
    plotsCut = true
    act(() => { window.dispatchEvent(new Event('resize')) })
    expect(screen.getByRole('button', { name: 'more' })).toBeTruthy()
  })
})
