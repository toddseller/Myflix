import { combineReducers, applyMiddleware, createStore, compose } from 'redux'
import { thunk } from 'redux-thunk'

import authReducer from '../reducers/authReducer'
import homePageReducer from '../reducers/homePageReducer'
import userMovieReducer from '../reducers/userMovieReducer'
import filtersReducer from '../reducers/filtersReducer'
import newMovieReducer from '../reducers/newMovieReducer'
import newShowReducer from '../reducers/newShowReducer'
import userShowReducer from '../reducers/userShowReducer'
import newEpisodeReducer from '../reducers/newEpisodeReducer'
import countReducer from '../reducers/countReducer'

// The Redux DevTools browser extension, in development only.
const composeEnhancers = (import.meta.env.DEV && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose

const appReducer = combineReducers({
  auth: authReducer,
  home: homePageReducer,
  movies: userMovieReducer,
  shows: userShowReducer,
  newMovies: newMovieReducer,
  newShows: newShowReducer,
  newEpisodes: newEpisodeReducer,
  filters: filtersReducer,
  counts: countReducer
})

// auth was read from storage when its module loaded, so resetting it would sign the user back in; home is public.
const rootReducer = (state, action) =>
  appReducer(action.type === 'LOGOUT' ? { auth: state.auth, home: state.home } : state, action)

export default () => createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))