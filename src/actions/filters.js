export const setTextFilter = (text = '') => ({
  type: 'SET_TEXT_FILTER',
  text
})

export const setDisplayAll = () => ({
  type: 'SET_DISPLAY_ALL'
})

export const setDisplayUnwatched = () => ({
  type: 'SET_DISPLAY_UNWATCHED'
})