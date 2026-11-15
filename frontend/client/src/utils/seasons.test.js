import { isSpecials, seasonName } from './seasons'

it('takes season 0 as the specials, as a number or a string', () => {
  expect(isSpecials(0)).toBe(true)
  expect(isSpecials('0')).toBe(true)
  expect(isSpecials(1)).toBe(false)
  expect(isSpecials('1')).toBe(false)
})

it('names the specials and every other season', () => {
  expect(seasonName(0)).toBe('Specials')
  expect(seasonName('0')).toBe('Specials')
  expect(seasonName(3)).toBe('Season 3')
})
