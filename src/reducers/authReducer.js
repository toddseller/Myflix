const INITIAL_STATE = {
  isSignedIn: null,
  userId: null,
  firstName: '',
  userName: ''
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isSignedIn: true,
        userId: action.payload.id,
        firstName: action.payload.firstName,
        userName: action.payload.userName
      }
    case 'LOGOUT':
      return {
        ...state,
        isSignedIn: false,
        userId: null,
        firstName: '',
        userName: ''
      }
    default:
      return state
  }
}