import React from 'react'

const RenderField = ({ input, label, type, meta: { touched, error } }) => (
    <div className="form-main">
        <div className="form-input">
            <input { ...input } placeholder={ label } type={ type } />
            { touched && error && <span>{ error }</span> }
        </div>
    </div>
)

export default RenderField