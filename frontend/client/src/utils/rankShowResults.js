// MMDb sorts a show search by year, so a show already in the collection can come after dozens of loose matches.
// Only seasons from MMDb's own database carry a show_id, which is how a result is known to be the collection's.
export const rankShowResults = (results, myShows, text) => {
  const wanted = text.trim().toLowerCase()
  const group = row => row.show_id in myShows ? 0 : String(row.title ?? '').trim().toLowerCase() === wanted ? 1 : 2
  return [...results].sort((a, b) => group(a) - group(b))
}
