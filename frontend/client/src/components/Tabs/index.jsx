import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Tab from './Tab'
import './index.scss'

/**
 * Wrapper component for a set of tabs
 * @param {Object} props - Properties passed to component
 * @returns {ReactElement}
 */

const Tabs = ({
                activeTab,
                children,
                style,
              }) => {
  const tabStyleClasses = style ? style.map(styleName => {
    return `mf-tabs--${ styleName }`
  }) : ''

  const classes = classNames(
    tabStyleClasses
  )

  // Determine if the child is an active tab
  const childrenWithProps = React.Children.map(children, child => {
    if (child === null) {
      return null
    }
    return React.cloneElement(child, {
      isActive: activeTab === child.props.tabId,
    })
  })

  return (
    <div className={ classes }>
      <ul className="mf-tabs">{ childrenWithProps }</ul>
    </div>
  )
}

Tabs.propTypes = {
  // ID corresponding to which tab should be given the active class
  activeTab: PropTypes.string.isRequired,
  // Set of Tab components
  children: PropTypes.node.isRequired,
  // Various styles that can be given to the navigation
  style: PropTypes.arrayOf(PropTypes.oneOf([
    'default',
    'header',
    'left-pad',
    'plain',
    'small',
    'sub',
  ]))
}

Tabs.Tab = Tab

export default Tabs