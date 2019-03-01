// export default (movies) => {
//   return movies.sort((a,b) => {
//     return a.sort_name.localeCompare(b.sort_name, 'en', {'sensitivity': 'base'}) || a.year.localeCompare(b.year, 'en', {'sensitivity': 'base'})
//   })
// }

export default (movies, text='') => {
  return movies.filter(movie => {
    return movie.search_name.toLowerCase().includes(text.toLowerCase())
  }).sort((a,b) => {
    return a.sort_name.localeCompare(b.sort_name, 'en', {'sensitivity': 'base'}) || a.year.localeCompare(b.year, 'en', {'sensitivity': 'base'})
  })
}