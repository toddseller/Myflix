// import { history } from '../routers/AppRouter'
import mmdb from '../apis/mmdb'

export const fetchMovies = movies => {
  return {
    type: 'FETCH_MOVIES',
    payload: movies
  }
}

export const startFetchMovies = () => async dispatch => {
  const response = await mmdb.get('/movies', {
    headers: {'Authorization': "bearer " + window.localStorage.getItem('token')}
  })
  // console.log(response.data)
  dispatch(fetchMovies(response.data))
  // history.push(`/browse/${response.data.user.id}`)
}