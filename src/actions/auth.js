import { history } from '../routers/AppRouter'
import mmdb from '../apis/mmdb'

export const login = user => ({
  type: 'LOGIN',
  user
})

export const startLogin = formValues => async dispatch => {
  const response = await mmdb.post('/authenticate', { ...formValues })
  dispatch(login(response.data.user))
  history.push('/browse')
}