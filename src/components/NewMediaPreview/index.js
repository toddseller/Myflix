import React, { Component } from 'react'
import { connect } from 'react-redux'
import AddIcon from '@material-ui/icons/Add'

import { startAddMovie } from '../../actions/userMovie'
import { clearSearchNewMovies } from '../../actions/newMovie'
import { startAddShow, startAddEpisodes } from '../../actions/userShow'
import { clearSearchNewShows } from '../../actions/newShow'
import { startFetchSearchNewEpisodes, clearSearchNewEpisodes } from '../../actions/newEpisode'

import './index.scss'

class NewMediaPreview extends Component {
  onClick = () => {
    if (this.props.mediaType === 'movie') {
      this.props.startAddMovie(this.props.media)
    } else if (this.props.mediaType === 'tvShow') {
      // this.props.startAddShow(this.props.media)
      this.props.startFetchSearchNewEpisodes(this.props.media)
    } else {
      this.props.startAddEpisodes(this.props.media)
    }

    if (this.props.mediaType === 'movie') {
      this.props.clearSearchNewMovies()
      this.props.onClick(this.props.mediaType)
    } else if (this.props.mediaType === 'tvShow') {
      this.props.clearSearchNewShows()
    } else {
      this.props.clearSearchNewEpisodes()
      this.props.onClick(this.props.mediaType)
    }

  }

  render() {
    console.log('**** ', this.props.media)
    const { media, mediaType } = this.props
    const imgHeight = mediaType === 'movie' ? '261' : mediaType === 'tvShow' ? '200' : '169'
    const imgWidth = mediaType === 'movie' ? '174' : mediaType === 'tvShow' ? '200' : '300'
    const mediaPreview = mediaType === 'movie' ? 'movie-preview' : mediaType === 'tvShow' ? 'show-preview' : 'episode-preview'
    const imgSrc = mediaType === 'tvEpisode' ? media.preview : media.poster

    const previewComponent = () => {
      if (this.props.episodeCount) {
        return (
          <div className="episode-preview all-episodes" onClick={ this.onClick }>
            <div><AddIcon style={ { fontSize: '5rem' } } /></div>
            <p>Add All Episodes</p>
          </div>
        )
      } else {
        return (
          <div className={ mediaPreview }>
            <img onClick={ this.onClick } src={ imgSrc } alt={ `${ media.title } poster` }
                 height={ imgHeight } width={ imgWidth } />
            <p className="truncate">{ media.title }</p>
            <p
              className="year">{ mediaType === 'movie' ? media.year : mediaType === 'tvShow' ? `Season ${ media.season }` : `Episode ${ media.tv_episode }` }</p>
          </div>
        )
      }
    }
    return previewComponent()
  }
}

const mapStateToProps = (state) => {
  return {
    selectedMedia: state.filters.media
  }
}

export default connect(mapStateToProps, {
  startAddMovie,
  clearSearchNewMovies,
  startAddShow,
  clearSearchNewShows,
  startFetchSearchNewEpisodes,
  startAddEpisodes,
  clearSearchNewEpisodes,
})(NewMediaPreview)