import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import HomePageList from './HomePageList'
import TopUserList from './TopUserList'
import { getHomePageData } from '../actions/homePage'
import '../styles/base.css'
import '../styles/homepage.css'

class HomePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      displayTopMovies: true,
      displayRecentMovies: false,
      displayRecentShows: false,
      displayTopUsers: false
    }
  }

  toggleDisplay = (element) => {
    this.props.getHomePageData()

    if (element === 'rm') {
      this.setState({
        displayTopMovies: false,
        displayRecentMovies: true,
        displayRecentShows: false,
        displayTopUsers: false
      })
    } else if (element === 'tm') {
      this.setState({
        displayTopMovies: true,
        displayRecentMovies: false,
        displayRecentShows: false,
        displayTopUsers: false
      })
    } else if (element === 'rs') {
      this.setState({
        displayTopMovies: false,
        displayRecentMovies: false,
        displayRecentShows: true,
        displayTopUsers: false
      })
    } else if (element === 'tu') {
      this.setState({
        displayTopMovies: false,
        displayRecentMovies: false,
        displayRecentShows: false,
        displayTopUsers: true
      })
    }
  }

  displayItems = (items, type) => {
    const className = `homepage-gallery-panel ${ type }`
    return (
      <div className="homepage-gallery">
        <div className={ className }>
          {
            items.map(item => {
              return <HomePageList key={ item.id } item={ item } type={ type } />
            })
          }
        </div>
      </div>
    )
  }

  render() {
    const { topMovies, recentMovies, recentShows, topUsers } = this.props
    return (
      <div className="homepage-container">
        <div className="hero-card">
          <div className="hero-card-background"></div>
          <div className="hero-card-text">
            <h1 className="hero-card-title">Your movies. Your shows. Your way.</h1>
            <h2 className="hero-card-subtitle">Your personal database for movies and TV shows</h2>
            <div className="cta-link-wrapper">
              <Link to={ '/signup' } className="btn btn-red btn-large">
                <span>CREATE YOUR FREE ACCOUNT TODAY</span>
                <span className="cta-chevron"><svg viewBox="0 0 6 12" xmlns="http://www.w3.org/2000/svg"><desc>chevron</desc><path
                  d="M.61 1.312l.78-.624L5.64 6l-4.25 5.312-.78-.624L4.36 6z" fill="#ffffff"
                  fillRule="evenodd"></path></svg></span>
              </Link>
            </div>
          </div>
        </div>
        <div className="homepage-cards">
          <div className="homepage-cards-nav">
            <div
              onClick={ () => this.toggleDisplay('tm') }
              className={ this.state.displayTopMovies ? 'homepage-cards-nav-element active' : 'homepage-cards-nav-element' }
            >
              Most Popular
            </div>
            <div
              onClick={ () => this.toggleDisplay('rm') }
              className={ this.state.displayRecentMovies ? 'homepage-cards-nav-element active' : 'homepage-cards-nav-element' }
            >
              Recent Movies
            </div>
            <div
              onClick={ () => this.toggleDisplay('rs') }
              className={ this.state.displayRecentShows ? 'homepage-cards-nav-element active' : 'homepage-cards-nav-element' }
            >
              Recent TV Shows
            </div>
            <div
              onClick={ () => this.toggleDisplay('tu') }
              className={ this.state.displayTopUsers ? 'homepage-cards-nav-element active' : 'homepage-cards-nav-element' }
            >
              Top Users
            </div>
          </div>
          { this.state.displayTopMovies && this.displayItems(topMovies, 'movie') }
          { this.state.displayRecentMovies && this.displayItems(recentMovies, 'movie') }
          { this.state.displayRecentShows && this.displayItems(recentShows, 'show') }
          { this.state.displayTopUsers && <TopUserList users={ topUsers } />}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  topMovies: state.home.topMovies,
  recentMovies: state.home.recentMovies,
  recentShows: state.home.recentShows,
  topUsers: state.home.topUsers
})

export default connect(mapStateToProps, { getHomePageData })(HomePage)