import { combineReducers, applyMiddleware, createStore, compose } from 'redux'
import { reducer as formReducer } from 'redux-form'
import reduxThunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'

import authReducer from '../reducers/authReducer'
import homePageReducer from '../reducers/homePageReducer'
import userMovieReducer from '../reducers/userMovieReducer'
import filtersReducer from '../reducers/filtersReducer'
import newMovieReducer from '../reducers/newMovieReducer'
import newShowReducer from '../reducers/newShowReducer'
import userShowReducer from '../reducers/userShowReducer'
import newEpisodeReducer from '../reducers/newEpisodeReducer'
import countReducer from '../reducers/countReducer'

const composeEnhancers = composeWithDevTools({ compose })

export default () => {
  const store = createStore(
    combineReducers({
      auth: authReducer,
      home: homePageReducer,
      movies: userMovieReducer,
      shows: userShowReducer,
      newMovies: newMovieReducer,
      newShows: newShowReducer,
      newEpisodes: newEpisodeReducer,
      filters: filtersReducer,
      counts: countReducer,
      form: formReducer
    }),
    composeEnhancers(applyMiddleware(reduxThunk))
  )

  return store
}