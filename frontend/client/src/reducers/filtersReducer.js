const filtersReducerDefaultState = {
  text: '',
  media: 'movies'
}

export default (state = filtersReducerDefaultState, action) => {
  switch (action.type) {
    case 'SET_TEXT_FILTER':
      return {
        ...state,
        text: action.text
      }
    case 'SET_SELECTED_MEDIA':
      return {
        ...state,
        media: action.media
      }
    default:
      return state
  }
}
