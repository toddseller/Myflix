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
    const { selected } = this.state
    const { selected: _selected, theme, onClick, className, onStateChanged, style, ...restProps } = this.props
    const buttonTheme = (theme && isString(theme)) ? theme : 'default'
    const buttonClasses = classnames(
      `button button--${ buttonTheme }`,
      className
    )

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
