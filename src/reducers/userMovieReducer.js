import _ from 'lodash'

export default (state = {}, action) => {
  switch (action.type) {
    case 'FETCH_MOVIES':
      return {
        ...state,
        ..._.mapKeys(action.payload, 'id')
      }
    case 'FETCH_SEARCH_NEW_MOVIES':
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}