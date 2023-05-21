export default (state = [], action) => {
  switch (action.type) {
    case 'FETCH_HOMEPAGE':
      return {
        ...state,
        ...action.data
      }
    default:
      return state
  }
}