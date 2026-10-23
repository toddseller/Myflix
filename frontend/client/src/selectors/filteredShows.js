import { createSelector } from 'reselect'
import filter from 'lodash/filter'
import orderBy from 'lodash/orderBy'

const showsSelector = state => state.shows
const titleSelector = state => state.filters

const getShows = (shows, filters) => {
  const filteredShows = filter(
    shows,
    show => show.search_name.includes(filters.text.toLowerCase())
  )
  return orderBy(filteredShows, [show => show.sort_name.toLowerCase()], ['asc'])
}

export default createSelector(
  showsSelector,
  titleSelector,
  getShows
)