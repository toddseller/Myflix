import React, { useLayoutEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'

import { decodeEntities } from '../../utils/decodeEntities'
import { easeHeight, reveal } from '../../utils/motion'
import { HdBadge, RatingBadge } from './badges'
import Poster from './Poster'
import ScrollRow from '../ScrollRow'

const plural = (count, word) => `${ count } ${ word }${ count === 1 ? '' : 's' }`

// The arrows' width, which is also the line's scroll-padding-inline in index.scss.
const ARROW = 34

// Placed before paint, so the line is never seen scrolling; once per show, so a season switch leaves it where it was.
const placeOnActive = line => {
  const active = line.querySelector('#active-season')
  const end = active.offsetLeft + active.offsetWidth + ARROW
  line.scrollLeft = Math.min(Math.max(0, end - line.clientWidth), line.scrollWidth - line.clientWidth)
}

const SeasonLine = ({ seasons, shown, onPick }) => (
  <ScrollRow name="season" label="seasons" place={ placeOnActive }>
    { seasons.map(({ id, season: number }) => (
      <button type="button" key={ id } className="season-submit" id={ id === shown ? 'active-season' : undefined }
              aria-pressed={ id === shown } onClick={ event => onPick(event, id) }>{ number }</button>
    )) }
  </ScrollRow>
)

const Episode = ({ episode }) => {
  const plot = useRef(null)
  const [whole, setWhole] = useState(false)
  const [cut, setCut] = useState(false)

  // Whether a plot is cut depends on the window's width, so it is measured rather than guessed from its length.
  // A whole plot isn't measured, so "less" stays to cut it short again.
  useLayoutEffect(() => {
    if (whole) return
    const measure = () => {
      const { scrollWidth, clientWidth, scrollHeight, clientHeight } = plot.current
      setCut(scrollWidth > clientWidth || scrollHeight > clientHeight)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [whole])

  return (
    <div className="episode-description">
      <p className="tv-episode"><span>EPISODE { episode.tv_episode }</span><span className="aired">{ episode.date }</span></p>
      <p className="episode-title">{ decodeEntities(episode.title) }</p>
      <p className="episode-runtime">{ episode.runtime }</p>
      <p ref={ plot } className={ whole ? 'plot-truncate active' : 'plot-truncate' }>{ decodeEntities(episode.plot) }</p>
      { (cut || whole) && <button type="button" className="expand-plot" onClick={ () => setWhole(!whole) }>{ whole ? 'less' : 'more' }</button> }
    </div>
  )
}

export default function ShowDetails({ show }) {
  const seasons = [...show.seasons].sort((a, b) => a.season - b.season)
  const [picked, setPicked] = useState(() => (seasons.find(season => season.is_active) ?? seasons[0]).id)
  const [previous, setPrevious] = useState(null)
  const season = seasons.find(({ id }) => id === picked)
  const shown = season.id
  const episodes = [...season.episodes].sort((a, b) => a.tv_episode - b.tv_episode)
  const episodeCount = seasons.reduce((sum, { episodes }) => sum + episodes.length, 0)
  const title = decodeEntities(show.title)

  const placeholder = previous ?? show.poster

  const pick = (event, id) => {
    const drawer = event.currentTarget.closest('.info')
    const height = easeHeight(event.currentTarget.closest('.info-wrapper'), () => flushSync(() => {
      setPrevious(season.poster)
      setPicked(id)
    }))
    if (drawer) reveal(drawer, { height })
  }

  return (
    <div id="meta-data" className="show-info">
      <div id="info-header">
        <div className="description-poster">
          <Poster src={ season.poster } placeholder={ placeholder } alt={ `${ title } Poster` } />
          <p id="counts">{ `${ plural(seasons.length, 'season') }, ${ plural(episodeCount, 'episode') }` }</p>
        </div>
        <div className="series-info">
          <h1>{ title }</h1>
          <p id="series-count">{ seasons.length > 1 ? plural(seasons.length, 'season') : `Season ${ season.season }` }</p>
          <div className="series-details">
            <span className="spacing">{ decodeEntities(show.genre) }</span>
            <span className="spacing">{ show.year }</span>
            <RatingBadge rating={ show.rating } />
            <HdBadge hd={ show.hd === 1080 ? 1080 : 0 } />
          </div>
          <div className="season-plot">{ decodeEntities(season.plot) }</div>
        </div>
        <div className="season-episodes">
          <div id="season-selector">
            <hr />
            SEASON:
            <SeasonLine seasons={ seasons } shown={ shown } onPick={ pick } />
            <hr />
          </div>
          <div className="episode-list" key={ shown }>
            { episodes.map((episode, index) => (
              <React.Fragment key={ episode.id }>
                { index > 0 && <hr /> }
                <Episode episode={ episode } />
              </React.Fragment>
            )) }
          </div>
        </div>
      </div>
    </div>
  )
}
