import { createSelector } from 'reselect'
import filter from 'lodash/filter'
import orderBy from 'lodash/orderBy'

const moviesSelector = state => state.movies
const titleSelector = state => state.filters

const getMovies = (movies, filters) => {
  const filteredMovies = filter(
    movies,
    movie => movie.search_name.includes(filters.text.toLowerCase())
  )
  return orderBy(filteredMovies, [movie => movie.sort_name.toLowerCase(), 'year'], ['asc', 'asc'])
}

export default createSelector(
  moviesSelector,
  titleSelector,
  getMovies
)