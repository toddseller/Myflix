import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import HomePageList from './HomePageList'
import Footer from './Footer'
import '../styles/base.css'
import '../styles/homepage.css'

class HomePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      displayTopMovies: true,
      displayRecentMovies: false,
      displayRecentShows: false
    }
  }

  toggleDisplay = (element) => {
    if (element === 'rm') {
      this.setState({
        displayTopMovies: false,
        displayRecentMovies: true,
        displayRecentShows: false
      })
    } else if (element === 'tm') {
      this.setState({
        displayTopMovies: true,
        displayRecentMovies: false,
        displayRecentShows: false
      })
    } else if (element === 'rs') {
      this.setState({
        displayTopMovies: false,
        displayRecentMovies: false,
        displayRecentShows: true
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
    const { topMovies, recentMovies, recentShows } = this.props
    return (
      <div className="homepage-container">
        <div className="homepage-header-wrapper">
          <div className="homepage-header">
            <span className="svg-mfLogo homepage-logo">
              <svg className="svg-icon svg-icon-myflix-logo" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg"
                   viewBox="0 0 443 148" style={ { fill: '#ed2517', width: '150px' } }>
                <title>logo_red</title>
                <path className="cls-1"
                      d="M50.22,98.85h.4Q58,51,65.5,4.5H96l-.26,127.59q-10.5,1-21,2.06l.18-93.27h-.4q-7.55,46.88-15.09,95-10.2,1.2-20.38,2.54-7.83-46.16-15.7-93.77H23l-.07,96Q13.4,142,4,143.5V4.5H34.43Q42.34,52.41,50.22,98.85Z" />
                <path className="cls-1"
                      d="M131.81,87.94c-9.22-27.41-18.44-55.16-27.64-83.44h23.15q8.14,28.35,16.3,56.24H144q8.25-28.32,16.48-56.23h21.28c-9.29,27.3-18.61,54.77-27.93,82.61q0,20.47-.06,40.94-11,.53-22,1.25Z" />
                <path className="cls-1"
                      d="M212,58.89h28V76.45q-14-.11-28-.06v50q-11,.07-22.07.32,0-61.13.09-122.27h58V22q-18-.05-36,0Q212,40.47,212,58.89Z" />
                <path className="cls-1"
                      d="M258,4.5h22L280.14,110q18,.66,36.06,1.72,0,9,0,18-29-2-58.13-2.77Q258,65.71,258,4.5Z" />
                <path className="cls-1" d="M326,4.5h22l.26,127.76q-11-1-22-1.85Z" />
                <path className="cls-1"
                      d="M436.45,4.5Q425,38.2,413.68,70.26,425.9,105.89,438,143.5q-11.44-1.81-22.91-3.43Q406.31,112,397.45,85h-.4q-8.88,25.65-17.76,50.52-10.21-1.17-20.42-2.19,12.14-31.9,24.28-64.94-11.46-32.58-23-63.85h22.7q8.15,24.11,16.27,49h.39q8.26-24.09,16.55-49Z" />
              </svg>
            </span>
            <Link to={ '/login' } className="btn btn-red btn-right">Sign In</Link>
          </div>
        </div>
        <div className="hero-card">
          <div className="hero-card-background"></div>
        </div>
        <div className="homepage-cards">
          <div className="homepage-cards-nav">
            <div
              onClick={ () => this.toggleDisplay('rm') }
              className={ this.state.displayRecentMovies ? 'homepage-cards-nav-element active' : 'homepage-cards-nav-element' }
            >
              Recent Movies
            </div>
            <div
              onClick={ () => this.toggleDisplay('tm') }
              className={ this.state.displayTopMovies ? 'homepage-cards-nav-element active' : 'homepage-cards-nav-element' }
            >
              Most Popular
            </div>
            <div
              onClick={ () => this.toggleDisplay('rs') }
              className={ this.state.displayRecentShows ? 'homepage-cards-nav-element active' : 'homepage-cards-nav-element' }
            >
              Recent TV Shows
            </div>
          </div>
          { this.state.displayRecentMovies && this.displayItems(recentMovies, 'movie') }
          { this.state.displayTopMovies && this.displayItems(topMovies, 'movie') }
          { this.state.displayRecentShows && this.displayItems(recentShows, 'show') }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  topMovies: state.home.topMovies,
  recentMovies: state.home.recentMovies,
  recentShows: state.home.recentShows
})

export default connect(mapStateToProps)(HomePage)