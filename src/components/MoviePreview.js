import React from 'react'

import '../styles/movie-preview.css'

const MoviePreview = ({ movie }) => {
  return (
    <div className="movie-preview">
      <img src={ movie.poster } alt={ `${ movie.title } poster` } width={174} height={261}/>
      <p className="truncate">{ movie.title }</p>
    </div>
  )
}

export default MoviePreview