import React from 'react'
import { fireEvent } from '@testing-library/react'

import LoginForm from './LoginForm'
import { renderWithStore } from '../../testing/render'

const fields = container => ({
  user: container.querySelector('input[name="username_email"]'),
  password: container.querySelector('input[name="password"]'),
  remember: container.querySelector('input[name="remember"]'),
  form: container.querySelector('form')
})

const errorTexts = container => [...container.querySelectorAll('.form-input span')].map(s => s.textContent)

it('submits the user, password and remember choice', () => {
  const onSubmit = vi.fn()
  const { container } = renderWithStore(<LoginForm onSubmit={ onSubmit } />)
  const { user, password, remember, form } = fields(container)

  fireEvent.change(user, { target: { value: 'ann@example.test' } })
  fireEvent.change(password, { target: { value: 'secret' } })
  fireEvent.click(remember)
  fireEvent.submit(form)

  expect(onSubmit).toHaveBeenCalledTimes(1)
  expect(onSubmit.mock.calls[0][0]).toEqual({ username_email: 'ann@example.test', password: 'secret', remember: true })
})

it('shows Required under the password and does not submit when it is empty', () => {
  const onSubmit = vi.fn()
  const { container } = renderWithStore(<LoginForm onSubmit={ onSubmit } />)
  const { user, form } = fields(container)

  fireEvent.change(user, { target: { value: 'ann@example.test' } })
  fireEvent.submit(form)

  expect(onSubmit).not.toHaveBeenCalled()
  expect(errorTexts(container)).toEqual(['Required'])
})

// validate.js checks `userNameEmail` but the field is `username_email`, so an empty user is never flagged.
it('submits with an empty user, because validate.js checks the wrong field name', () => {
  const onSubmit = vi.fn()
  const { container } = renderWithStore(<LoginForm onSubmit={ onSubmit } />)
  const { password, form } = fields(container)

  fireEvent.change(password, { target: { value: 'secret' } })
  fireEvent.submit(form)

  expect(onSubmit).toHaveBeenCalledWith({ password: 'secret' })
  expect(errorTexts(container)).toEqual([])
})
