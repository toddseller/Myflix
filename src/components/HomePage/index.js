import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import HomePageList from '../HomePageList'
import TopUserList from '../TopUserList'
import { getHomePageData } from '../../actions/homePage'
import Tabs from '../Tabs'
import '../../styles/base.css'
import './index.css'

class HomePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTab: 'most_popular'
    }
  }

  toggleSelectedButton = tabId => {
    this.setState({ selectedTab: tabId })
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
            <Tabs activeTab={ this.state.selectedTab } style={ ['space-between'] }>
              <Tabs.Tab
                tabId='most_popular'
                onClick={ this.toggleSelectedButton }
              >
                Most Popular
              </Tabs.Tab>
              <Tabs.Tab
                tabId='recent_movies'
                onClick={ this.toggleSelectedButton }
              >
                Recent Movies
              </Tabs.Tab>
              <Tabs.Tab
                tabId='recent_tv_shows'
                onClick={ this.toggleSelectedButton }
              >
                Recent TV Shows
              </Tabs.Tab>
              <Tabs.Tab
                tabId='top_users'
                onClick={ this.toggleSelectedButton }
              >
                Top Users
              </Tabs.Tab>
            </Tabs>
          </div>
          { this.state.selectedTab === 'most_popular' && this.displayItems(topMovies, 'movie') }
          { this.state.selectedTab === 'recent_movies' && this.displayItems(recentMovies, 'movie') }
          { this.state.selectedTab === 'recent_tv_shows' && this.displayItems(recentShows, 'show') }
          { this.state.selectedTab === 'top_users' && <TopUserList users={ topUsers } /> }
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