import React from 'react'

const HomePageList = (props) => {
  const { item, type } = props

  const className = type === 'movie' ? 'movie' : 'show'
  return (
    <img className={className} src={ `${ item.poster }` } alt={ `${ item.title }` } />
  )
}

export default HomePageList