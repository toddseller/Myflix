import React, { useState } from 'react'

// An image already on screen fills the box until the poster loads. A poster with no src never loads, so it gets none:
// the placeholder would stay as if it were this one's.
export default function Poster({ src, placeholder, alt }) {
  const [loaded, setLoaded] = useState(null)
  // A quoted CSS string, so a stored URL can't end the value early.
  const style = src && placeholder && loaded !== src ? { backgroundImage: `url(${ JSON.stringify(placeholder) })` } : undefined
  return <img src={ src } alt={ alt } style={ style } onLoad={ () => setLoaded(src) } />
}
