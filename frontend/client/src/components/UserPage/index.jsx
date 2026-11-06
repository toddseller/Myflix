import React, { Component, createRef } from 'react'
import { flushSync } from 'react-dom'
import { connect } from 'react-redux'
import { compose } from 'redux'
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
import DetailDrawer from '../DetailDrawer'
import MovieDetails from '../DetailDrawer/MovieDetails'
import ShowDetails from '../DetailDrawer/ShowDetails'
import { rowEnd } from '../../utils/rowEnd'
import { easeHeight } from '../../utils/motion'

import './index.scss'
import LoadingSpinner from '../LoadingSpinner'

class UserPage extends Component {
  state = { isSearching: false, isLoading: true, list: null, drawer: null, closing: null }
  listRef = createRef()
  request = 0

  // A new filter, tab or title redraws the rows, so a drawer would sit under a row that no longer exists.
  static getDerivedStateFromProps({ selectedMedia, filterText, movies, shows }, { list }) {
    const next = `${ selectedMedia }:${ filterText }:${ movies.length }:${ shows.length }`
    return next === list ? null : { list: next, drawer: null, closing: null }
  }

  toggleSelectedButton = tabId => {
    this.props.setSelectedMedia(tabId)
  }

  onClick = () => {
    this.setState(prevState => {
      return { isSearching: !prevState.isSearching }
    })
    this.props.getCounts()
  }

  toggleDrawer = async id => {
    const request = ++this.request
    const { drawer, list } = this.state
    if (drawer?.id === id) return this.setState({ drawer: null, closing: drawer })

    const fetchDetails = this.props.selectedMedia === 'movies' ? this.props.startFetchMovie : this.props.startFetchShow
    try {
      await fetchDetails(id)
    } catch {
      return
    }
    if (request !== this.request || list !== this.state.list || !this.listRef.current) return

    const end = rowEnd(this.listRef.current.querySelector(`:scope > [id="${ id }"]`))
    const open = () => this.setState(({ drawer, closing }) => ({
      drawer: { id, rowEnd: end.id },
      closing: drawer && drawer.rowEnd !== end.id ? drawer : closing?.rowEnd === end.id ? null : closing
    }))
    const sameRow = this.state.drawer?.rowEnd === end.id
    easeHeight(sameRow && end.nextElementSibling.querySelector('.info-wrapper'), () => flushSync(open))
  }

  drawersAfter = (item, items) => {
    const { drawer, closing } = this.state
    return [drawer, closing].filter(d => d?.rowEnd === String(item.id)).map(d => {
      const record = items.find(({ id }) => id === d.id)
      return (
        <DetailDrawer key={ `drawer-${ d.rowEnd }` } open={ d === drawer }
                      onClosed={ () => this.setState(state => state.closing === d ? { closing: null } : null) }>
          { this.props.selectedMedia === 'movies' ? <MovieDetails movie={ record } /> : <ShowDetails key={ record.id } show={ record } /> }
        </DetailDrawer>
      )
    })
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


  render() {
    const { movies, newMovies, shows, moviesCount, showsCount, episodesCount, selectedMedia, newShows, newEpisodes } = this.props
    const { isSearching, isLoading } = this.state
    const previewClasses = classnames(
      'new-preview',
      `new-preview--${ isSearching ? 'active' : 'deactive' }`,
      `${ newMovies.length <= 7 && newShows.length <= 7 && newEpisodes.length <= 5 && isSearching ? 'centered' : '' }`
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
          <div className={ movieClasses } ref={ this.listRef }>
            {
              movies.flatMap(movie => [
                <MoviePreview key={ movie.id } id={ movie.id } open={ this.state.drawer?.id === movie.id } onClick={ this.toggleDrawer } />,
                ...this.drawersAfter(movie, movies)
              ])
            }
          </div>
        )
      } else {
        return (
          <div className={ showClasses } ref={ this.listRef }>
            {
              shows.flatMap(show => [
                <ShowPreview key={ show.id } id={ show.id } open={ this.state.drawer?.id === show.id } onClick={ this.toggleDrawer } />,
                ...this.drawersAfter(show, shows)
              ])
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
      <div className="user-page">
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
        <div className="movie-count">{ moviesCount && mediaCount() }</div>
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
    filterText: state.filters.text,
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