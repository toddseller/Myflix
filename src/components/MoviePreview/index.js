import React, { Component } from 'react'
import { connect } from 'react-redux'
import LazyLoad from 'react-lazyload'

import './index.scss'

class MoviePreview extends Component {
  _onClick = () => {
    this.props.onClick(this.props.movie.id)
  }
  render() {
    const {movie} = this.props
    return (
      <div id={ movie.id } className="movie-preview">
        <LazyLoad height={ 261 } offset={ [261, 261] } resize={ true } once>
          <img src={ movie.poster } alt={ `${ movie.title } poster` } width={ 174 } height={ 261 }
               onClick={ this._onClick } />
        </LazyLoad>
        <p className="truncate">{ movie.isnew && <span className="new"></span> }{ movie.title }</p>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  movie: state.movies[ownProps.id]
})


export default connect(mapStateToProps)(MoviePreview)