import React from 'react'
import LazyLoad from 'react-lazyload'

import '../styles/movie-preview.css'

const MoviePreview = ({ movie }) => {
  return (
    <div id={movie.id} className="movie-preview">
      <LazyLoad height={261} offset={303}>
        <img src={ movie.poster } alt={ `${ movie.title } poster` } width={174} height={261}/>
      </LazyLoad>
      <p className="truncate">{ movie.title }</p>
    </div>
  )
}

export default MoviePreview