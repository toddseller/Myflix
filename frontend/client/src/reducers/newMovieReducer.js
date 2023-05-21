export default (state = {}, action) => {
  switch (action.type) {
    case 'FETCH_SEARCH_NEW_MOVIES':
      return {
        ...state,
        ...action.payload
      }
    case 'CLEAR_SEARCH_NEW_MOVIES':
      return {}
    default:
      return state
  }
}