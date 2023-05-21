import { createSelector } from 'reselect'
import _ from 'lodash'

const moviesSelector = state => state.movies
const titleSelector = state => state.filters

const getMovies = (movies, filters) => {
  const filteredMovies = _.filter(
    movies,
    movie => movie.search_name.includes(filters.text.toLowerCase())
  )
  return _.orderBy(filteredMovies, [movie => movie.sort_name.toLowerCase(), 'year'], ['asc', 'asc'])
}

export default createSelector(
  moviesSelector,
  titleSelector,
  getMovies
)