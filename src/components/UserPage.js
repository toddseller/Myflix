import React, { Component } from 'react'
import { connect } from 'react-redux'

import { startFetchMovies } from '../actions/userMovie'
import sortByTitle from '../selectors/sortByTitle'
import LoadingPage from './LoadingPage'
import MoviePreview from './MoviePreview'
import '../styles/movie-preview.css'

class UserPage extends Component {
  componentDidMount() {
    this.props.startFetchMovies()
  }

  render() {
    const { movies } = this.props
    if (!movies) {
      return <LoadingPage/>
    }
    return (
      <div>
        <div className="movies-list">
          {
            sortByTitle(movies).map(movie => {
              return <MoviePreview key={movie.id} movie={movie}/>
            })
          }
        </div>
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