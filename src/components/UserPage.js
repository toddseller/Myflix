import React, { Component } from 'react'
import { connect } from 'react-redux'

import { startFetchMovies } from '../actions/userMovie'
import sortByTitle from '../selectors/sortByTitle'
import LoadingPage from './LoadingPage'

class UserPage extends Component {
  componentDidMount() {
    this.props.startFetchMovies()
  }

  render() {
    if (!this.props.movies) {
      return <LoadingPage />
    }
    return (
      <div>
        <h1 style={{color: '#ffffff'}}>Movies</h1>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    movies: sortByTitle(Object.values(state.movies))
  }
}

export default connect(mapStateToProps, { startFetchMovies })(UserPage)