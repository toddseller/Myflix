let initial_state = {}
if (window.localStorage.getItem('myflixUser') || window.sessionStorage.getItem('myflixUser')) {
  const myflixUser = window.localStorage.getItem('myflixUser') ? JSON.parse(window.localStorage.getItem('myflixUser')) : JSON.parse(window.sessionStorage.getItem('myflixUser'))
  initial_state = {
    avatar: myflixUser.user.avatar,
    isSignedIn: true,
    userId: myflixUser.user.id,
    firstName: myflixUser.user.firstName,
    userName: myflixUser.user.userName
  }
} else {
  initial_state = {
    avatar: '',
    isSignedIn: null,
    userId: null,
    firstName: '',
    userName: ''
  }
}

export default (state = initial_state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isSignedIn: true,
        userId: action.payload.id,
        firstName: action.payload.firstName,
        userName: action.payload.userName,
        avatar: action.payload.avatar
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