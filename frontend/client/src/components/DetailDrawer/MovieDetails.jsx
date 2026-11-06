import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'

import { decodeEntities } from '../../utils/decodeEntities'
import { HdBadge, RatingBadge } from './badges'
import Poster from './Poster'

// MMDb's split: a comma followed by " Jr." belongs to the name before it.
const names = text => decodeEntities(text).split(/(?<!,),(?!\sJr\.)/).map(name => name.trim()).filter(Boolean)

const Credits = ({ one, many, text }) => {
  const list = names(text)
  if (!list.length) return null
  return (
    <>
      <h5>{ list.length > 1 ? many : one }</h5>
      <ul>{ list.map(name => <li key={ name }>{ name }</li>) }</ul>
    </>
  )
}

const Stars = ({ ratings = [] }) => {
  const average = ratings.length ? Math.round(ratings.reduce((sum, { stars }) => sum + stars, 0) / ratings.length) : 0
  const count = ratings.length
  return (
    <div id="ratings-container">
      <div className="rated" role="img" aria-label={ `${ average } out of 5 stars` }>
        { [1, 2, 3, 4, 5].map(star => <FontAwesomeIcon key={ star } icon={ faStar } className={ star <= average ? 'checked' : undefined } />) }
      </div>
      <p>{ count ? `Based on ${ count } User Rating${ count > 1 ? 's' : '' }` : 'This Movie Has Not Been Rated' }</p>
    </div>
  )
}

export default function MovieDetails({ movie }) {
  const title = decodeEntities(movie.title)
  return (
    <div id="meta-data">
      <div id="info-body">
        <div className="description-poster">
          <Poster src={ movie.poster } placeholder={ movie.poster } alt={ `${ title } Poster` } />
        </div>
        <div className="description-details">
          <h2 className="modal-title">{ title }</h2>
          <div className="description-info">
            <span className="spacing">{ movie.runtime }</span>
            <span className="spacing">{ movie.year }</span>
            <span className="spacing">{ decodeEntities(movie.genre) }</span>
            <RatingBadge rating={ movie.rating } />
            <HdBadge hd={ movie.hd } />
            <Stars ratings={ movie.ratings } />
          </div>
          <p className="description-plot">{ decodeEntities(movie.plot) }</p>
          <h4>Cast and Crew</h4>
          <hr />
          <div className="credits">
            <div><Credits one="STARRING" many="STARRING" text={ movie.actors } /></div>
            <div>
              <Credits one="DIRECTOR" many="DIRECTORS" text={ movie.director } />
              <Credits one="SCREENWRITER" many="SCREENWRITERS" text={ movie.writer } />
            </div>
            <div><Credits one="PRODUCER" many="PRODUCERS" text={ movie.producer } /></div>
          </div>
          { movie.studio &&
            <div className="studio">
              <h5>STUDIO</h5>
              <hr />
              <p>{ decodeEntities(movie.studio) }</p>
            </div>
          }
        </div>
      </div>
    </div>
  )
}
