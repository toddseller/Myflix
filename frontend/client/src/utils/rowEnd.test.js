import { rowEnd } from './rowEnd'

// jsdom does no layout, so each child gets the top it would have in a grid.
const grid = tops => {
  const list = document.createElement('div')
  tops.forEach((top, index) => {
    const el = document.createElement('div')
    el.id = `t${ index }`
    Object.defineProperty(el, 'offsetTop', { value: top })
    list.append(el)
  })
  return list.children
}

it('finds the last tile in a middle row', () => {
  const tiles = grid([0, 0, 0, 300, 300, 300, 600])
  expect(rowEnd(tiles[3]).id).toBe('t5')
})

it('finds the end of a last, partly filled row', () => {
  const tiles = grid([0, 0, 0, 300])
  expect(rowEnd(tiles[3]).id).toBe('t3')
})

it('stops at a drawer that follows the row', () => {
  const tiles = grid([0, 0, 320, 600, 600])
  expect(rowEnd(tiles[0]).id).toBe('t1')
})
