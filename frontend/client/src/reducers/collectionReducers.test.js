import userMovieReducer from './userMovieReducer'
import userShowReducer from './userShowReducer'

it('keys fetched movies by id and keeps the ones already loaded', () => {
  const state = userMovieReducer({ 9: { id: 9, title: 'Old' } }, { type: 'FETCH_MOVIES', payload: [{ id: 1, title: 'A' }, { id: 2, title: 'B' }] })
  expect(state).toEqual({ 1: { id: 1, title: 'A' }, 2: { id: 2, title: 'B' }, 9: { id: 9, title: 'Old' } })
})

it('keys fetched shows by id', () => {
  expect(userShowReducer({}, { type: 'FETCH_SHOWS', payload: [{ id: 5, title: 'Dark' }] })).toEqual({ 5: { id: 5, title: 'Dark' } })
})
