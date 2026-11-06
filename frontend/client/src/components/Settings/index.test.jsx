import React from 'react'
import { act } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { fireEvent, screen } from '@testing-library/react'

import Settings from '.'
import UserNav from '../header/UserNav'
import mmdb from '../../apis/mmdb'
import { renderWithStore } from '../../testing/render'
import { login } from '../../actions/auth'
import configureStore from '../../store/configureStore'

vi.mock('../../apis/mmdb', () => ({ default: { get: vi.fn(), post: vi.fn() } }))

const stored = { token: 't', user: { id: 7, firstName: 'Ann', userName: 'ann', avatar: 'a.png' } }
const storedAvatar = storage => JSON.parse(storage.getItem('myflixUser')).user.avatar

beforeEach(() => {
  window.localStorage.clear()
  window.sessionStorage.setItem('myflixUser', JSON.stringify(stored))
  URL.createObjectURL = vi.fn(() => 'blob:preview')
  URL.revokeObjectURL = vi.fn()
  mmdb.post.mockReset()
})

const renderSettings = () => {
  const store = configureStore()
  store.dispatch(login({ id: 7, firstName: 'Ann', userName: 'ann', avatar: 'a.png' }))
  renderWithStore(
    <MemoryRouter initialEntries={ ['/settings'] }>
      <UserNav />
      <Routes>
        <Route path="/settings" element={ <Settings /> } />
        <Route path="/browse" element={ <p>My collection page</p> } />
      </Routes>
    </MemoryRouter>, store)
  return store
}

const avatar = () => screen.getByRole('img', { name: 'Your avatar' }).getAttribute('src')
const input = () => screen.getByLabelText('Choose a new avatar')
const save = () => screen.getByRole('button', { name: 'Save' })
const cancel = () => screen.getByRole('button', { name: 'Cancel' })
const png = new File(['png'], 'me.png', { type: 'image/png' })
const choose = file => fireEvent.change(input(), { target: { files: [file] } })

it('shows the current avatar and a JPEG or PNG picker, with nothing to save or cancel yet', () => {
  renderSettings()
  expect(avatar()).toBe('a.png')
  expect(input().getAttribute('type')).toBe('file')
  expect(input().getAttribute('accept')).toBe('image/jpeg,image/png')
  expect(save().disabled).toBe(true)
  expect(cancel().disabled).toBe(true)
})

it('previews a chosen file in place of the avatar and enables Save', () => {
  renderSettings()
  choose(png)
  expect(URL.createObjectURL).toHaveBeenCalledWith(png)
  expect(avatar()).toBe('blob:preview')
  expect(save().disabled).toBe(false)
})

it('restores the avatar on Cancel, without uploading, and lets go of the preview', () => {
  renderSettings()
  choose(png)
  fireEvent.click(cancel())
  expect(avatar()).toBe('a.png')
  expect(save().disabled).toBe(true)
  expect(input().value).toBe('')
  expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:preview')
  expect(mmdb.post).not.toHaveBeenCalled()
})

describe('saving', () => {
  const headerAvatar = () => screen.getByRole('button', { name: 'Account menu' }).querySelector('img').getAttribute('src')
  const message = () => screen.queryByRole('alert')?.textContent

  it('uploads the file, then shows the new avatar in the header, keeps it in the stored sign-in, and goes to the collection', async () => {
    mmdb.post.mockResolvedValue({ data: { avatar: 'https://cdn.myflix.stream/avatars/new.png' } })
    const store = renderSettings()
    choose(png)
    await act(async () => fireEvent.click(save()))
    const [url, body, config] = mmdb.post.mock.calls[0]
    expect(url).toBe('/avatar')
    expect(body.get('avatar')).toBe(png)
    expect(config).toEqual({ headers: { Authorization: 'bearer t' } })
    expect(store.getState().auth.avatar).toBe('https://cdn.myflix.stream/avatars/new.png')
    expect(headerAvatar()).toBe('https://cdn.myflix.stream/avatars/new.png')
    expect(storedAvatar(window.sessionStorage)).toBe('https://cdn.myflix.stream/avatars/new.png')
    expect(window.localStorage.getItem('myflixUser')).toBeNull()
    expect(screen.getByText('My collection page')).toBeDefined()
  })

  it('updates the sign-in in local storage when that is where it is kept', async () => {
    window.sessionStorage.clear()
    window.localStorage.setItem('myflixUser', JSON.stringify(stored))
    mmdb.post.mockResolvedValue({ data: { avatar: 'new.png' } })
    renderSettings()
    choose(png)
    await act(async () => fireEvent.click(save()))
    expect(storedAvatar(window.localStorage)).toBe('new.png')
    expect(window.sessionStorage.getItem('myflixUser')).toBeNull()
  })

  it('disables Save while uploading', async () => {
    mmdb.post.mockReturnValue(new Promise(() => {}))
    renderSettings()
    choose(png)
    await act(async () => fireEvent.click(save()))
    expect(save().disabled).toBe(true)
  })

  const failsWith = async error => {
    mmdb.post.mockRejectedValue(error)
    const store = renderSettings()
    choose(png)
    await act(async () => fireEvent.click(save()))
    expect(store.getState().auth.avatar).toBe('a.png')
    expect(headerAvatar()).toBe('a.png')
    expect(storedAvatar(window.sessionStorage)).toBe('a.png')
    expect(save().disabled).toBe(false)
  }

  it('shows MMDb\'s message when it refuses the file, and leaves the avatar', async () => {
    await failsWith({ response: { status: 422, data: { error: 'Only JPEG and PNG files are accepted.' } } })
    expect(message()).toBe('Only JPEG and PNG files are accepted.')
  })

  it('shows the general message, not MMDb\'s, on a storage failure, and leaves the avatar', async () => {
    await failsWith({ response: { status: 502, data: { error: 'Upload to storage failed' } } })
    expect(message()).toBe('Your avatar couldn\'t be saved. Try again.')
  })

  it('shows the general message when MMDb never answers', async () => {
    await failsWith(new Error('Network Error'))
    expect(message()).toBe('Your avatar couldn\'t be saved. Try again.')
  })
})
