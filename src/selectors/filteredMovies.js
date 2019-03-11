import { createSelector } from 'reselect'
import _ from 'lodash'

const moviesSelector = state => state.movies
const titleSelector = state => state.filters

const getMovies = (movies, filters) => {
  const filteredMovies = _.filter(
    movies,
    movie => filters.display === 'isnew' ? movie.search_name.includes(filters.text.toLowerCase()) && movie.isnew : movie.search_name.includes(filters.text.toLowerCase())
  )
  return _.orderBy(filteredMovies, ['sort_name', 'year'], ['asc', 'asc'])
}

export default createSelector(
  moviesSelector,
  titleSelector,
  getMovies
)