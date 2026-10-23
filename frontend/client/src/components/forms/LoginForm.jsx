import React, { useState } from 'react'

import RenderField from './RenderField'
import validate from './validate'

const FIELDS = [
  { name: 'username_email', type: 'text', label: 'User Name or Email' },
  { name: 'password', type: 'password', label: 'Password' },
  { name: 'remember', type: 'checkbox', label: 'Remember me' }
]

const LoginForm = ({ onSubmit }) => {
  const [values, setValues] = useState({})
  const [touched, setTouched] = useState({})
  const errors = validate(values)

  const handleSubmit = e => {
    e.preventDefault()
    setTouched(Object.fromEntries(FIELDS.map(f => [f.name, true])))
    if (FIELDS.every(f => !errors[f.name])) {
      onSubmit(values)
    }
  }

  const field = ({ name, type, label }) => {
    const input = {
      name,
      type,
      onChange: e => setValues({ ...values, [name]: type === 'checkbox' ? e.target.checked : e.target.value }),
      onBlur: () => setTouched({ ...touched, [name]: true }),
      ...(type === 'checkbox' ? { checked: !!values[name] } : { value: values[name] || '' })
    }
    return <RenderField input={ input } label={ label } type={ type } meta={ { touched: touched[name], error: errors[name] } } />
  }

  const [user, password, remember] = FIELDS

  return (
    <div className="login-form-main">
      <h1>Sign In</h1>
      <form className="login-form-fields" onSubmit={ handleSubmit }>
        { field(user) }
        { field(password) }
        <button className="btn btn-red btn-login" type="submit">Sign In</button>
        { field(remember) }
      </form>
    </div>
  )
}

export default LoginForm
