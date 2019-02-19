import React from 'react'

import LoadingSpinner from './LoadingSpinner'
import '../styles/loading-page.css'

const LoadingPage = () => {
  return (
    <div className="loading-page">
      <LoadingSpinner />
    </div>
  )
}

export default LoadingPage