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
  formValues.remember ? window.localStorage.setItem("myflixUser", JSON.stringify(response.data)) : window.sessionStorage.setItem("myflixUser", JSON.stringify(response.data))
  dispatch(login(response.data.user))
  history.push(`/browse/${response.data.user.id}`)
}