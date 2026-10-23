import React from 'react'
import { act, Simulate } from 'react-dom/test-utils'

import LoginForm from './LoginForm'
import { renderWithStore } from '../../testing/render'

// One act per event, as in a browser: the form re-renders between typing and submitting.
const step = event => act(() => { event() })

const fields = container => ({
  user: container.querySelector('input[name="username_email"]'),
  password: container.querySelector('input[name="password"]'),
  remember: container.querySelector('input[name="remember"]'),
  form: container.querySelector('form')
})

const errorTexts = container => [...container.querySelectorAll('.form-input span')].map(s => s.textContent)

it('submits the user, password and remember choice', () => {
  const onSubmit = jest.fn()
  const { container } = renderWithStore(<LoginForm onSubmit={ onSubmit } />)
  const { user, password, remember, form } = fields(container)

  step(() => Simulate.change(user, { target: { value: 'ann@example.test' } }))
  step(() => Simulate.change(password, { target: { value: 'secret' } }))
  step(() => Simulate.change(remember, { target: { type: 'checkbox', checked: true } }))
  step(() => Simulate.submit(form))

  expect(onSubmit).toHaveBeenCalledTimes(1)
  expect(onSubmit.mock.calls[0][0]).toEqual({ username_email: 'ann@example.test', password: 'secret', remember: true })
})

it('shows Required under the password and does not submit when it is empty', () => {
  const onSubmit = jest.fn()
  const { container } = renderWithStore(<LoginForm onSubmit={ onSubmit } />)
  const { user, form } = fields(container)

  step(() => Simulate.change(user, { target: { value: 'ann@example.test' } }))
  step(() => Simulate.submit(form))

  expect(onSubmit).not.toHaveBeenCalled()
  expect(errorTexts(container)).toEqual(['Required'])
})

// validate.js checks `userNameEmail` but the field is `username_email`, so an empty user is never flagged.
it('submits with an empty user, because validate.js checks the wrong field name', () => {
  const onSubmit = jest.fn()
  const { container } = renderWithStore(<LoginForm onSubmit={ onSubmit } />)
  const { password, form } = fields(container)

  step(() => Simulate.change(password, { target: { value: 'secret' } }))
  step(() => Simulate.submit(form))

  expect(onSubmit).toHaveBeenCalledWith({ password: 'secret' })
  expect(errorTexts(container)).toEqual([])
})
