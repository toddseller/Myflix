// The store and router are passed in because importing them here would create a cycle through mmdb.js.
export const installSessionExpiry = (api, { dispatch, history, storages }) => {
  api.interceptors.response.use(response => response, error => {
    if (error.response && error.response.status === 401) {
      storages.forEach(storage => storage.removeItem('myflixUser'))
      dispatch({ type: 'LOGOUT' })
      history.push('/login')
    }
    return Promise.reject(error)
  })
}
