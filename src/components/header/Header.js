import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { history } from '../../routers/AppRouter'
import HeaderButton from './HeaderButton'
import UserNav from './UserNav'

import '../../styles/header.css'

class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pathName: ''
    }
    history.listen((location) => {
      this.setState({ pathName: location.pathname.substr(1) })
    })
  }

  render() {
    return (
      <div className="header-wrapper">
        <div className="header">
          <Link to={ '/' }>
              <span className="svg-mfLogo header-logo">
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
          </Link>
          { !this.props.isSignedIn && this.state.pathName !== 'login' && <HeaderButton route={ '/login' } text={ 'Sign In' } /> }
          { this.props.isSignedIn && <UserNav /> }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  isSignedIn: state.auth.isSignedIn
})

export default connect(mapStateToProps)(Header)