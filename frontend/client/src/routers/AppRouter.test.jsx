import React from 'react'
import { act } from 'react-dom/test-utils'

import AppRouter, { history } from './AppRouter'
import configureStore from '../store/configureStore'
import { fetchHomePage } from '../actions/homePage'
import { renderWithStore } from '../testing/render'

jest.mock('../apis/mmdb', () => ({ __esModule: true, default: { get: jest.fn(() => new Promise(() => {})) } }))

const renderAt = path => {
  const store = configureStore()
  store.dispatch(fetchHomePage({ topMovies: [], recentMovies: [], recentShows: [], topUsers: [] }))
  act(() => { history.push(path) })
  return renderWithStore(<AppRouter />, store).container
}

it('renders the home page at /', () => {
  expect(renderAt('/').textContent).toContain('Your movies. Your shows. Your way.')
})

it('renders the login form at /login', () => {
  expect(renderAt('/login').querySelector('.login-form-main')).not.toBeNull()
})

it('renders the signup page at /signup', () => {
  const page = renderAt('/signup')
  expect(page.querySelector('.login-container')).not.toBeNull()
  expect(page.querySelector('.login-form-main')).toBeNull()
})
