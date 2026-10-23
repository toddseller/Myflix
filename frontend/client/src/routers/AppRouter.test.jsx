import React from 'react'
import { act } from 'react'

import mmdb from '../apis/mmdb'
import AppRouter from './AppRouter'
import { router } from './router'
import configureStore from '../store/configureStore'
import { fetchHomePage } from '../actions/homePage'
import { startLogin } from '../actions/auth'
import { renderWithStore } from '../testing/render'

vi.mock('../apis/mmdb', () => ({ default: { get: vi.fn(() => new Promise(() => {})), post: vi.fn() } }))

const storeWithHome = () => {
  const store = configureStore()
  store.dispatch(fetchHomePage({ topMovies: [], recentMovies: [], recentShows: [], topUsers: [] }))
  return store
}

const renderAt = async (path, store = storeWithHome()) => {
  await act(() => router.navigate(path))
  return renderWithStore(<AppRouter />, store).container
}

beforeEach(() => {
  window.localStorage.clear()
  window.sessionStorage.clear()
})

it('renders the home page at /', async () => {
  expect((await renderAt('/')).textContent).toContain('Your movies. Your shows. Your way.')
})

it('renders the login form at /login', async () => {
  expect((await renderAt('/login')).querySelector('.login-form-main')).not.toBeNull()
})

it('renders the signup page at /signup', async () => {
  const page = await renderAt('/signup')
  expect(page.querySelector('.login-container')).not.toBeNull()
  expect(page.querySelector('.login-form-main')).toBeNull()
})

it('renders the user page at /browse/:id and loads the collection', async () => {
  window.localStorage.setItem('myflixUser', JSON.stringify({ token: 't', user: { id: 1 } }))
  const page = await renderAt('/browse/1')
  expect(page.querySelector('.loading-page')).not.toBeNull()
  expect(mmdb.get).toHaveBeenCalledWith('/movies', expect.anything())
})

it('goes to the collection after logging in', async () => {
  mmdb.post.mockResolvedValue({ data: { token: 't', user: { id: 7, firstName: 'Ann', userName: 'ann', avatar: '' } } })
  await renderAt('/login')
  await act(() => configureStore().dispatch(startLogin({ username_email: 'ann', password: 'secret', remember: true })))
  expect(router.state.location.pathname).toBe('/browse/7')
  expect(JSON.parse(window.localStorage.getItem('myflixUser')).user.id).toBe(7)
})

it('updates the header as the path changes', async () => {
  const page = await renderAt('/login')
  const signIn = () => [...page.querySelectorAll('a')].some(a => a.textContent.includes('Sign In'))
  expect(signIn()).toBe(false)
  await act(() => router.navigate('/'))
  expect(signIn()).toBe(true)
})
