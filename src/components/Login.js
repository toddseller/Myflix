import React, { Component } from 'react'
import { connect } from 'react-redux'

import { startLogin } from '../actions/auth'
import LoginForm from './forms/LoginForm'
import '../styles/login.css'

class Login extends Component {
  onSubmit = (formValues) => {
    this.props.startLogin(formValues)
  }

  render() {
    return (
      <div className={ 'login-container' }>
        <div className="login-card">
          <div className="login-card-background"></div>
        </div>
        <div className='login-form'>
          <LoginForm onSubmit={ this.onSubmit } />
        </div>
      </div>
    )
  }
}

export default connect(null, { startLogin })(Login)