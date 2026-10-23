import { installSessionExpiry } from './sessionExpiry'

const fakeApi = () => {
  const api = { interceptors: { response: { use: (onSuccess, onError) => { api.onError = onError } } } }
  return api
}

const fakeStorage = () => {
  const items = { myflixUser: '{"token":"t"}' }
  return {
    items,
    removeItem: key => { delete items[key] }
  }
}

const setup = () => {
  const api = fakeApi()
  const deps = { dispatch: jest.fn(), history: { push: jest.fn() }, storages: [fakeStorage(), fakeStorage()] }
  installSessionExpiry(api, deps)
  return { api, ...deps }
}

it('signs the user out on a 401 and still rejects', async () => {
  const { api, dispatch, history, storages } = setup()
  const error = { response: { status: 401 } }

  await expect(api.onError(error)).rejects.toBe(error)
  storages.forEach(storage => expect(storage.items).not.toHaveProperty('myflixUser'))
  expect(dispatch).toHaveBeenCalledWith({ type: 'LOGOUT' })
  expect(history.push).toHaveBeenCalledWith('/login')
})

it('keeps the login on other errors', async () => {
  const { api, dispatch, history, storages } = setup()
  const error = { response: { status: 500 } }

  await expect(api.onError(error)).rejects.toBe(error)
  storages.forEach(storage => expect(storage.items).toHaveProperty('myflixUser'))
  expect(dispatch).not.toHaveBeenCalled()
  expect(history.push).not.toHaveBeenCalled()
})

it('keeps the login when the request never got a response', async () => {
  const { api, dispatch } = setup()
  const error = new Error('Network Error')

  await expect(api.onError(error)).rejects.toBe(error)
  expect(dispatch).not.toHaveBeenCalled()
})
