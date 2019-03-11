import _ from 'lodash'

export default (state = {}, action) => {
  switch (action.type) {
    case 'FETCH_MOVIES':
      return {
        ...state,
        ..._.mapKeys(action.payload, 'id')
      }
    case 'ADD_MOVIE':
      return { ...state, [action.payload.id]: action.payload }
    default:
      return state
  }
}