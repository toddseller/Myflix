import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import ScrollRow from './index'

// jsdom does no layout: the line is lineWidth wide, and each item 100px.
let lineWidth
const scrolled = new WeakMap()
const stubs = {
  clientWidth: { get() { return this.classList.contains('things-line') ? lineWidth : 0 } },
  scrollWidth: { get() { return this.classList.contains('things-line') ? this.children.length * 100 : 0 } },
  scrollLeft: { get() { return scrolled.get(this) ?? 0 }, set(value) { scrolled.set(this, value) } }
}
beforeAll(() => {
  for (const [name, stub] of Object.entries(stubs)) Object.defineProperty(HTMLElement.prototype, name, { configurable: true, ...stub })
})
afterAll(() => { for (const name of Object.keys(stubs)) delete HTMLElement.prototype[name] })
beforeEach(() => { lineWidth = 500 })

const row = (count, props) => render(
  <ScrollRow name="things" label="things" { ...props }>{ Array.from({ length: count }, (_, i) => <span key={ i }>{ i }</span>) }</ScrollRow>
)
const arrows = () => screen.queryAllByRole('button').map(button => button.getAttribute('aria-label'))
const line = container => container.querySelector('.things-line')

it('shows no arrows when everything fits', () => {
  row(3)
  expect(arrows()).toEqual([])
})

it('names its arrows from its label, and shows only the later one at its start', () => {
  row(12)
  expect(arrows()).toEqual(['Later things'])
})

it('shows both arrows in the middle and only the earlier one at the end', () => {
  const { container } = row(12)
  line(container).scrollLeft = 300
  fireEvent.scroll(line(container))
  expect(arrows()).toEqual(['Earlier things', 'Later things'])
  line(container).scrollLeft = 700
  fireEvent.scroll(line(container))
  expect(arrows()).toEqual(['Earlier things'])
})

it('measures again when its content changes', () => {
  const { rerender } = row(3)
  rerender(<ScrollRow name="things" label="things">{ Array.from({ length: 12 }, (_, i) => <span key={ i }>{ i }</span>) }</ScrollRow>)
  expect(arrows()).toEqual(['Later things'])
})

it('lets the caller place the line before the arrows are first measured', () => {
  row(12, { place: el => { el.scrollLeft = 700 } })
  expect(arrows()).toEqual(['Earlier things'])
})
