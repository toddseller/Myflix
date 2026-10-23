import React from 'react'
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'

import ToggleButton from './index'

const classOf = props => {
  const container = document.createElement('div')
  act(() => { ReactDOM.render(<ToggleButton { ...props } />, container) })
  return container.querySelector('.button').className
}

it('uses the given theme', () => {
  expect(classOf({ theme: 'red' })).toBe('button button--red')
})

it('falls back to the default theme when the theme is not a string', () => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
  expect(classOf({ theme: 5 })).toBe('button button--default')
  expect(classOf({})).toBe('button button--default')
})
