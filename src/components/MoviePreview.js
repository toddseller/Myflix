import React from 'react'
import { connect } from 'react-redux'
import LazyLoad from 'react-lazyload'

import '../styles/movie-preview.css'

const MoviePreview = ({ movie }) => {
  return (
    <div id={ movie.id } className="movie-preview">
      <LazyLoad height={ 261 } offset={ [261, 261] } resize={ true } once>
        <img src={ movie.poster } alt={ `${ movie.title } poster` } width={ 174 } height={ 261 } />
      </LazyLoad>
      <p className="truncate">{ movie.isNew && <span className="new"></span> }{ movie.title }</p>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => ({
  movie: state.movies[ownProps.id]
})


export default connect(mapStateToProps)(MoviePreview)