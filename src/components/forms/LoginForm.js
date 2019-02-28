import React from 'react'
import { Field, reduxForm } from 'redux-form'

import RenderField from './RenderField'
import validate from './validate'

const LoginForm = props => {
  const { handleSubmit, onSubmit } = props

  return (
    <form onSubmit={ handleSubmit(formValues => {
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
      <button type="submit">Login</button>
    </form>
  )
}

export default reduxForm({
  form: 'loginForm',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate
})(LoginForm)