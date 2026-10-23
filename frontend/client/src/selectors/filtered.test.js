import filteredMovies from './filteredMovies'
import filteredShows from './filteredShows'

const movie = (id, title, year) => ({ id, search_name: title.toLowerCase(), sort_name: title, year })

it('filters movies by the search text and sorts by title, then year', () => {
  const movies = { 1: movie(1, 'Dune', '2021'), 2: movie(2, 'Alien', '1979'), 3: movie(3, 'Dune', '1984'), 4: movie(4, 'Heat', '1995') }
  expect(filteredMovies({ movies, filters: { text: 'DUNE' } }).map(m => m.id)).toEqual([3, 1])
  expect(filteredMovies({ movies, filters: { text: '' } }).map(m => m.id)).toEqual([2, 3, 1, 4])
})

it('sorts titles without regard to case', () => {
  const movies = { 1: movie(1, 'beta', '2000'), 2: movie(2, 'Alpha', '2000') }
  expect(filteredMovies({ movies, filters: { text: '' } }).map(m => m.id)).toEqual([2, 1])
})

it('filters shows by the search text and sorts by title only', () => {
  const shows = { 1: movie(1, 'Lupin', '2021'), 2: movie(2, 'Dark', '2017'), 3: movie(3, 'Daredevil', '2015') }
  expect(filteredShows({ shows, filters: { text: 'da' } }).map(s => s.id)).toEqual([3, 2])
})
