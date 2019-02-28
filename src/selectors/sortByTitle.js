export default (movies) => {
  return movies.sort((a,b) => {
    // return a.sort_name.toLowerCase() < b.sort_name.toLowerCase() ? -1 : 1
    return a.sort_name.localeCompare(b.sort_name, 'en', {'sensitivity': 'base'}) || a.year.localeCompare(b.year, 'en', {'sensitivity': 'base'})
  })
}