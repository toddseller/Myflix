import { fireEvent } from '@testing-library/react'

import { afterTransition, easeHeight } from './motion'

afterEach(() => vi.useRealTimers())

it('finishes after 450ms when no transition ends', () => {
  vi.useFakeTimers()
  const done = vi.fn()
  afterTransition(document.createElement('div'), 'height', done)
  vi.advanceTimersByTime(449)
  expect(done).not.toHaveBeenCalled()
  vi.advanceTimersByTime(1)
  expect(done).toHaveBeenCalledTimes(1)
})

it('finishes once, on its own property only', () => {
  vi.useFakeTimers()
  const el = document.createElement('div')
  const done = vi.fn()
  afterTransition(el, 'height', done)
  fireEvent.transitionEnd(el, { propertyName: 'opacity' })
  expect(done).not.toHaveBeenCalled()
  fireEvent.transitionEnd(el, { propertyName: 'height' })
  vi.advanceTimersByTime(450)
  expect(done).toHaveBeenCalledTimes(1)
})

it('does nothing once cancelled', () => {
  vi.useFakeTimers()
  const done = vi.fn()
  afterTransition(document.createElement('div'), 'height', done)()
  vi.advanceTimersByTime(450)
  expect(done).not.toHaveBeenCalled()
})

// jsdom does no layout, so the wrapper reports the height its content would have.
const wrapperOf = height => {
  const wrapper = document.createElement('div')
  Object.defineProperty(wrapper, 'offsetHeight', { get: () => height.now })
  Object.defineProperty(wrapper, 'scrollHeight', { get: () => height.now })
  return wrapper
}

it('eases a content swap from the old height to the new one, then lets go', () => {
  const height = { now: 100 }
  const wrapper = wrapperOf(height)
  let pinned
  easeHeight(wrapper, () => {
    pinned = wrapper.style.height
    height.now = 250
  })
  expect(pinned).toBe('100px')
  expect(wrapper.style.height).toBe('250px')
  fireEvent.transitionEnd(wrapper, { propertyName: 'height' })
  expect(wrapper.style.height).toBe('')
})

it('lets go at once when the height does not change', () => {
  const wrapper = wrapperOf({ now: 100 })
  easeHeight(wrapper, () => {})
  expect(wrapper.style.height).toBe('')
})
