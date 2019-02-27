const validate = values => {
  const errors = {}
  if (!values.userNameEmail) {
    errors.userNameEmail = 'Required'
  }
  if (!values.password) {
    errors.password = 'Required'
  }
  return errors
}

export default validate