import { router } from '../routers/router'
import mmdb from '../apis/mmdb'

export const login = user => {
  return {
    type: 'LOGIN',
    payload: user
  }
}

export const startLogin = formValues => async dispatch => {
  const response = await mmdb.post('/authenticate', { ...formValues })
  formValues.remember ? window.localStorage.setItem("myflixUser", JSON.stringify(response.data)) : window.sessionStorage.setItem("myflixUser", JSON.stringify(response.data))
  dispatch(login(response.data.user))
  router.navigate('/browse')
}

export const startLogout = () => dispatch => {
  const myflixUser = JSON.parse(window.localStorage.getItem('myflixUser') || window.sessionStorage.getItem('myflixUser'))
  // Only ends MMDb's session cookie; the token can't be revoked, so signing out never waits on or depends on it.
  if (myflixUser) mmdb.post('/deauthenticate', null, { headers: { Authorization: `bearer ${ myflixUser.token }` } }).catch(() => {})
  window.localStorage.removeItem('myflixUser')
  window.sessionStorage.removeItem('myflixUser')
  dispatch({ type: 'LOGOUT' })
  router.navigate('/')
}

export const startUpdateAvatar = file => async dispatch => {
  const storage = window.localStorage.getItem('myflixUser') ? window.localStorage : window.sessionStorage
  const myflixUser = JSON.parse(storage.getItem('myflixUser'))
  const body = new FormData()
  body.append('avatar', file)
  const { data } = await mmdb.post('/avatar', body, { headers: { Authorization: `bearer ${ myflixUser.token }` } })
  storage.setItem('myflixUser', JSON.stringify({ ...myflixUser, user: { ...myflixUser.user, avatar: data.avatar } }))
  dispatch({ type: 'UPDATE_AVATAR', avatar: data.avatar })
}
