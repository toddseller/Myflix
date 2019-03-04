const filtersReducerDefaultState = {
  text: '',
  display: 'all'
}

export default (state = filtersReducerDefaultState, action) => {
  switch (action.type) {
    case 'SET_TEXT_FILTER':
      return {
        ...state,
        text: action.text
      }
    case 'SET_DISPLAY_ALL':
      return {
        ...state,
        display: 'all'
      }
    case 'SET_DISPLAY_UNWATCHED':
      return {
        ...state,
        display: 'isNew'
      }
    default:
      return state
  }
}
