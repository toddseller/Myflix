import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { startUpdateAvatar } from '../../actions/auth'
import './index.css'

const Settings = () => {
  const avatar = useSelector(state => state.auth.avatar)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const input = useRef()

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview) }, [preview])

  const choose = next => {
    setFile(next)
    setError('')
    setPreview(next && URL.createObjectURL(next))
  }

  const cancel = () => {
    choose(null)
    // Without this, choosing the same file again wouldn't fire a change.
    input.current.value = ''
  }

  const save = async () => {
    setSaving(true)
    try {
      await dispatch(startUpdateAvatar(file))
      navigate('/browse')
    } catch (e) {
      // A 422 is MMDb refusing the file, worth showing; its other messages are about its own storage.
      setError(e.response?.status === 422 ? e.response.data.error : 'Your avatar couldn\'t be saved. Try again.')
    }
    setSaving(false)
  }

  return (
    <div className="settings">
      <h1>Settings</h1>
      <img className="settings-avatar" src={ preview || avatar } alt="Your avatar" width={ 120 } height={ 120 } />
      <label htmlFor="avatar-file">Choose a new avatar</label>
      <input id="avatar-file" ref={ input } type="file" accept="image/jpeg,image/png"
             onChange={ event => choose(event.target.files[0] || null) } />
      <div className="settings-actions">
        <button className="btn btn-red" disabled={ !file || saving } onClick={ save }>Save</button>
        <button className="btn" disabled={ !file || saving } onClick={ cancel }>Cancel</button>
      </div>
      { error && <p className="settings-error" role="alert">{ error }</p> }
    </div>
  )
}

export default Settings
