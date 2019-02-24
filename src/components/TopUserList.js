import React from 'react'

import TopUserListItem from './TopUserListItem'

const TopUserList = ({ users }) => {
  return (
    <div className="homepage-gallery">
      <div className="homepage-gallery-panel top-users">
        { users.map(user => {
          return <TopUserListItem user={ user } />
        }) }
      </div>
    </div>
  )
}

export default TopUserList