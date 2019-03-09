import mmdb from '../apis/mmdb'

export const fetchSearchNewMovies = movies => {
  return {
    type: 'FETCH_SEARCH_NEW_MOVIES',
    payload: movies
  }
}

export const startFetchSearchNewMovies = query => async dispatch => {
  const myflixUser = window.localStorage.getItem('myflixUser') ? JSON.parse(window.localStorage.getItem('myflixUser')) : JSON.parse(window.sessionStorage.getItem('myflixUser'))
  const response = await mmdb.get('/add_movies', {
    headers: { 'Authorization': 'bearer ' + myflixUser.token },
    params: { query: query }
  })

  dispatch(fetchSearchNewMovies(response.data))
}