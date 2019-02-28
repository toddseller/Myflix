import React, { Component } from 'react'
import { connect } from 'react-redux'

import { startFetchMovies } from '../actions/userMovie'
import sortMovies from '../selectors/sortByTitle'
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
        {console.log(this.props.movies)}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    movies: sortMovies(Object.values(state.movies))
  }
}

export default connect(mapStateToProps, { startFetchMovies })(UserPage)