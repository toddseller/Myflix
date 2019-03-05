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
        this.setState({[key]: true})
      }
    })

    if (display === 'unwatched') {
      this.setDisplayUnwatched()
    } else {
      this.setDisplayAll()
    }
  }

  componentDidMount() {
    this.props.startFetchMovies()
    return <LoadingPage/>
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    forceCheck()
    console.log(this.state)
  }

  setDisplayAll = () => {
    this.props.setDisplayAll()
  }

  setDisplayUnwatched = () => {
    this.props.setDisplayUnwatched()
  }

  render() {
    const { movies } = this.props
    const { library, unwatched } = this.state
    if (movies.length < 1) {
      return <LoadingPage/>
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
            selected={ library }
            value={ 'library' }
            onClick={ this.toggleSelectedButton }
          >
            Library
          </ToggleButton>
          <ToggleButton
            className="display-unwatched"
            selected={ unwatched }
            value={ 'unwatched' }
            onClick={ this.toggleSelectedButton }
          >
            Unwatched
          </ToggleButton>
        </div>
        <div className="movies-list">
          {
            movies.map(movie => {
              return <MoviePreview key={ movie.id } id={ movie.id }/>
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