import userMovieReducer from './userMovieReducer'
import userShowReducer from './userShowReducer'

it('keys fetched movies by id and keeps the ones already loaded', () => {
  const state = userMovieReducer({ 9: { id: 9, title: 'Old' } }, { type: 'FETCH_MOVIES', payload: [{ id: 1, title: 'A' }, { id: 2, title: 'B' }] })
  expect(state).toEqual({ 1: { id: 1, title: 'A' }, 2: { id: 2, title: 'B' }, 9: { id: 9, title: 'Old' } })
})

it('keys fetched shows by id', () => {
  expect(userShowReducer({}, { type: 'FETCH_SHOWS', payload: [{ id: 5, title: 'Dark' }] })).toEqual({ 5: { id: 5, title: 'Dark' } })
})

it('keeps a show tile\'s season fields when its details are fetched', () => {
  const state = userShowReducer({ 5: { id: 5, title: 'Dark', seasonNumbers: '1, 2', seasonCount: 2 } }, { type: 'FETCH_SHOW', payload: { id: 5, title: 'Dark', seasons: [] } })
  expect(state[5]).toEqual({ id: 5, title: 'Dark', seasonNumbers: '1, 2', seasonCount: 2, seasons: [] })
})

it('keeps a movie tile\'s fields when its details are fetched', () => {
  const state = userMovieReducer({ 1: { id: 1, title: 'A', isnew: true } }, { type: 'FETCH_MOVIE', payload: { id: 1, title: 'A', plot: 'P' } })
  expect(state[1]).toEqual({ id: 1, title: 'A', isnew: true, plot: 'P' })
})
