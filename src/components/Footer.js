import React from 'react'
import { connect } from 'react-redux'

import '../styles/footer.css'

const Footer = ({year}) => {
  return (
    <div className="footer">&copy; {year} Myflix</div>
  )
}

const mapStateToProps = (state) => ({
  year: state.home.year
})

export default connect(mapStateToProps)(Footer)