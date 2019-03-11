import React, { Component } from 'react'
import { connect } from 'react-redux'

import { startAddMovie } from '../../actions/userMovie'
import { clearSearchNewMovies } from '../../actions/newMovie'

import './index.css'

class NewMoviePreview extends Component {
  onClick = () => {
    this.props.startAddMovie(this.props.movie)
    this.props.onClick()
    this.props.clearSearchNewMovies()
  }

  render() {
    const { movie } = this.props
    return (
      <div className="preview">
        <img onClick={ this.onClick } src={ movie.poster } alt={ `${ movie.title } poster` }
             height={ 261 } width={ 174 } />
        <p className="truncate">{ movie.title }</p>
        <p className="year">{ movie.year }</p>
      </div>
    )
  }
}

export default connect(null, { startAddMovie, clearSearchNewMovies })(NewMoviePreview)