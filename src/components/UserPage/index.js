import React, { Component } from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import { forceCheck } from 'react-lazyload'
import classnames from 'classnames'

import { startFetchMovies, startFetchMovie } from '../../actions/userMovie'
import { startFetchShows, startFetchShow } from '../../actions/userShow'
import { setTextFilter, setSelectedMedia } from '../../actions/filters'
import { getCounts } from '../../actions/counts'
import FilteredMoviesSelector from '../../selectors/filteredMovies'
import FilteredShowsSelector from '../../selectors/filteredShows'
import LoadingPage from '../LoadingPage'
import MoviePreview from '../MoviePreview'
import ShowPreview from '../ShowPreview'
import SearchBox from '../searchbox/SearchBox'
import NewMediaPreview from '../NewMediaPreview'
import Tabs from '../Tabs'

import './index.scss'
import LoadingSpinner from '../LoadingSpinner'

class UserPage extends Component {
  state = { isSearching: false, isLoading: true }

  toggleSelectedButton = tabId => {
    this.props.setSelectedMedia(tabId)
  }

  onClick = () => {
    this.setState(prevState => {
      return { isSearching: !prevState.isSearching }
    })
    this.props.getCounts()
  }

  fetchMovieData = id => {
    console.log(this.props.startFetchMovie(id))
  }

  fetchShowData = id => {
    console.log(this.props.startFetchShow(id))
  }

  toggleIsLoading = () => {
    this.setState(prevState => {
      return { isLoading: !prevState.isLoading }
    })
  }

  componentDidMount() {
    this.props.startFetchMovies()
    this.props.startFetchShows()
    this.props.getCounts()
    return <LoadingPage />
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    forceCheck()
  }

  render() {
    const { movies, newMovies, shows, moviesCount, showsCount, episodesCount, selectedMedia, newShows, newEpisodes } = this.props
    const { isSearching, isLoading } = this.state
    const previewClasses = classnames(
      'new-preview',
      `new-preview--${ isSearching ? 'active' : 'deactive' }`,
      `${ newMovies.length <= 7 && newShows.length <= 7 && newEpisodes.length <= 6 && isSearching ? 'centered' : '' }`
    )
    const movieClasses = classnames(
      'movies-list',
      `${ isSearching ? 'fixed' : '' }`
    )
    const showClasses = classnames(
      'shows-list',
      `${ isSearching ? 'fixed' : '' }`
    )
    if (shows.length < 1 && isLoading) {
      return <LoadingPage />
    }

    const displayList = () => {
      if (selectedMedia === 'movies') {
        return (
          <div className={ movieClasses }>
            {
              movies.map(movie => {
                return <MoviePreview key={ movie.id } id={ movie.id } onClick={ this.fetchMovieData } />
              })
            }
          </div>
        )
      } else {
        return (
          <div className={ showClasses }>
            {
              shows.map(show => {
                return <ShowPreview key={ show.id } id={ show.id } onClick={ this.fetchShowData } />
              })
            }
          </div>
        )
      }
    }

    const newMediaPreview = () => {
      if (selectedMedia === 'movies') {
        return newMovies.map((movie, index) => {
          return <NewMediaPreview key={ index } media={ movie } onClick={ this.onClick } mediaType={ 'movie' } />
        })
      } else if (selectedMedia === 'tvShows' && newEpisodes.length === 0) {
        return newShows.map((show, index) => {
          return <NewMediaPreview key={ index } media={ show } mediaType={ 'tvShow' } />
        })
      } else {
        return newEpisodes.map((episode, index) => {
          return <NewMediaPreview key={ index } media={ episode } onClick={ this.onClick } mediaType={ 'tvEpisode' } />
        })
      }
    }

    const mediaCount = () => {
      if (selectedMedia === 'movies') {
        return `${ moviesCount } ${ moviesCount !== 1 ? 'movies' : 'movie' }`
      } else {
        return `${ showsCount } ${ showsCount !== 1 ? 'shows' : 'show' } \u2014 ${ episodesCount } episodes`
      }
    }

    return (
      <div>
        <div className="search-bar">
          <SearchBox onClick={ this.onClick } isLoading={ this.toggleIsLoading } />
        </div>
        <div>
          <Tabs activeTab={ selectedMedia } style={ ['default'] }>
            <Tabs.Tab
              tabId='movies'
              onClick={ this.toggleSelectedButton }
            >
              Movies
            </Tabs.Tab>
            <Tabs.Tab
              tabId='tvShows'
              onClick={ this.toggleSelectedButton }
            >
              TV Shows
            </Tabs.Tab>
          </Tabs>
        </div>
        <div className={ previewClasses }>
          { newMovies.length === 0 && newShows.length === 0 && newEpisodes.length === 0 && isSearching &&
          <div className="searching-spinner">
            <h1>Searching our database&#8230;</h1>
            <LoadingSpinner />
          </div>
          }
          { newMediaPreview() }
          { newEpisodes.length > 1 &&
          <NewMediaPreview key={ 'allEpisodes' } media={ newEpisodes } onClick={ this.onClick }
                           mediaType={ 'tvEpisode' } episodeCount={ newEpisodes.length } />
          }
        </div>
        { displayList() }
        <div className="movie-count">{ mediaCount() }</div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    movies: FilteredMoviesSelector(state),
    newMovies: Object.values(state.newMovies),
    shows: FilteredShowsSelector(state),
    newShows: Object.values(state.newShows),
    moviesCount: state.counts.moviesCount,
    showsCount: state.counts.showsCount,
    episodesCount: state.counts.episodesCount,
    selectedMedia: state.filters.media,
    newEpisodes: Object.values(state.newEpisodes)
  }
}

const composedUserPage = compose(
  connect(mapStateToProps, {
    startFetchMovies,
    startFetchMovie,
    startFetchShows,
    startFetchShow,
    setTextFilter,
    setSelectedMedia,
    getCounts
  })
)

export default composedUserPage(UserPage)