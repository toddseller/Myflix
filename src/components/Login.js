import React from 'react'

import LoginForm from './forms/LoginForm'
import '../styles/login.css'

const Login = () => {
  return (
    <div className={"login-container"}>
      <div className="login-card">
        <div className="login-card-background"></div>
      </div>
      <div className='login-form'>
        <LoginForm/>
      </div>
    </div>
  )
}

export default Login