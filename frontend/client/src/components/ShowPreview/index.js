import React, { Component } from 'react'
import { connect } from 'react-redux'

import { decodeEntities } from '../../utils/decodeEntities'

import './index.scss'

class ShowPreview extends Component {
  _onClick = () => {
    this.props.onClick(this.props.show.id)
  }

  render() {
    const { show } = this.props
    const title = decodeEntities(show.title)
    return (
      <div id={ show.id } className="show-preview">
        <img src={ show.poster } alt={ `${ title } poster` } width={ 200 } height={ 200 } loading="lazy"
             onClick={ this._onClick } />
        <p className="truncate">{ title }</p>
        <p className="seasons">{ parseInt(show.seasonCount) >= 5 ? `${show.seasonNumbers} Seasons` : parseInt(show.seasonCount) > 1 ? `Seasons ${show.seasonNumbers}` : `Season ${show.seasonNumbers}`}</p>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  show: state.shows[ownProps.id]
})


export default connect(mapStateToProps)(ShowPreview)