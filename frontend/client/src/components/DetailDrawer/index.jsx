import React, { useEffect, useRef, useState } from 'react'

import { afterTransition } from '../../utils/motion'

import './index.scss'

export default function DetailDrawer({ open, onClosed, children }) {
  const el = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (open) {
      // A frame closed first, so adding .open runs the transition instead of appearing at once.
      const frame = requestAnimationFrame(() => setShown(true))
      return () => cancelAnimationFrame(frame)
    }
    setShown(false)
    return afterTransition(el.current, 'grid-template-rows', onClosed)
  }, [open])

  return (
    <div ref={ el } className={ shown ? 'info open' : 'info' }>
      <div className="info-wrapper">{ children }</div>
    </div>
  )
}
