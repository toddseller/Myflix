import React from 'react'
import { act } from 'react'
import { fireEvent, screen, waitFor } from '@testing-library/react'

import mmdb from '../apis/mmdb'
import AppRouter from './AppRouter'
import { router } from './router'
import configureStore from '../store/configureStore'
import { fetchHomePage } from '../actions/homePage'
import { login, startLogin } from '../actions/auth'
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

const signIn = () => window.localStorage.setItem('myflixUser', JSON.stringify({ token: 't', user: { id: 1 } }))
const path = () => router.state.location.pathname

it('sends a signed-out visitor to sign in, before the collection loads anything', async () => {
  mmdb.get.mockClear()
  const page = await renderAt('/browse/shows')
  expect(path()).toBe('/login')
  expect(page.querySelector('.login-form-main')).not.toBeNull()
  expect(mmdb.get).not.toHaveBeenCalledWith('/movies', expect.anything())
})

it('sends a signed-out visitor from /settings to sign in', async () => {
  const page = await renderAt('/settings')
  expect(path()).toBe('/login')
  expect(page.querySelector('.login-form-main')).not.toBeNull()
})

it('opens settings for a signed-in user', async () => {
  signIn()
  const page = await renderAt('/settings')
  expect(path()).toBe('/settings')
  expect(page.querySelector('.settings')).not.toBeNull()
})

it('sends an old /browse/<id> bookmark, or any other browse address, to /browse', async () => {
  signIn()
  await renderAt('/browse/1')
  expect(path()).toBe('/browse')
  await act(() => router.navigate('/browse/banana/2'))
  expect(path()).toBe('/browse')
})

describe('the collection tabs', () => {
  // The lists answer at once and empty, so the page gets past its loading screen to the tabs.
  beforeEach(() => {
    signIn()
    mmdb.get.mockClear()
    mmdb.get.mockImplementation(url => Promise.resolve({ data: url === '/counts' ? {} : [] }))
  })
  afterEach(() => mmdb.get.mockImplementation(() => new Promise(() => {})))

  const tab = (page, name) => [...page.querySelectorAll('li')].find(li => li.textContent.trim() === name)
  const loaded = page => waitFor(() => expect(tab(page, 'TV Shows')).toBeDefined())
  const moviesFetches = () => mmdb.get.mock.calls.filter(([url]) => url === '/movies').length

  it('opens /browse/shows on the TV Shows tab', async () => {
    const store = storeWithHome()
    const page = await renderAt('/browse/shows', store)
    await loaded(page)
    expect(store.getState().filters.media).toBe('tvShows')
  })

  it('moves to /browse/shows when TV Shows is chosen, without fetching the collection again, and back to Movies', async () => {
    const store = storeWithHome()
    const page = await renderAt('/browse', store)
    await loaded(page)
    expect(store.getState().filters.media).toBe('movies')
    await act(async () => fireEvent.click(tab(page, 'TV Shows')))
    expect(path()).toBe('/browse/shows')
    expect(store.getState().filters.media).toBe('tvShows')
    expect(moviesFetches()).toBe(1)
    await act(() => router.navigate(-1))
    expect(path()).toBe('/browse')
    expect(store.getState().filters.media).toBe('movies')
  })
})

it('goes to the collection after logging in', async () => {
  mmdb.post.mockResolvedValue({ data: { token: 't', user: { id: 7, firstName: 'Ann', userName: 'ann', avatar: '' } } })
  await renderAt('/login')
  const navigate = vi.spyOn(router, 'navigate')
  await act(() => configureStore().dispatch(startLogin({ username_email: 'ann', password: 'secret', remember: true })))
  // Asked for directly, not reached through the redirect that catches old /browse/<id> addresses.
  expect(navigate).toHaveBeenCalledWith('/browse')
  navigate.mockRestore()
  expect(router.state.location.pathname).toBe('/browse')
  expect(JSON.parse(window.localStorage.getItem('myflixUser')).user.id).toBe(7)
})

it('updates the header as the path changes', async () => {
  const page = await renderAt('/login')
  const signIn = () => [...page.querySelectorAll('a')].some(a => a.textContent.includes('Sign In'))
  expect(signIn()).toBe(false)
  await act(() => router.navigate('/'))
  expect(signIn()).toBe(true)
})

describe('signing out', () => {
  const signOut = async () => {
    const stored = JSON.stringify({ token: 't', user: { id: 7, firstName: 'Ann', userName: 'ann', avatar: 'a.png' } })
    window.localStorage.setItem('myflixUser', stored)
    window.sessionStorage.setItem('myflixUser', stored)
    const store = storeWithHome()
    store.dispatch(login({ id: 7, firstName: 'Ann', userName: 'ann', avatar: 'a.png' }))
    const page = await renderAt('/browse', store)
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Account menu' })))
    await act(async () => fireEvent.click(screen.getByRole('menuitem', { name: 'Sign out' })))
    return { page, store }
  }

  it('tells MMDb, clears both storages, and goes home with Sign In showing', async () => {
    mmdb.post.mockReset().mockResolvedValue({})
    const { page, store } = await signOut()
    expect(mmdb.post).toHaveBeenCalledWith('/deauthenticate', null, { headers: { Authorization: 'bearer t' } })
    expect(window.localStorage.getItem('myflixUser')).toBeNull()
    expect(window.sessionStorage.getItem('myflixUser')).toBeNull()
    expect(store.getState().auth.isSignedIn).toBe(false)
    expect(path()).toBe('/')
    expect(screen.getByRole('link', { name: 'Sign In' })).toBeDefined()
    expect(page.querySelector('.user-nav')).toBeNull()
    await act(() => router.navigate('/browse'))
    expect(path()).toBe('/login')
  })

  it('signs out all the same when MMDb fails', async () => {
    mmdb.post.mockReset().mockRejectedValue(new Error('Network Error'))
    const { store } = await signOut()
    expect(window.localStorage.getItem('myflixUser')).toBeNull()
    expect(store.getState().auth.isSignedIn).toBe(false)
    expect(path()).toBe('/')
  })
})
