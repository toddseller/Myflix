import React, { Component } from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import { forceCheck } from 'react-lazyload'

import { startFetchMovies } from '../actions/userMovie'
import { setTextFilter, setDisplayAll, setDisplayUnwatched } from '../actions/filters'
import FilteredMoviesSelector from '../selectors/filteredMovies'
import LoadingPage from './LoadingPage'
import MoviePreview from './MoviePreview'
import '../styles/movie-preview.css'

class UserPage extends Component {
  componentDidMount() {
    this.props.startFetchMovies()
    return <LoadingPage />
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    forceCheck()
  }

  setDisplayAll = () => {
    this.props.setDisplayAll()
  }

  setDisplayUnwatched = () => {
    this.props.setDisplayUnwatched()
  }

  render() {
    const { movies } = this.props
    if (movies.length < 1) {
      return <LoadingPage />
    }
    return (
      <div>
        <div className='display-by'>
          <div className="display-all" onClick={ this.setDisplayAll }>
            Library
          </div>
          <div className="display-unwatched" onClick={ this.setDisplayUnwatched }>
            Unwatched
          </div>
        </div>
        <div className="movies-list">
          {
            movies.map(movie => {
              return <MoviePreview key={ movie.id } id={ movie.id } />
            })
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    movies: FilteredMoviesSelector(state)
  }
}

const composedUserPage = compose(
  connect(mapStateToProps, {
    startFetchMovies,
    setTextFilter,
    setDisplayAll,
    setDisplayUnwatched
  }),
)

export default composedUserPage(UserPage)