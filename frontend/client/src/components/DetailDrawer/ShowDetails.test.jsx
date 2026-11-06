import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import mmdb from '../../apis/mmdb'
import ShowDetails from './ShowDetails'

vi.mock('../../apis/mmdb', () => ({ default: { get: vi.fn() } }))

const episode = (tv_episode, plot = `Plot ${ tv_episode }`) => ({ id: tv_episode, tv_episode, title: `Episode title ${ tv_episode }`, date: `2020-01-0${ tv_episode }`, runtime: '50 min', plot })
const season = (number, overrides) => ({ id: number, season: String(number), poster: `s${ number }.jpg`, plot: `Season ${ number } plot`, is_active: false, episodes: [episode(1)], ...overrides })
const show = overrides => ({ id: 9, title: 'Dark', genre: 'Drama', year: '2017', rating: 'TV-MA', hd: 1080, seasons: [season(1, { is_active: true })], ...overrides })

const open = overrides => render(<ShowDetails show={ show(overrides) } />).container
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

it('opens another show on its own active season when the drawer swaps to it', () => {
  const { rerender } = render(<ShowDetails show={ show({ seasons: [season(1, { is_active: true }), season(2)] }) } />)
  fireEvent.click(screen.getByRole('button', { name: '2' }))
  rerender(<ShowDetails show={ show({ id: 10, title: 'Lost', seasons: [season(30), season(31, { is_active: true })] }) } />)
  expect(pressed()).toEqual(['31'])
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
