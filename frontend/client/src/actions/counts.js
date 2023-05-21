import mmdb from '../apis/mmdb'

export const fetchCounts = data => ({
  type: 'FETCH_COUNTS',
  data
})

export const getCounts = () => async dispatch => {
  const myflixUser = window.localStorage.getItem('myflixUser') ? JSON.parse(window.localStorage.getItem('myflixUser')) : JSON.parse(window.sessionStorage.getItem('myflixUser'))
  const response = await mmdb.get('/counts', { headers: { 'Authorization': `bearer ${ myflixUser.token }` } })

  dispatch(fetchCounts(response.data))
}