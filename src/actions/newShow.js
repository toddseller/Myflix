import mmdb from '../apis/mmdb'

export const fetchSearchNewShows = shows => {
  return {
    type: 'FETCH_SEARCH_NEW_SHOWS',
    payload: shows
  }
}

export const clearSearchNewShows = () => {
  return {
    type: 'CLEAR_SEARCH_NEW_SHOWS'
  }
}

export const startFetchSearchNewShows = query => async dispatch => {
  const myflixUser = window.localStorage.getItem('myflixUser') ? JSON.parse(window.localStorage.getItem('myflixUser')) : JSON.parse(window.sessionStorage.getItem('myflixUser'))
  const response = await mmdb.get('/add_show', {
    headers: { 'Authorization': 'bearer ' + myflixUser.token },
    params: { query: query }
  })

  dispatch(fetchSearchNewShows(response.data))
}