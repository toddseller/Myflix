import React from 'react'
import { MemoryRouter } from 'react-router-dom'

import UserNav from './UserNav'
import { renderWithStore } from '../../testing/render'
import { login } from '../../actions/auth'
import configureStore from '../../store/configureStore'

vi.mock('../../apis/mmdb', () => ({ default: { get: vi.fn(), post: vi.fn() } }))

it('links the avatar to the collection, with no user id in the address', () => {
  const store = configureStore()
  store.dispatch(login({ id: 7, firstName: 'Ann', userName: 'ann', avatar: 'a.png' }))
  const { container } = renderWithStore(<MemoryRouter><UserNav /></MemoryRouter>, store)
  expect(container.querySelector('.avatar a').getAttribute('href')).toBe('/browse')
})
