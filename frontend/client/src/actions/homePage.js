import mmdb from '../apis/mmdb'

export const fetchHomePage = data => ({
  type: 'FETCH_HOMEPAGE',
  data
})

export const getHomePageData = () => async dispatch => {
  const response = await mmdb.get('/homepage')
  dispatch(fetchHomePage(response.data))
}