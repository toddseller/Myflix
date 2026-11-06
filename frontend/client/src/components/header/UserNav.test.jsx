import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { fireEvent, screen } from '@testing-library/react'

import UserNav from './UserNav'
import { renderWithStore } from '../../testing/render'
import { login } from '../../actions/auth'
import configureStore from '../../store/configureStore'

vi.mock('../../apis/mmdb', () => ({ default: { get: vi.fn(), post: vi.fn() } }))

const renderNav = () => {
  const store = configureStore()
  store.dispatch(login({ id: 7, firstName: 'Ann', userName: 'ann', avatar: 'a.png' }))
  renderWithStore(<MemoryRouter><div data-testid="outside" /><UserNav /></MemoryRouter>, store)
  return screen.getByRole('button', { name: 'Account menu' })
}

const entries = () => screen.queryAllByRole('menuitem').map(item => item.textContent)

it('opens a menu from the avatar with My collection, Settings and Sign out', () => {
  const button = renderNav()
  expect(button.getAttribute('aria-expanded')).toBe('false')
  expect(entries()).toEqual([])
  fireEvent.click(button)
  expect(button.getAttribute('aria-expanded')).toBe('true')
  expect(entries()).toEqual(['My collection', 'Settings', 'Sign out'])
})

it('links My collection to /browse and Settings to /settings, with no user id in the address', () => {
  fireEvent.click(renderNav())
  expect(screen.getByRole('menuitem', { name: 'My collection' }).getAttribute('href')).toBe('/browse')
  expect(screen.getByRole('menuitem', { name: 'Settings' }).getAttribute('href')).toBe('/settings')
})

it('closes when an entry is chosen', () => {
  const button = renderNav()
  fireEvent.click(button)
  fireEvent.click(screen.getByRole('menuitem', { name: 'Settings' }))
  expect(entries()).toEqual([])
  expect(button.getAttribute('aria-expanded')).toBe('false')
})

it('closes on a click outside, but not on one inside', () => {
  fireEvent.click(renderNav())
  fireEvent.pointerDown(screen.getByRole('menu'))
  expect(entries()).toHaveLength(3)
  fireEvent.pointerDown(screen.getByTestId('outside'))
  expect(entries()).toEqual([])
})

it('closes on Escape, returns focus to the avatar, and keeps the key from document listeners', () => {
  const onDocumentKey = vi.fn()
  document.addEventListener('keydown', onDocumentKey)
  const button = renderNav()
  fireEvent.click(button)
  const item = screen.getByRole('menuitem', { name: 'Settings' })
  item.focus()
  fireEvent.keyDown(item, { key: 'Escape' })
  document.removeEventListener('keydown', onDocumentKey)
  expect(entries()).toEqual([])
  expect(document.activeElement).toBe(button)
  expect(onDocumentKey).not.toHaveBeenCalled()
})

it('opens the menu outside the header, so the collection\'s tabs and search results can\'t cover it', () => {
  fireEvent.click(renderNav())
  expect(screen.getByRole('menu').parentElement).toBe(document.body)
})

it('moves focus into the menu when it opens, and closes when focus leaves it', () => {
  fireEvent.click(renderNav())
  const first = screen.getByRole('menuitem', { name: 'My collection' })
  expect(document.activeElement).toBe(first)
  fireEvent.blur(first, { relatedTarget: screen.getByRole('menuitem', { name: 'Settings' }) })
  expect(entries()).toHaveLength(3)
  fireEvent.blur(first, { relatedTarget: screen.getByTestId('outside') })
  expect(entries()).toEqual([])
})

it('closes when the window is resized, since it was placed under the avatar when it opened', () => {
  fireEvent.click(renderNav())
  fireEvent(window, new Event('resize'))
  expect(entries()).toEqual([])
})
