import React from 'react'
import { Link } from 'react-router-dom'

const HeaderButton = ({ route, text }) => {
  return (
    <Link to={ route } className="btn btn-red btn-right">{ text }</Link>
  )
}

export default HeaderButton