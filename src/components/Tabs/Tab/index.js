import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

/**
 * Individual Tab component. ONly meant to be used with the
 * Tabs wrapper component.
 * @param {object} props - Properties passed to component
 * @returns {ReactElement}
 */

const Tab = props => {
  const classes = classNames({
    'mf-tabs__item': true,
    'mf-tabs--disabled': props.isDisabled,
    'is-active': props.isActive,
  })

  const onClick = (() => {
     props.onClick(props.tabId)
  })

  return (
    <li
      className={ classes }
      onClick={ onClick }
    >
      { props.children }
      <hr/>
    </li>
  )
}

Tab.propTypes = {
  // Text or element that appears within the component
  children: PropTypes.node,
  // Should the Tabs.Tab visually appear to be active
  isActive: PropTypes.bool,
  // Boolean for whether the tab should be given the disabled class
  isDisabled: PropTypes.bool,
  // Function to perform when the tab is clicked
  onClick: PropTypes.func.isRequired,
  // String to identify tab, used in conjuction with activeTab
  tabId: PropTypes.string.isRequired
}

Tab.displayName = 'Tabs.Tab'

export default Tab