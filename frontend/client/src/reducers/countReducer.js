export default (state = {}, action) => {
  switch (action.type) {
    case 'FETCH_COUNTS':
      return {
        ...state,
        ...action.data
      }
    default:
      return state
  }
}