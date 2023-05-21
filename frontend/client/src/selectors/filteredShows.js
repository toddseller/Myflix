import { createSelector } from 'reselect'
import _ from 'lodash'

const showsSelector = state => state.shows
const titleSelector = state => state.filters

const getShows = (shows, filters) => {
  const filteredShows = _.filter(
    shows,
    show => show.search_name.includes(filters.text.toLowerCase())
  )
  return _.orderBy(filteredShows, [show => show.sort_name.toLowerCase()], ['asc'])
}

export default createSelector(
  showsSelector,
  titleSelector,
  getShows
)