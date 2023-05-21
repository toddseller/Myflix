// import { history } from '../routers/AppRouter'
import mmdb from "../apis/mmdb";
import { getHomePageData } from "./homePage";

export const fetchShows = (shows) => {
  return {
    type: "FETCH_SHOWS",
    payload: shows,
  };
};

export const addShow = (show) => {
  return {
    type: "ADD_SHOW",
    payload: show,
  };
};

export const fetchShow = (show) => {
  return {
    type: "FETCH_SHOW",
    payload: show,
  };
};

export const startFetchShows = () => async (dispatch) => {
  const myflixUser = window.localStorage.getItem("myflixUser")
    ? JSON.parse(window.localStorage.getItem("myflixUser"))
    : JSON.parse(window.sessionStorage.getItem("myflixUser"));
  const response = await mmdb.get("/shows", {
    headers: { Authorization: `bearer ${myflixUser.token}` },
  });

  dispatch(fetchShows(response.data));
};

export const startAddShow = (show) => async (dispatch) => {
  const myflixUser = window.localStorage.getItem("myflixUser")
    ? JSON.parse(window.localStorage.getItem("myflixUser"))
    : JSON.parse(window.sessionStorage.getItem("myflixUser"));
  mmdb.defaults.headers.common["Authorization"] = `bearer ${myflixUser.token}`;
  const response = await mmdb.post("/add_show", { show });

  dispatch(addShow(response.data));
  dispatch(getHomePageData());
};

export const startAddEpisodes = (episode) => async (dispatch) => {
  const myflixUser = window.localStorage.getItem("myflixUser")
    ? JSON.parse(window.localStorage.getItem("myflixUser"))
    : JSON.parse(window.sessionStorage.getItem("myflixUser"));
  mmdb.defaults.headers.common["Authorization"] = `bearer ${myflixUser.token}`;
  const response = await mmdb.post("/add_episodes", { episode });

  dispatch(addShow(response.data));
  console.log(response.data);
};

export const startFetchShow = (id) => async (dispatch) => {
  const myflixUser = window.localStorage.getItem("myflixUser")
    ? JSON.parse(window.localStorage.getItem("myflixUser"))
    : JSON.parse(window.sessionStorage.getItem("myflixUser"));
  mmdb.defaults.headers.common["Authorization"] = `bearer ${myflixUser.token}`;
  const response = await mmdb.get(`/shows/${id}`);

  dispatch(fetchShow(response.data));
  console.log(response.data);
};
