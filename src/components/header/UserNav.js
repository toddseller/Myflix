import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

// import { setTextFilter } from '../../actions/filters'
import SearchBox from '../searchbox/SearchBox'


class UserNav extends Component {

  render() {
    const { user } = this.props

    return (
      <div className="user-nav">
        <div className="search-bar">
          <SearchBox />
        </div>
        <div className="avatar">
          <Link to={ `/browse/${ user.userId }` }>
            <img src={ user.avatar } alt={ `${ user.userName } avatar` } width={ 40 } />
          </Link>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.auth
})

export default connect(mapStateToProps)(UserNav)