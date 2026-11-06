import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { startLogout } from '../../actions/auth'

const UserNav = () => {
  const avatar = useSelector(state => state.auth.avatar)
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const nav = useRef()
  const menu = useRef()
  const button = useRef()
  const close = () => setOpen(false)
  const inside = node => nav.current.contains(node) || menu.current.contains(node)

  useEffect(() => {
    if (!open) return
    menu.current.querySelector('[role="menuitem"]').focus()
    const closeOutside = event => { if (!inside(event.target)) close() }
    document.addEventListener('pointerdown', closeOutside)
    // It was placed under the avatar when it opened, and a resize moves the avatar.
    window.addEventListener('resize', close)
    return () => {
      document.removeEventListener('pointerdown', closeOutside)
      window.removeEventListener('resize', close)
    }
  }, [open])

  const onKeyDown = event => {
    if (event.key !== 'Escape') return
    // React handles events at its root, before document, so this keeps UserPage from also dismissing search results.
    event.nativeEvent.stopPropagation()
    close()
    button.current.focus()
  }

  const place = () => {
    const avatar = button.current.getBoundingClientRect()
    return { top: avatar.bottom + 12, right: document.documentElement.clientWidth - avatar.right }
  }

  return (
    <div className="user-nav" ref={ nav } onKeyDown={ open ? onKeyDown : undefined }>
      <button ref={ button } className="avatar" aria-haspopup="menu" aria-expanded={ open } aria-label="Account menu"
              onClick={ () => setOpen(!open) }>
        <img src={ avatar } alt="" width={ 40 } />
      </button>
      { /* In body, because the collection's fixed tabs and search results stack above the whole header. */ }
      { open && createPortal(
        <ul className="account-menu" role="menu" ref={ menu } style={ place() }
            onBlur={ event => { if (event.relatedTarget && !inside(event.relatedTarget)) close() } }>
          <li role="none"><Link role="menuitem" to="/browse" onClick={ close }>My collection</Link></li>
          <li role="none"><Link role="menuitem" to="/settings" onClick={ close }>Settings</Link></li>
          <li role="none"><button role="menuitem" onClick={ () => dispatch(startLogout()) }>Sign out</button></li>
        </ul>,
        document.body
      ) }
    </div>
  )
}

export default UserNav
