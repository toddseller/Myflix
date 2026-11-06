import React, { useLayoutEffect } from 'react'
import { useDispatch } from 'react-redux'
import { createBrowserRouter, Outlet, redirect, useNavigate, useParams } from 'react-router-dom'

import HomePage from '../components/HomePage'
import Header from '../components/header/Header'
import Login from '../components/Login'
import Signup from '../components/Signup'
import UserPage from '../components/UserPage'
import { setSelectedMedia } from '../actions/filters'

const Layout = () => (
  <div>
    <Header />
    <div className="site-content">
      <Outlet />
    </div>
  </div>
)

// Runs before the collection page renders, so a signed-out visitor never sees it or makes its requests. Only the
// movies and shows tabs have addresses; anything else, such as an old /browse/<id> bookmark, goes to /browse.
const browseLoader = ({ params }) => {
  if (!window.localStorage.getItem('myflixUser') && !window.sessionStorage.getItem('myflixUser')) return redirect('/login')
  if (!['', 'shows'].includes(params['*'])) return redirect('/browse')
  return null
}

// The address owns the tab: the store follows it, before paint so a Back press never shows the old tab, and the tabs
// change it, so a reload or bookmark keeps the tab.
const BrowsePage = () => {
  const media = useParams()['*'] === 'shows' ? 'tvShows' : 'movies'
  const dispatch = useDispatch()
  const navigate = useNavigate()
  useLayoutEffect(() => { dispatch(setSelectedMedia(media)) }, [media])
  return <UserPage onSelectMedia={ tab => navigate(tab === 'tvShows' ? '/browse/shows' : '/browse') } />
}

// Exported so code outside components (actions, the session-expiry interceptor) can navigate.
export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/login', element: <Login /> },
      { path: '/signup', element: <Signup /> },
      { path: '/browse/*', loader: browseLoader, element: <BrowsePage /> }
    ]
  }
])
