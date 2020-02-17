import React, { Component } from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import { forceCheck } from 'react-lazyload'
import _ from 'lodash'
import classnames from 'classnames'

import { startFetchMovies, startFetchMovie } from '../../actions/userMovie'
import { setTextFilter, setDisplayAll, setDisplayUnwatched } from '../../actions/filters'
import FilteredMoviesSelector from '../../selectors/filteredMovies'
import LoadingPage from '../LoadingPage'
import MoviePreview from '../MoviePreview'
import ToggleButton from '../ToggleButton'
import SearchBox from '../searchbox/SearchBox'
import NewMoviePreview from '../NewMoviePreview'

import './index.css'
import LoadingSpinner from '../LoadingSpinner'

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

class UserPage extends Component {
  state = { library: true, unwatched: false, isSearching: false, isLoading: true }

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

  onClick = () => {
    this.setState(prevState => {
      return { isSearching: !prevState.isSearching }
    })
  }

  fetchMovieData = id => {
    console.log(this.props.startFetchMovie(id))
  }

  toggleIsLoading = () => {
    this.setState(prevState => {
      return { isLoading: !prevState.isLoading }
    })
  }

  componentDidMount() {
    this.props.startFetchMovies()
    return <LoadingPage />
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    forceCheck()
  }

  render() {
    const { movies, newMovies } = this.props
    const { library, unwatched, isSearching, isLoading } = this.state
    const previewClasses = classnames(
      'new-preview',
      `new-preview--${ isSearching ? 'active' : 'deactive' }`,
      `${ newMovies.length <= 7 && isSearching ? 'centered' : '' }`
    )
    const movieClasses = classnames(
      'movies-list',
      `${ isSearching ? 'fixed' : '' }`
    )
    if (movies.length < 1 && isLoading) {
      return <LoadingPage />
    }
    return (
      <div>
        <div className="search-bar">
          <SearchBox onClick={ this.onClick } isLoading={ this.toggleIsLoading } />
        </div>
        <div className='display-by'>
          <ToggleButton
            className="display-all"
            selected={ library }
            value={ 'library' }
            style={ library ? borderStyles.selected : borderStyles.deselected }
            onClick={ this.toggleSelectedButton }
          >
            Library
          </ToggleButton>
          <ToggleButton
            className="display-unwatched"
            value={ 'unwatched' }
            style={ unwatched ? borderStyles.selected : borderStyles.deselected }
            onClick={ this.toggleSelectedButton }
          >
            Unwatched
          </ToggleButton>
        </div>
        <div className={ previewClasses }>
          { newMovies.length === 0 && isSearching &&
          <div className="searching-spinner">
            <h1>Searching our database&#8230;</h1>
            <LoadingSpinner />
          </div>
          }
          { newMovies.map((movie, index) => {
            return <NewMoviePreview key={ index } movie={ movie } onClick={ this.onClick } />
          }) }
        </div>
        <div className={ movieClasses }>
          {
            movies.map(movie => {
              return <MoviePreview key={ movie.id } id={ movie.id } onClick={ this.fetchMovieData } />
            })
          }
        </div>
        <div className="movie-count">{ `${ movies.length } ${ movies.length !== 1 ? 'movies' : 'movie' }` }</div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    movies: FilteredMoviesSelector(state),
    newMovies: Object.values(state.new)
  }
}

const composedUserPage = compose(
  connect(mapStateToProps, {
    startFetchMovies,
    startFetchMovie,
    setTextFilter,
    setDisplayAll,
    setDisplayUnwatched
  })
)

export default composedUserPage(UserPage)