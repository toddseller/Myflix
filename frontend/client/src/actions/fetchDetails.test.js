import mmdb from '../apis/mmdb'
import { startFetchMovie } from './userMovie'
import { startFetchShow } from './userShow'

beforeEach(() => {
  window.localStorage.setItem('myflixUser', '{"token":"t"}')
  vi.spyOn(mmdb, 'get').mockImplementation(async url => ({ data: { id: 7, url } }))
  vi.spyOn(console, 'log')
})

afterEach(() => {
  vi.restoreAllMocks()
  window.localStorage.clear()
})

it.each([
  ['movie', startFetchMovie, '/movies/7'],
  ['show', startFetchShow, '/shows/7']
])('returns the fetched %s quietly', async (kind, startFetch, url) => {
  const dispatch = vi.fn()

  await expect(startFetch(7)(dispatch)).resolves.toEqual({ id: 7, url })
  expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ payload: { id: 7, url } }))
  expect(console.log).not.toHaveBeenCalled()
})
