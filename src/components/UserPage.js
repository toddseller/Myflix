import React, { Component } from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import { forceCheck } from 'react-lazyload'
import snakeCase from 'lodash/snakeCase'
import _ from 'lodash'
import classnames from 'classnames'

import { startFetchMovies } from '../actions/userMovie'
import { setTextFilter, setDisplayAll, setDisplayUnwatched } from '../actions/filters'
import FilteredMoviesSelector from '../selectors/filteredMovies'
import LoadingPage from './LoadingPage'
import MoviePreview from './MoviePreview'
import ToggleButton from './ToggleButton'

import '../styles/movie-preview.css'

class UserPage extends Component {
  state = { library: true, unwatched: false }

  toggleSelectedButton = e => {
    const display = e.BUTTON_VALUE

    _.forEach(this.state, (value, key) => {
      if (value) {
        this.setState({ [key]: false })
      }

      if (key === display) {
        this.setState({ [key]: true })
      }
    })

    if (display === 'unwatched') {
      this.props.setDisplayUnwatched()
    } else {
      this.props.setDisplayAll()
    }
  }

  componentDidMount() {
    this.props.startFetchMovies()
    return <LoadingPage />
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    forceCheck()
  }

  render() {
    const borderStyles = {
      deselected: {
        borderTop: 'none #e50914',
        borderLeft: 'none #e50914',
        borderRight: 'none #e50914',
        borderBottom: 'solid 2px #e50914',
        bottom: '-3px',
        boxSizing: 'content-box',
        margin: '0 auto',
        position: 'relative',
        width: 'calc(100% - 1.5rem)',
        transform: 'scaleX(0)',
        transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
      },
      selected: {
        borderTop: 'none #e50914',
        borderLeft: 'none #e50914',
        borderRight: 'none #e50914',
        borderBottom: 'solid 2px #e50914',
        bottom: '-3px',
        boxSizing: 'content-box',
        margin: '0 auto',
        position: 'relative',
        width: 'calc(100% - 1.5rem)',
        transform: 'scaleX(1)',
        transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
      }
    }

    const { movies } = this.props
    const { library, unwatched } = this.state
    if (movies.length < 1) {
      return <LoadingPage />
    }
    return (
      <div>
        <div className='display-by'>
          <ToggleButton
            className="display-all"
            selected={ library }
            value={ 'library' }
            style ={ library ? borderStyles.selected : borderStyles.deselected }
            onClick={ this.toggleSelectedButton }
          >
            Library
          </ToggleButton>
          <ToggleButton
            className="display-unwatched"
            value={ 'unwatched' }
            style ={ unwatched ? borderStyles.selected : borderStyles.deselected }
            onClick={ this.toggleSelectedButton }
          >
            Unwatched
          </ToggleButton>
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
  })
)

export default composedUserPage(UserPage)