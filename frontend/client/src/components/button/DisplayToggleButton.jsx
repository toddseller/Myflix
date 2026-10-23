import React, { Component } from 'react'
import { connect } from 'react-redux'

class DisplayToggleButton extends Component {
  render() {
    const baseStyles = {
      root: {
        display: 'flex',
        justifyContent: 'center',
        position: 'relative',
        zIndex: '2',
      },
      selected: {
        borderBottom: '2px solid #e50914',
      },
      deselected: {
        borderBottom: 'none',
      },
      text: {
        color: '#ffffff',
        textTransform: 'uppercase',
        fontSize: '.9rem',
        margin: '0 .75rem',
        paddingBottom: '.25rem'
      }
    }

    const rootStyle = baseStyles.root
    let textStyle = display ? Object.assign({}, baseStyles.selected, baseStyles.text) : Object.assign({}, baseStyles.deselected, baseStyles.text)
    textStyle = Object.assign(textStyle, additionalStyles ? additionalStyles.line : {})

    return (
      <div style={ rootStyle }>
        <div style={ textStyle }>Library</div>
        <div style={ textStyle }>Unwatched</div>
      </div>
    )
  }
}

export default DisplayToggleButton