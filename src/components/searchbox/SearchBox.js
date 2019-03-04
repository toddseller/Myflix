import React from 'react'
import { connect } from 'react-redux'
import {TextField, IconButton} from 'material-ui'
import SearchIcon from 'material-ui/svg-icons/action/search'

import { setTextFilter } from '../../actions/filters'

const SearchBox = ({ isOpen, onClick, additionalStyles, setTextFilter, filters, classes }) => {
  const _onClick = () => {
    onClick();
    setTextFilter('');
  }
  const baseStyles = {
    open: {
      width: 300,
      frame: {
        background: 'transparent',
      },
    },
    closed: {
      width: 0,
      frame: {
        background: 'transparent',
      },
    },
    smallIcon: {
      width: 30,
      height: 30,
      color: '#ffffff'
    },
    icon: {
      width: 40,
      height: 40,
      padding: 5,
      top: 10,
      color: '#ffffff'
    },
  }

  const inputStyle = {
    color: '#ffffff',
    fontFamily: 'Helvetica Nueue, Helvetica, sans-serif',
    fontWeight: 300,
    border: 'none'
  }

  let textStyle = isOpen ? Object.assign({}, baseStyles.open, baseStyles.open.frame) : Object.assign({}, baseStyles.closed, baseStyles.closed.frame)
  textStyle = Object.assign(textStyle, additionalStyles ? additionalStyles.text : {})
  const divStyle = isOpen ? Object.assign({}, textStyle, baseStyles.open.frame, additionalStyles ? additionalStyles.frame : {}) : Object.assign({}, textStyle, baseStyles.closed.frame, additionalStyles ? additionalStyles.frame : {})
  divStyle.width += baseStyles.icon.width + 5
  return (
    <div style={ divStyle }>
      <IconButton
        iconStyle={ baseStyles.smallIcon }
        style={ baseStyles.icon }
        onClick={ _onClick }
      >
        <SearchIcon />
      </IconButton>
      <TextField
        name='search'
        value={ filters.text }
        onChange={ e => setTextFilter(e.target.value) }
        style={ textStyle }
        autoComplete='off'
        inputStyle={ inputStyle }
      />
    </div>
  )
}

const mapStateToProps = state => ({
  filters: state.filters
})

export default  connect(mapStateToProps, { setTextFilter })(SearchBox)