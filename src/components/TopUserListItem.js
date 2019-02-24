import React from 'react'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilm, faTv, faUserSecret } from '@fortawesome/free-solid-svg-icons'

library.add(faFilm, faTv, faUserSecret)

const TopUserListItem = ({ user }) => {
  const show = user.showCount > 1 ? 'TV Shows' : 'TV Show'
  return (
    <div className="top-user-card">
      <div className="top-user-avatar">
        { user.avatar !== '' ? <img src={user.avatar} /> :
          <FontAwesomeIcon icon='user-secret' style={{width: '90px', height:'90px', color: '#e50914', marginBottom: '10px'}}/> }
      </div>
      <div className="top-user-counts">
        <div className="top-user-counts-user">{ user.userName }</div>
        <div><FontAwesomeIcon icon="film" fixedWidth/>&nbsp;{ `${ user.movieCount } Movies` }</div>
        { user.showCount > 0 && <div><FontAwesomeIcon icon="tv" />&nbsp;{ `${ user.showCount } ${show}` }</div> }
      </div>
    </div>
  )
}

export default TopUserListItem