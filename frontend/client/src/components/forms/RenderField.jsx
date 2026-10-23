import React from 'react'

const RenderField = ({ input, label, type, meta: { touched, error } }) => (
  <div className="form-main">
    <div className="form-input">
      <input { ...input } id={ input.name } placeholder={ label } type={ type } />
      { type === 'checkbox' && <label htmlFor={ input.name }>{ label }</label> }
      { touched && error && <span>{ error }</span> }
    </div>
  </div>
)

export default RenderField