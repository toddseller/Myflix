const validate = values => {
  const errors = {}
  if (!values.username_email) {
    errors.username_email = 'Required'
  }
  if (!values.password) {
    errors.password = 'Required'
  }
  return errors
}

export default validate