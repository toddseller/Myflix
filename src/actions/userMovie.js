// import { history } from '../routers/AppRouter'
import mmdb from '../apis/mmdb'

export const fetchMovies = movies => {
  return {
    type: 'FETCH_MOVIES',
    payload: movies
  }
}

export const addMovie = movie => {
  return {
    type: 'ADD_MOVIE',
    payload: movie
  }
}

export const startFetchMovies = () => async dispatch => {
  const myflixUser = window.localStorage.getItem('myflixUser') ? JSON.parse(window.localStorage.getItem('myflixUser')) : JSON.parse(window.sessionStorage.getItem('myflixUser'))
  const response = await mmdb.get('/movies', { headers: { 'Authorization': `bearer ${ myflixUser.token }` } })

  dispatch(fetchMovies(response.data))
}

export const startAddMovie = movie => async dispatch => {
  const myflixUser = window.localStorage.getItem('myflixUser') ? JSON.parse(window.localStorage.getItem('myflixUser')) : JSON.parse(window.sessionStorage.getItem('myflixUser'))
  mmdb.defaults.headers.common['Authorization'] = `bearer ${ myflixUser.token }`
  const response = await mmdb.post('/add_movie', { movie })

  dispatch(addMovie(response.data))
}