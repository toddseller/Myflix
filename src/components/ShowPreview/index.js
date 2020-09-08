import React, { Component } from 'react'
import { connect } from 'react-redux'
import LazyLoad from 'react-lazyload'

import './index.scss'

class ShowPreview extends Component {
  _onClick = () => {
    this.props.onClick(this.props.show.id)
  }

  render() {
    const { show } = this.props
    return (
      <div id={ show.id } className="show-preview">
        <LazyLoad height={ 200 } offset={ [200, 200] } resize={ true } once>
          <img src={ show.poster } alt={ `${ show.title } poster` } width={ 200 } height={ 200 }
               onClick={ this._onClick } />
        </LazyLoad>
        <p className="truncate">{ show.title }</p>
        <p className="seasons">{ parseInt(show.seasonCount) >= 5 ? `${show.seasonNumbers} Seasons` : parseInt(show.seasonCount) > 1 ? `Seasons ${show.seasonNumbers}` : `Season ${show.seasonNumbers}`}</p>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  show: state.shows[ownProps.id]
})


export default connect(mapStateToProps)(ShowPreview)