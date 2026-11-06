import React from 'react'
import { fireEvent, render } from '@testing-library/react'

import Poster from './Poster'

const img = props => render(<Poster alt="Dark Poster" { ...props } />).container.querySelector('img')

it('shows the placeholder behind the poster until it loads', () => {
  const poster = img({ src: 'season.jpg', placeholder: 'tile.jpg' })
  expect(poster.getAttribute('src')).toBe('season.jpg')
  expect(poster.style.backgroundImage).toBe('url("tile.jpg")')
  fireEvent.load(poster)
  expect(poster.style.backgroundImage).toBe('')
})

it('starts again with the placeholder when the poster changes', () => {
  const { container, rerender } = render(<Poster alt="" src="one.jpg" placeholder="tile.jpg" />)
  fireEvent.load(container.querySelector('img'))
  rerender(<Poster alt="" src="two.jpg" placeholder="one.jpg" />)
  expect(container.querySelector('img').style.backgroundImage).toBe('url("one.jpg")')
})

it('shows no placeholder for a poster with no image', () => {
  expect(img({ src: '', placeholder: 'tile.jpg' }).style.backgroundImage).toBe('')
})

it('keeps a URL with a quote and bracket inside the value', () => {
  const background = img({ src: 'a.jpg', placeholder: 'x") , url("evil.jpg' }).style.backgroundImage
  expect(background).not.toContain('url("evil.jpg")')
})
