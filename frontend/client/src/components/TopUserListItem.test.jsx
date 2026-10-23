import React from 'react'
import { render } from '@testing-library/react'

import TopUserListItem from './TopUserListItem'

const icons = container => [...container.querySelectorAll('svg')].map(svg => svg.getAttribute('data-icon'))

it('shows the film and TV icons with the counts', () => {
  const { container } = render(<TopUserListItem user={ { userName: 'ann', avatar: 'a.jpg', movieCount: 12, showCount: 3 } } />)
  expect(icons(container)).toEqual(['film', 'tv'])
  expect(container.textContent).toContain('12 Movies')
})

it('shows the user-secret icon when there is no avatar', () => {
  const { container } = render(<TopUserListItem user={ { userName: 'bo', avatar: '', movieCount: 1, showCount: 0 } } />)
  expect(icons(container)).toEqual(['user-secret', 'film'])
})
