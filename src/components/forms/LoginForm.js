import React from 'react'
import { Field, reduxForm } from 'redux-form'

import RenderField from './RenderField'
import validate from './validate'

const LoginForm = props => {
  const { handleSubmit, onSubmit } = props

  return (
    <div className="login-form-main">
      <h1>Sign In</h1>
      <form className="login-form-fields" onSubmit={ handleSubmit(formValues => {
        onSubmit(formValues)
      }) }>
        <Field
          name="username_email"
          type="text"
          component={ RenderField }
          label="User Name or Email"
        />
        <Field
          name="password"
          type="password"
          component={ RenderField }
          label="Password"
        />
        <button className="btn btn-red btn-login" type="submit">Sign In</button>
      </form>
    </div>
  )
}

export default reduxForm({
  form: 'loginForm',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate
})(LoginForm)