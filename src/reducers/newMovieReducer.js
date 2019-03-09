export default (state = {}, action) => {
  switch (action.type) {
    case 'FETCH_SEARCH_NEW_MOVIES':
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}