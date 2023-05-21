import React, { Component } from 'react'
import { connect } from 'react-redux'
import { TextField, IconButton } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import AddIcon from '@material-ui/icons/Add'

import { setTextFilter } from '../../actions/filters'
import validate from '../forms/validate'
import { startFetchSearchNewMovies, clearSearchNewMovies } from '../../actions/newMovie'
import { startFetchSearchNewShows, clearSearchNewShows } from '../../actions/newShow'
import { clearSearchNewEpisodes } from '../../actions/newEpisode'
import './index.scss'

const baseStyles = {
  box: {
    display: 'inline-flex'
  },
  open: {
    width: 300,
    frame: {
      background: 'transparent'
    }
  },
  closed: {
    width: 0,
    frame: {
      background: 'transparent'
    }
  },
  smallIcon: {
    width: 30,
    height: 30,
    color: '#FFFFFF'
  },
  icon: {
    width: 40,
    height: 40,
    padding: 5,
    top: 10,
    color: '#FFFFFF'
  },
  addIconOpen: {
    transform: 'scaleX(1)',
    transition: 'all 750ms cubic-bezier(0.23, 1, 0.32, 1) 100ms'
  },
  addIconClosed: {
    transform: 'scaleX(0)',
    transition: 'all 750ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'
  }
}

const inputStyle = {
  color: '#FFFFFF',
  fontFamily: 'Helvetica Nueue, Helvetica, sans-serif',
  fontWeight: 300,
  border: 'none'
}

const animationStyle = {
  transition: 'all 0.75s cubic-bezier(0.000, 0.795, 0.000, 1.000)'
}

class SearchBox extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: '',
      isOpen: false
    }
  }

  handleOnChange = e => {
    this.setState({ value: e.target.value })
    this.props.setTextFilter(e.target.value)
  }

  onClick = () => {
    this.setState({ isOpen: !this.state.isOpen })
    this.props.isLoading()
    this.props.setTextFilter('')
    if (this.props.filters.media === 'movies') {
      this.setState({ value: '' })
      this.props.clearSearchNewMovies()
      if (this.props.newMovies.length > 1) {
        this.props.onClick()
      }
    } else {
      this.setState({ value: '' })
      this.props.clearSearchNewShows()
      this.props.clearSearchNewEpisodes()
      if (this.props.newShows.length > 1) {
        this.props.onClick()
      }
    }
  }

  handleOnSubmit = e => {
    e.preventDefault()
    e.stopPropagation()
    if (this.props.filters.media === 'movies') {
      this.props.clearSearchNewMovies()
      this.props.onClick()
      this.props.startFetchSearchNewMovies(this.state.value)
    } else {
      this.props.clearSearchNewShows()
      this.props.onClick()
      this.props.startFetchSearchNewShows(this.state.value)
    }
  }

  render() {
    const { isOpen } = this.state
    const { text } = this.props.filters
    const { onClick, handleOnChange, handleOnSubmit } = this
    let textStyle = isOpen ? Object.assign({}, baseStyles.open, baseStyles.open.frame) : Object.assign({}, baseStyles.closed, baseStyles.closed.frame)
    textStyle = Object.assign(textStyle, animationStyle ? animationStyle : {})
    const divStyle = isOpen ? Object.assign({}, textStyle, baseStyles.open.frame, baseStyles.box, animationStyle ? animationStyle : {}) : Object.assign({}, textStyle, baseStyles.closed.frame, baseStyles.box, animationStyle ? animationStyle : {})
    divStyle.width += baseStyles.icon.width + 5
    const addStyle = isOpen ? Object.assign({}, baseStyles.icon, baseStyles.addIconOpen) : Object.assign({}, baseStyles.icon, baseStyles.addIconClosed)
    return (
      <div style={ divStyle }>
        <IconButton
          classes={ baseStyles.smallIcon }
          style={ baseStyles.icon }
          onClick={ onClick }
        >
          <SearchIcon />
        </IconButton>
        <form className='search-form' onSubmit={ handleOnSubmit }>
          <TextField
            name='search'
            value={ text }
            onChange={ handleOnChange }
            style={ textStyle }
            autoComplete='off'
            classes={ inputStyle }
          />
          <IconButton
            classes={ baseStyles.smallIcon }
            style={ addStyle }
            type="submit"
          >
            <AddIcon />
          </IconButton>
        </form>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  filters: state.filters,
  newMovies: Object.values(state.newMovies),
  newShows: Object.values(state.newShows)
})

export default connect(mapStateToProps, {
  setTextFilter,
  startFetchSearchNewMovies,
  clearSearchNewMovies,
  startFetchSearchNewShows,
  clearSearchNewShows,
  clearSearchNewEpisodes
})(SearchBox)