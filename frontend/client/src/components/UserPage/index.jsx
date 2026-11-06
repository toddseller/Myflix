import React, { Component, createRef } from 'react'
import { flushSync } from 'react-dom'
import { connect } from 'react-redux'
import { compose } from 'redux'
import classnames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

import { startFetchMovies, startFetchMovie } from '../../actions/userMovie'
import { startFetchShows, startFetchShow } from '../../actions/userShow'
import { setTextFilter, setSelectedMedia } from '../../actions/filters'
import { getCounts } from '../../actions/counts'
import { clearSearchNewMovies } from '../../actions/newMovie'
import { clearSearchNewShows } from '../../actions/newShow'
import { clearSearchNewEpisodes } from '../../actions/newEpisode'
import FilteredMoviesSelector from '../../selectors/filteredMovies'
import FilteredShowsSelector from '../../selectors/filteredShows'
import LoadingPage from '../LoadingPage'
import MoviePreview from '../MoviePreview'
import ShowPreview from '../ShowPreview'
import SearchBox from '../searchbox/SearchBox'
import NewMediaPreview from '../NewMediaPreview'
import Tabs from '../Tabs'
import ScrollRow from '../ScrollRow'
import DetailDrawer from '../DetailDrawer'
import MovieDetails from '../DetailDrawer/MovieDetails'
import ShowDetails from '../DetailDrawer/ShowDetails'
import { rowEnd } from '../../utils/rowEnd'
import { rankShowResults } from '../../utils/rankShowResults'
import { easeHeight, holdStill, reveal } from '../../utils/motion'

import './index.scss'
import LoadingSpinner from '../LoadingSpinner'

// The least common multiple of every column count the grid can have (1 to 7), so each block but the last ends on a
// full row at any width, and a drawer's row is always inside one block.
const BLOCK = 420

// Tile and gap sizes from MoviePreview/index.scss and ShowPreview/index.scss, and the list's max width, for estimating
// a skipped block's height; a wrong estimate would make the scrollbar jump as blocks come into view.
const TILES = { movies: { width: 174, height: 303 }, shows: { width: 200, height: 260 } }
const COLUMN_GAP = 32
const ROW_GAP = 8
const MAX_WIDTH = 1560

// From the page's width without its scrollbar, which the grid doesn't get.
const countColumns = () => {
  const width = Math.min(MAX_WIDTH, document.documentElement.clientWidth)
  const fit = tile => Math.max(1, Math.floor((width + COLUMN_GAP) / (tile.width + COLUMN_GAP)))
  return { movies: fit(TILES.movies), shows: fit(TILES.shows) }
}

// Blocks let the browser skip whole stretches of the grid far from the screen.
const inBlocks = (items, render, tile, columns) => {
  const blocks = []
  for (let start = 0; start < items.length; start += BLOCK) {
    const last = start > 0 && start + BLOCK >= items.length
    const rows = Math.ceil(Math.min(BLOCK, items.length - start) / columns)
    blocks.push(
      <div key={ start } className={ last ? 'grid-block grid-block--last' : 'grid-block' }
           style={ {
             '--block-height': `${ rows * tile.height + (rows - 1) * ROW_GAP }px`,
             // A drawer spans every column the block makes room for, which would pull a short row's posters left.
             ...items.length < columns && { '--row-width': `${ items.length * tile.width + (items.length - 1) * COLUMN_GAP }px` }
           } }>
        { items.slice(start, start + BLOCK).flatMap(render) }
      </div>
    )
  }
  return blocks
}

class UserPage extends Component {
  state = { isSearching: false, isLoading: true, list: null, drawer: null, closing: null, columns: countColumns() }
  listRef = createRef()
  request = 0
  // Keys drawers, so one keeps its element when it moves to another row and only a new one plays its opening.
  serial = 0

  // A new filter, tab or title redraws the rows, so a drawer would sit under a row that no longer exists.
  static getDerivedStateFromProps({ selectedMedia, filterText, movies, shows }, { list }) {
    const next = `${ selectedMedia }:${ filterText }:${ movies.length }:${ shows.length }`
    return next === list ? null : { list: next, drawer: null, closing: null }
  }

  toggleSelectedButton = tabId => {
    this.props.setSelectedMedia(tabId)
  }

  openSearch = () => {
    this.setState({ isSearching: true })
    this.props.getCounts()
  }

  // Unpins the grid, so the page can scroll to a drawer again. The search text stays: it is also the grid's filter.
  closeSearch = () => {
    this.setState({ isSearching: false })
    if (this.props.selectedMedia === 'movies') return this.props.clearSearchNewMovies()
    this.props.clearSearchNewShows()
    this.props.clearSearchNewEpisodes()
  }

  // The button goes with the panel, so focus moves to the search box, which stays open with its text.
  dismissResults = () => {
    this.closeSearch()
    document.querySelector('input[name="search"]')?.focus()
  }

  dismissOnEscape = event => {
    if (event.key === 'Escape' && this.state.isSearching) this.closeSearch()
  }

  // Closing the search box or adding a title also refreshes the counts, which an add changes.
  endSearch = () => {
    this.closeSearch()
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

    const tile = this.listRef.current.querySelector(`:scope > .grid-block > [id="${ id }"]`)
    const end = rowEnd(tile)
    const n = ++this.serial
    const open = () => this.setState(({ drawer, closing }) => drawer?.rowEnd === end.id
      ? { drawer: { ...drawer, id } }
      : { drawer: { id, rowEnd: end.id, n }, closing: drawer ?? closing })
    const before = this.state.drawer
    const sameRow = before?.rowEnd === end.id
    const top = tile.getBoundingClientRect().top
    const height = easeHeight(sameRow && end.nextElementSibling.querySelector('.info-wrapper'), () => flushSync(open))
    const opened = end.nextElementSibling
    if (sameRow) reveal(opened, { height })
    // Gliding during the hold would fight it, so the new drawer is brought into view once the old one has closed.
    else if (before) holdStill(tile, top, () => reveal(opened, { up: true }))
    else reveal(opened, { up: true })
  }

  drawersAfter = (item, items) => {
    const { drawer, closing } = this.state
    return [drawer, closing].filter(d => d?.rowEnd === String(item.id)).map(d => {
      const record = items.find(({ id }) => id === d.id)
      return (
        <DetailDrawer key={ `drawer-${ d.n }` } open={ d === drawer }
                      onClosed={ () => this.setState(state => state.closing === d ? { closing: null } : null) }>
          { this.props.selectedMedia === 'movies' ? <MovieDetails movie={ record } /> : <ShowDetails key={ record.id } show={ record } /> }
        </DetailDrawer>
      )
    })
  }

  componentDidMount() {
    // Settled rather than resolved, so a failed list still ends loading instead of spinning forever.
    Promise.allSettled([this.props.startFetchMovies(), this.props.startFetchShows()]).then(() => this.setState({ isLoading: false }))
    this.props.getCounts()
    window.addEventListener('resize', this.followWidth)
    document.addEventListener('keydown', this.dismissOnEscape)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.followWidth)
    document.removeEventListener('keydown', this.dismissOnEscape)
  }

  // Turning a phone changes how many posters fit a row. A phone browser's address bar also resizes the window as it
  // grows and shrinks, but only its height, so only a new width moves the drawer.
  width = window.innerWidth
  followWidth = () => {
    if (window.innerWidth === this.width) return
    this.width = window.innerWidth
    // Re-rendering thousands of tiles on every step of a window drag would stutter, and only a new column count
    // changes the blocks' estimated heights.
    const columns = countColumns()
    const { movies, shows } = this.state.columns
    if (columns.movies !== movies || columns.shows !== shows) this.setState({ columns })
    const { drawer } = this.state
    const list = this.listRef.current
    if (!drawer || !list) return
    // A drawer's own grid row would end the poster's row early, so the row is measured without them.
    const drawers = list.querySelectorAll(':scope > .grid-block > .info')
    drawers.forEach(el => { el.style.display = 'none' })
    const end = rowEnd(list.querySelector(`:scope > .grid-block > [id="${ drawer.id }"]`))
    drawers.forEach(el => { el.style.display = '' })
    this.setState({ drawer: { ...drawer, rowEnd: end.id }, closing: null })
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
    if (isLoading) {
      return <LoadingPage />
    }

    const displayList = () => {
      if (selectedMedia === 'movies') {
        return (
          <div className={ movieClasses } ref={ this.listRef }>
            {
              inBlocks(movies, movie => [
                <MoviePreview key={ movie.id } id={ movie.id } open={ this.state.drawer?.id === movie.id } onClick={ this.toggleDrawer } />,
                ...this.drawersAfter(movie, movies)
              ], TILES.movies, this.state.columns.movies)
            }
          </div>
        )
      } else {
        return (
          <div className={ showClasses } ref={ this.listRef }>
            {
              inBlocks(shows, show => [
                <ShowPreview key={ show.id } id={ show.id } open={ this.state.drawer?.id === show.id } onClick={ this.toggleDrawer } />,
                ...this.drawersAfter(show, shows)
              ], TILES.shows, this.state.columns.shows)
            }
          </div>
        )
      }
    }

    const newMediaPreview = () => {
      if (selectedMedia === 'movies') {
        return newMovies.map((movie, index) => {
          return <NewMediaPreview key={ index } media={ movie } onClick={ this.endSearch } mediaType={ 'movie' } />
        })
      } else if (selectedMedia === 'tvShows' && newEpisodes.length === 0) {
        return newShows.map((show, index) => {
          return <NewMediaPreview key={ index } media={ show } mediaType={ 'tvShow' } />
        })
      } else {
        return newEpisodes.map((episode, index) => {
          return <NewMediaPreview key={ index } media={ episode } onClick={ this.endSearch } mediaType={ 'tvEpisode' } />
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
          <SearchBox onSearch={ this.openSearch } onClose={ this.endSearch } />
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
          { isSearching &&
            <button type="button" className="dismiss-results" aria-label="Dismiss search results" onClick={ this.dismissResults }>
              <FontAwesomeIcon icon={ faXmark } />
            </button>
          }
          { newMovies.length === 0 && newShows.length === 0 && newEpisodes.length === 0 && isSearching
            ? <div className="searching-spinner">
                <h1>Searching our database&#8230;</h1>
                <LoadingSpinner />
              </div>
            // Not both: the row fills the panel, which would push the spinner off its centre.
            : <ScrollRow name="results" label="results">
                { newMediaPreview() }
                { newEpisodes.length > 1 &&
                <NewMediaPreview key={ 'allEpisodes' } media={ newEpisodes } onClick={ this.endSearch }
                                 mediaType={ 'tvEpisode' } episodeCount={ newEpisodes.length } />
                }
              </ScrollRow>
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
    newShows: rankShowResults(Object.values(state.newShows), state.shows, state.filters.text),
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
    getCounts,
    clearSearchNewMovies,
    clearSearchNewShows,
    clearSearchNewEpisodes
  })
)

export default composedUserPage(UserPage)