import React, { Component } from 'react'

const animationStyle = {
  transition: 'all 0.75s cubic-bezier(0.000, 0.795, 0.000, 1.000)'
}

const makeDisplayToggleButton = (Target) => {
  return class extends Component {
    constructor(props) {
      super(props)
      this.state = { display: 'all' }
    }

    onClick = () => {
      this.setState({ display: this.state.display === 'all' ? 'unwatched' : 'all' })
    }

    render() {
      return (
        <Target
          { ...this.props }
          display={ this.state.display }
          onClick={ this.onClick }
          additionalStyles={ { line: animationStyle } }
        />
      )
    }
  }
}

export default makeDisplayToggleButton