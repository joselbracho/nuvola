import localforage from 'localforage';
import store from '../store'
import {SET_TOKEN} from '../actions/auth';

const INTENDED_URL = 'intended_url';
const DEFAULT_INTENDED_URL = '/ingress';

const setLocalForageToken = token => {
  if (window._.isEmpty(token)) {
    localforage.removeItem('authtoken', token);
  }

  return localforage.setItem('authtoken', token);
};

const setHttpToken = (token) => {
  if (window._.isEmpty(token)) {
    window.axios.defaults.headers.common['Authorization'] = null;
  }

  window.axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
};

export const checkTokenExists = () => {
  return localforage.getItem('authtoken').then((token) => {
    if (window._.isEmpty(token)) {
      return Promise.reject(new Error('invalid token'));
    }

    return Promise.resolve(token);
  });
};

export const setToken = token => {
  
  setLocalForageToken(token);
  store.dispatch({
      type: SET_TOKEN,
      token
    });
  setHttpToken(token);
};

export const setIntendedUrl = url => {
  localforage.setItem(INTENDED_URL, url);
};

export const getIntendedUrl = () => {

  return localforage.getItem(INTENDED_URL).then((url) => {

    if (window._.isEmpty(url)) {
      url = DEFAULT_INTENDED_URL;
    }

    return Promise.resolve(url);
  });
};
