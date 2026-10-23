import mapKeys from 'lodash/mapKeys'

export default (state = {}, action) => {
  switch (action.type) {
    case 'FETCH_MOVIES':
      return {
        ...state,
        ...mapKeys(action.payload, 'id')
      }
    case 'FETCH_MOVIE':
      return { ...state, [action.payload.id]: action.payload }
    case 'ADD_MOVIE':
      return { ...state, [action.payload.id]: action.payload }
    default:
      return state
  }
}