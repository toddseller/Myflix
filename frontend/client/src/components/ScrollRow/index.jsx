import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

import { reduced } from '../../utils/motion'

import './index.scss'

// A row that scrolls sideways, with MMDb's arrows: each shows only while there is more to see that way.
// place(line) runs before the arrows are first measured, so a caller can open the row scrolled without it being seen.
export default function ScrollRow({ name, label, place, children }) {
  const line = useRef(null)
  const [arrows, setArrows] = useState({ left: false, right: false })
  const update = () => {
    const { scrollLeft, clientWidth, scrollWidth } = line.current
    const next = { left: scrollLeft > 0, right: scrollLeft + clientWidth < scrollWidth - 1 }
    // Measured after every render, so only a real change may set state.
    setArrows(shown => shown.left === next.left && shown.right === next.right ? shown : next)
  }

  useLayoutEffect(() => { place?.(line.current) }, [])
  // Content can arrive or change after the row appears, as search results and a season's episodes do.
  useLayoutEffect(update)

  useEffect(() => {
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const page = direction => line.current.scrollBy({ left: direction * line.current.clientWidth, behavior: reduced() ? 'auto' : 'smooth' })

  return (
    <div className={ `scroll-row ${ name }-row` }>
      <div className={ `scroll-line ${ name }-line` } ref={ line } onScroll={ update }>{ children }</div>
      <button type="button" className={ `scroll-arrow ${ name }-arrow left` } aria-label={ `Earlier ${ label }` } hidden={ !arrows.left } onClick={ () => page(-1) }>
        <FontAwesomeIcon icon={ faChevronLeft } />
      </button>
      <button type="button" className={ `scroll-arrow ${ name }-arrow right` } aria-label={ `Later ${ label }` } hidden={ !arrows.right } onClick={ () => page(1) }>
        <FontAwesomeIcon icon={ faChevronRight } />
      </button>
    </div>
  )
}
