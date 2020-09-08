export default (state = {}, action) => {
  switch (action.type) {
    case 'FETCH_SEARCH_NEW_SHOWS':
      return {
        ...state,
        ...action.payload
      }
    case 'CLEAR_SEARCH_NEW_SHOWS':
      return {}
    default:
      return state
  }
}