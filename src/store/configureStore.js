import { combineReducers, applyMiddleware, createStore, compose } from 'redux'
import { reducer as formReducer } from 'redux-form'
import reduxThunk from 'redux-thunk'

import authReducer from '../reducers/authReducer'
import homePageReducer from '../reducers/homePageReducer'
import userMovieReducer from '../reducers/userMovieReducer'
import filtersReducer from '../reducers/filtersReducer'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default () => {
  const store = createStore(
    combineReducers({
      auth: authReducer,
      home: homePageReducer,
      movies: userMovieReducer,
      filters: filtersReducer,
      form: formReducer
    }),
    composeEnhancers(applyMiddleware(reduxThunk))
  )

  return store
}