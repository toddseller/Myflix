import React from 'react'
import { render } from '@testing-library/react'

import ToggleButton from './index'

const classOf = props => render(<ToggleButton { ...props } />).container.querySelector('.button').className

it('uses the given theme', () => {
  expect(classOf({ theme: 'red' })).toBe('button button--red')
})

it('falls back to the default theme when the theme is not a string', () => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
  expect(classOf({ theme: 5 })).toBe('button button--default')
  expect(classOf({})).toBe('button button--default')
})
