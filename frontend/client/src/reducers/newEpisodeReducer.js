export default (state = {}, action) => {
  switch (action.type) {
    case 'FETCH_SEARCH_NEW_EPISODES':
      return {
        ...state,
        ...action.payload
      }
    case 'CLEAR_SEARCH_NEW_EPISODES':
      return {}
    default:
      return state
  }
}