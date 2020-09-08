import mmdb from '../apis/mmdb'

export const fetchSearchNewEpisodes = episodes => {
  return {
    type: 'FETCH_SEARCH_NEW_EPISODES',
    payload: episodes
  }
}

export const clearSearchNewEpisodes = () => {
  return {
    type: 'CLEAR_SEARCH_NEW_EPISODES'
  }
}

export const addShow = show => {
  return {
    type: 'ADD_SHOW',
    payload: show
  }
}

export const startFetchSearchNewEpisodes = show => async dispatch => {
  const myflixUser = window.localStorage.getItem('myflixUser') ? JSON.parse(window.localStorage.getItem('myflixUser')) : JSON.parse(window.sessionStorage.getItem('myflixUser'))
  mmdb.defaults.headers.common['Authorization'] = `bearer ${ myflixUser.token }`

  const showResponse = await mmdb.post('/add_show', { show })

  const response = await mmdb.get('/add_episodes', {
    params: { show: show.collectionId }
  })
  dispatch(fetchSearchNewEpisodes(response.data))
}