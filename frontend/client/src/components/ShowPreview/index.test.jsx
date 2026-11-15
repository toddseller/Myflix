import React from 'react'
import { render as renderDom } from '@testing-library/react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import ShowPreview from './index'

const render = (title, seasons = { seasonCount: '1', seasonNumbers: '1' }) => {
  const show = { id: 1, title, poster: 'poster.jpg', ...seasons }
  return renderDom(
    <Provider store={ createStore(() => ({ shows: { 1: show } })) }>
      <ShowPreview id={ 1 } onClick={ () => {} } />
    </Provider>
  ).container
}

it('decodes entities in the title', () => {
  expect(render('Law &amp; Order').querySelector('.truncate').textContent).toBe('Law & Order')
})

it('never turns markup in a title into elements', () => {
  const container = render('<img src="x" onerror="window.__xss = true">Dark')
  expect(container.querySelector('.truncate').children).toHaveLength(0)
  expect(container.querySelector('img[src="x"]')).toBeNull()
  expect(window.__xss).toBeUndefined()
})

it('is not marked open unless told, and always has a pointer', () => {
  const container = render('Dark')
  expect(container.querySelector('.show-preview').classList.contains('open')).toBe(false)
  expect(container.querySelector('.show-preview > .pointer')).not.toBeNull()
})

it('reads Specials for a show with only specials', () => {
  expect(render('Dark', { seasonCount: '0', seasonNumbers: '' }).querySelector('.seasons').textContent).toBe('Specials')
})

it('names a single season even when MMDb has a stale count of 0 for it', () => {
  expect(render('The Regime', { seasonCount: '0', seasonNumbers: '1' }).querySelector('.seasons').textContent).toBe('Season 1')
})

it('keeps the count MMDb sends, which leaves the specials out', () => {
  expect(render('MythBusters', { seasonCount: '14', seasonNumbers: '14' }).querySelector('.seasons').textContent).toBe('14 Seasons')
})
