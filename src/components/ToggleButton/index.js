import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import isBoolean from 'lodash/isBoolean'
import isFunction from 'lodash/isFunction'

import './index.css'
import { isString } from '@material-ui/core/es/styles/transitions'

class ToggleButton extends Component {
  state = { selected: this.selectedFromProps() }

  isSelected = () => this.state.selected

  selectedFromProps() {
    let { selected } = this.props

    selected = isFunction(selected) ? selected() : selected

    return isBoolean(selected) && selected
  }

  toggleButton = e => {
    e.persist()
    e.preventDefault()

    const { onClick, onStateChanged, value } = this.props

    this.setState({ selected: !this.state.selected }, () => {
      const state = this.state
      const buttonEvent = Object.assign(e, { BUTTON_STATE: state, BUTTON_VALUE: value })

      isFunction(onClick) && onClick(buttonEvent)
      isFunction(onStateChanged) && onStateChanged(state)
    })
  }

  render() {
    // const borderStyles = {
    //   deselected: {
    //     borderTop: 'none #e50914',
    //     borderLeft: 'none #e50914',
    //     borderRight: 'none #e50914',
    //     borderBottom: 'solid 3px #e50914',
    //     bottom: '-5px',
    //     boxSizing: 'content-box',
    //     margin: '0 auto',
    //     position: 'relative',
    //     width: 'calc(100% - 1.5rem)',
    //     transform: 'scaleX(0)',
    //     transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
    //   },
    //   selected: {
    //     borderTop: 'none #e50914',
    //     borderLeft: 'none #e50914',
    //     borderRight: 'none #e50914',
    //     borderBottom: 'solid 3px #e50914',
    //     bottom: '-5px',
    //     boxSizing: 'content-box',
    //     margin: '0 auto',
    //     position: 'relative',
    //     width: 'calc(100% - 1.5rem)',
    //     transform: 'scaleX(1)',
    //     transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
    //   }
    // }
    const { selected } = this.state
    const { selected: _selected, theme, onClick, className, onStateChanged, style, ...restProps } = this.props
    const buttonTheme = (theme && isString(theme)) ? theme : 'default'
    const buttonClasses = classnames(
      `button button--${ buttonTheme }`,
      className
    )
    // let borderBottomStyles = selected ? borderStyles.selected : borderStyles.deselected
    // const borderClasses = classnames(
    //   `button--${ selected ? 'selected' : 'deselected' }`,
    // )

    return (
      <div>
        <div className={ buttonClasses } onClick={ this.toggleButton } { ...restProps }></div>
        <div>
          <hr style = {style} />
        </div>
      </div>
    )
  }
}

ToggleButton.propTypes = {
  theme: PropTypes.string,
  selected: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func
  ]),
  value: PropTypes.string,
  onStateChanged: PropTypes.func
}

export default ToggleButton
