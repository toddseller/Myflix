import React from 'react'
import { render, screen, within } from '@testing-library/react'

import MovieDetails from './MovieDetails'

const movie = overrides => ({
  id: 1, title: 'Fargo', poster: 'fargo.jpg', runtime: '1h 38m', year: '1996', genre: 'Drama', rating: 'R', hd: 0,
  plot: 'A pregnant police chief investigates.', actors: 'Frances McDormand', director: 'Joel Coen',
  writer: 'Ethan Coen', producer: 'Ethan Coen', studio: 'Gramercy', ratings: [], ...overrides
})

const show = overrides => render(<MovieDetails movie={ movie(overrides) } />).container
const list = heading => within(screen.getByText(heading).nextElementSibling).getAllByRole('listitem').map(li => li.textContent)

it('shows the poster, title, runtime, year and genre', () => {
  show()
  expect(screen.getByRole('img', { name: 'Fargo Poster' }).getAttribute('src')).toBe('fargo.jpg')
  expect(screen.getByRole('heading', { name: 'Fargo' })).toBeTruthy()
  for (const text of ['1h 38m', '1996', 'Drama']) expect(screen.getByText(text)).toBeTruthy()
})

it('shows the rating and HD badges', () => {
  show({ rating: 'PG-13', hd: 1080 })
  expect(screen.getByRole('img', { name: 'Rated PG-13' })).toBeTruthy()
  expect(screen.getByRole('img', { name: 'HD' })).toBeTruthy()
})

it('shows a 4K badge', () => {
  show({ hd: 4 })
  expect(screen.getByRole('img', { name: '4K' })).toBeTruthy()
})

it('shows no badge for a rating it does not know, nor for standard definition', () => {
  show({ rating: 'XYZ', hd: 0 })
  expect(screen.queryByRole('img', { name: /Rated|HD|4K/ })).toBeNull()
})

it('marks the average rating, rounded, and counts the ratings', () => {
  const container = show({ ratings: [{ stars: 4 }, { stars: 5 }] })
  expect(container.querySelectorAll('.rated .checked')).toHaveLength(5)
  expect(screen.getByRole('img', { name: '5 out of 5 stars' })).toBeTruthy()
  expect(screen.getByText('Based on 2 User Ratings')).toBeTruthy()
})

it('counts a single rating', () => {
  const container = show({ ratings: [{ stars: 3 }] })
  expect(container.querySelectorAll('.rated .checked')).toHaveLength(3)
  expect(screen.getByText('Based on 1 User Rating')).toBeTruthy()
})

it('marks no star for an unrated movie', () => {
  const container = show({ ratings: [] })
  expect(container.querySelectorAll('.rated .checked')).toHaveLength(0)
  expect(container.querySelectorAll('.rated svg')).toHaveLength(5)
  expect(screen.getByText('This Movie Has Not Been Rated')).toBeTruthy()
})

it('shows the plot and studio', () => {
  show()
  expect(screen.getByText('A pregnant police chief investigates.')).toBeTruthy()
  expect(screen.getByText('Gramercy')).toBeTruthy()
})

it('lists the cast and crew by role, with plural headings for several names', () => {
  show({ director: 'Joel Coen, Ethan Coen', writer: 'Ethan Coen', producer: 'Ethan Coen, Joel Coen' })
  expect(list('DIRECTORS')).toEqual(['Joel Coen', 'Ethan Coen'])
  expect(list('SCREENWRITER')).toEqual(['Ethan Coen'])
  expect(list('PRODUCERS')).toEqual(['Ethan Coen', 'Joel Coen'])
  expect(list('STARRING')).toEqual(['Frances McDormand'])
})

it('keeps a name with Jr. whole', () => {
  show({ actors: 'Robert Downey, Jr., Gwyneth Paltrow' })
  expect(list('STARRING')).toEqual(['Robert Downey, Jr.', 'Gwyneth Paltrow'])
})

it('leaves out a role with no names and a missing studio', () => {
  show({ producer: '', studio: null })
  expect(screen.queryByText(/^PRODUCERS?$/)).toBeNull()
  expect(screen.queryByText('STUDIO')).toBeNull()
})

it('shows a title with entities and markup as plain text', () => {
  const container = show({ title: 'Fast &amp; Furious <b>X</b>' })
  expect(container.querySelector('h2').textContent).toBe('Fast & Furious X')
  expect(container.querySelector('h2 b')).toBeNull()
})

it('decodes entities in every text it shows', () => {
  show({ genre: 'Action &amp; Adventure', plot: 'People&#39;s choice', actors: 'Ren&eacute;e Zellweger', director: 'Jean&#8211;Pierre Jeunet', writer: 'A &amp; B', producer: 'C &amp; D', studio: 'Fox &amp; Co' })
  for (const text of ['Action & Adventure', 'People\'s choice', 'Renée Zellweger', 'Jean–Pierre Jeunet', 'A & B', 'C & D', 'Fox & Co']) expect(screen.getByText(text)).toBeTruthy()
})

it('shows the grid poster behind the drawer\'s poster until it loads', () => {
  show()
  expect(screen.getByRole('img', { name: 'Fargo Poster' }).style.backgroundImage).toBe('url("fargo.jpg")')
})
