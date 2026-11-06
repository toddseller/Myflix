import { rankShowResults } from './rankShowResults'

// MMDb's rows: seasons from its own database carry show_id, Apple and TMDB rows don't.
const stored = (show_id, title, season) => ({ show_id, title, season })
const found = (title, season) => ({ title, season })
const titles = rows => rows.map(row => `${ row.title } ${ row.season }`)

it('puts the collection\'s own show first, however far down MMDb put it', () => {
  const results = [found('Nocturne Knights', 1), found('NBC Nightly News', 1), found('NBC Nightly News', 2), stored(1525, 'Nocturne', 1)]
  expect(titles(rankShowResults(results, { 1525: {} }, 'nocturne'))).toEqual(['Nocturne 1', 'Nocturne Knights 1', 'NBC Nightly News 1', 'NBC Nightly News 2'])
})

it('puts an exact title ahead of looser matches, keeping MMDb\'s order within each group', () => {
  const results = [found('Dark Matter', 1), found('Dark', 1), found('Dark Winds', 1), found('Dark', 2), found('Dark', 3)]
  expect(titles(rankShowResults(results, {}, '  DARK '))).toEqual(['Dark 1', 'Dark 2', 'Dark 3', 'Dark Matter 1', 'Dark Winds 1'])
})

it('puts the collection ahead of an exact title', () => {
  const results = [found('Dark', 1), stored(7, 'Dark Matter', 1)]
  expect(titles(rankShowResults(results, { 7: {} }, 'dark'))).toEqual(['Dark Matter 1', 'Dark 1'])
})

it('keeps MMDb\'s order when nothing is the collection\'s or an exact title', () => {
  const results = [found('Late Night Lockup', 1), stored(9, 'Night Visions', 1), found('Earth at Night', 2)]
  expect(rankShowResults(results, { 1525: {} }, 'night')).toEqual(results)
})

it('treats a result without a title as a loose match', () => {
  expect(titles(rankShowResults([{ season: 1 }, found('Dark', 1)], {}, 'dark'))).toEqual(['Dark 1', 'undefined 1'])
})
