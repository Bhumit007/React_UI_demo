import React, { useReducer } from 'react';
import axios from 'axios';
import GithubContext from './githubContext';
import GithubReducer from './githubReducer';
import {
  SEARCH_USERS,
  SET_LOADING,
  CLEAR_USERS,
  GET_USER,
  GET_REPOS,
} from '../type';

let githubClientId;
let githubClientSecret;

if (process.env.NODE_ENV !== 'production') {
  githubClientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
  githubClientSecret = process.env.REACT_APP_GITHUB_CLIENT_SECRET;
} else {
  githubClientId = process.env.GITHUB_CLIENT_ID;
  githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
}

const GithubState = (props) => {
  const initialState = {
    users: [],
    user: {},
    repos: [],
    loading: false,
  };

  const [state, dispatch] = useReducer(GithubReducer, initialState);

  //Search user
  const searchUsers = async (text) => {
    setLoading();

    console.log(
      'search user ',
      text,
      process.env.REACT_APP_GITHUB_CLIENT_ID,
      process.env.REACT_APP_GITHUB_CLIENT_SECRET
    );

    const res = await axios.get(`https://api.github.com/search/users?q=${text}&client_id=
    ${githubClientId}&client_secret=
    ${githubClientSecret}`);

    console.log(res);

    dispatch({
      type: SEARCH_USERS,
      payload: res.data.items,
    });
  };

  //Get user
  const getUser = async (userName) => {
    setLoading();

    console.log(
      'Get user ',
      userName,
      process.env.REACT_APP_GITHUB_CLIENT_ID,
      process.env.REACT_APP_GITHUB_CLIENT_SECRET
    );

    const res = await axios.get(`https://api.github.com/users/${userName}?client_id=
    ${githubClientId}&client_secret=
    ${githubClientSecret}`);

    console.log('Data :::: ' + res.items);

    dispatch({
      type: GET_USER,
      payload: res.data,
    });
  };

  //Get repos
  const getUserRepos = async (userName) => {
    setLoading();

    const res = await axios.get(
      `https://api.github.com/users/${userName}/repos?per_page=5&sort=created:asc&
      client_id=
      ${githubClientId}
      &client_secret=
      ${githubClientSecret}`
    );

    console.log(res);

    dispatch({
      type: GET_REPOS,
      payload: res.data,
    });
  };

  //clear user
  const clearUsers = () => dispatch({ type: CLEAR_USERS });
  //Set loading
  const setLoading = () => dispatch({ type: SET_LOADING });

  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        user: state.user,
        repos: state.repos,
        loading: state.loading,
        searchUsers,
        clearUsers,
        getUser,
        getUserRepos,
      }}
    >
      {props.children}
    </GithubContext.Provider>
  );
};

export default GithubState;
