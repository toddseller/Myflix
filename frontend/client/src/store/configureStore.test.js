import configureStore from './configureStore'
import { login } from '../actions/auth'
import { fetchHomePage } from '../actions/homePage'

it('forgets the user and everything fetched for them on LOGOUT, but keeps the public home page', () => {
  const store = configureStore()
  const empty = store.getState()
  const homeData = { topMovies: [{ id: 1 }], recentMovies: [], recentShows: [], topUsers: [] }
  store.dispatch(fetchHomePage(homeData))
  store.dispatch(login({ id: 7, firstName: 'Ann', userName: 'ann', avatar: 'a.png' }))
  store.dispatch({ type: 'FETCH_MOVIES', payload: [{ id: 1 }] })
  store.dispatch({ type: 'FETCH_SHOWS', payload: [{ id: 2 }] })
  store.dispatch({ type: 'FETCH_SEARCH_NEW_MOVIES', payload: { 3: { id: 3 } } })
  store.dispatch({ type: 'FETCH_SEARCH_NEW_SHOWS', payload: { 4: { id: 4 } } })
  store.dispatch({ type: 'FETCH_SEARCH_NEW_EPISODES', payload: { 5: { id: 5 } } })
  store.dispatch({ type: 'SET_TEXT_FILTER', text: 'dark' })
  store.dispatch({ type: 'SET_SELECTED_MEDIA', media: 'tvShows' })
  store.dispatch({ type: 'FETCH_COUNTS', data: { movies: 1 } })

  store.dispatch({ type: 'LOGOUT' })

  const { auth, home, ...rest } = store.getState()
  const { auth: _, home: __, ...emptyRest } = empty
  expect(rest).toEqual(emptyRest)
  expect(home).toEqual(homeData)
  expect(auth).toEqual({ avatar: '', isSignedIn: false, userId: null, firstName: '', userName: '' })
})
