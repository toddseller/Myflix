import { history } from '../routers/AppRouter'
import mmdb from '../apis/mmdb'

export const login = user => {
  return {
    type: 'LOGIN',
    payload: user
  }
}

export const startLogin = formValues => async dispatch => {
  const response = await mmdb.post('/authenticate', { ...formValues })
  window.localStorage.setItem("token", response.data.token)
  dispatch(login(response.data.user))
  history.push(`/browse/${response.data.user.id}`)
}