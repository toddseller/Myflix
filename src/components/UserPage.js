import React, { Component } from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import { forceCheck } from 'react-lazyload'
import snakeCase from 'lodash/snakeCase'
import classnames from 'classnames'

import { startFetchMovies } from '../actions/userMovie'
import { setTextFilter, setDisplayAll, setDisplayUnwatched } from '../actions/filters'
import FilteredMoviesSelector from '../selectors/filteredMovies'
import LoadingPage from './LoadingPage'
import MoviePreview from './MoviePreview'
import ToggleButton from './ToggleButton'

import '../styles/movie-preview.css'

const DISPLAY_FILTER = []

class UserPage extends Component {
  state = { selected: true, only: DISPLAY_FILTER.map(snakeCase) }

  toggleSelectedButton = display => ({selected}) => {
    let { only } = this.state

    if (selected && !only.includes(display)) {
      only.push(display)
      return this.setState({ only })
    }

    if (!selected && only.includes(display)) {
      only = only.filter(item => item !== display)
      console.log(only)
      return this.setState({ only })
    }
  }

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
    const { selected } = this.state
    if (movies.length < 1) {
      return <LoadingPage />
    }
    return (
      <div>
        <div className='display-by'>
          {/*<div className="display-all" onClick={ this.setDisplayAll }>*/ }
          {/*Library*/ }
          {/*</div>*/ }
          {/*<div className="display-unwatched" onClick={ this.setDisplayUnwatched }>*/ }
          {/*Unwatched*/ }
          {/*</div>*/ }
          <ToggleButton
            className="display-all"
            selected={ selected }
            onStateChanged={ this.toggleSelectedButton(snakeCase('Library')) }
            onClick={ this.setDisplayAll }
          >
            Library
          </ToggleButton>
          <ToggleButton
            className="display-unwatched"
            onStateChanged={ this.toggleSelectedButton(snakeCase('Unwatched')) }
            onClick={ this.setDisplayUnwatched }
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
  }),
)

export default composedUserPage(UserPage)