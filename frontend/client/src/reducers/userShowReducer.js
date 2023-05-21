import _ from 'lodash'

export default (state = {}, action) => {
  switch (action.type) {
    case 'FETCH_SHOWS':
      return {
        ...state,
        ..._.mapKeys(action.payload, 'id')
      }
    case 'FETCH_SHOW':
      return { ...state, [action.payload.id]: action.payload }
    case 'ADD_SHOW':
      return { ...state, [action.payload.id]: action.payload }
    default:
      return state
  }
}