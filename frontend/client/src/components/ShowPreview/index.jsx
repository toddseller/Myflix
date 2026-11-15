import React, { Component } from 'react'
import { connect } from 'react-redux'

import { decodeEntities } from '../../utils/decodeEntities'

import './index.scss'

class ShowPreview extends Component {
  _onClick = () => {
    this.props.onClick(this.props.show.id)
  }

  render() {
    const { show, open } = this.props
    const title = decodeEntities(show.title)
    return (
      <div id={ show.id } className={ open ? 'show-preview open' : 'show-preview' }>
        <img src={ show.poster } alt={ `${ title } poster` } width={ 200 } height={ 200 } loading="lazy"
             onClick={ this._onClick } />
        <p className="truncate">{ title }</p>
        {/* Empty season numbers, not a count of 0, mark a show with only specials: MMDb has stale counts of 0 on some one-season shows. */}
        <p className="seasons">{ show.seasonNumbers === '' ? 'Specials' : parseInt(show.seasonCount) >= 5 ? `${show.seasonNumbers} Seasons` : parseInt(show.seasonCount) > 1 ? `Seasons ${show.seasonNumbers}` : `Season ${show.seasonNumbers}`}</p>
        <div className="pointer" />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  show: state.shows[ownProps.id]
})


export default connect(mapStateToProps)(ShowPreview)