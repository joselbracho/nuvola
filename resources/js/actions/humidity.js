import { checkTokenExists, setToken } from '../helpers/auth';
import { link } from 'fs';
import NProgress from 'nprogress';

export const getHumidity = (id, data) => dispatch => {
  return window.axios.get(`/api/getHumidity`)
    .then(({ data: { data, meta } }) => Promise.resolve({ data, meta }))
    .catch(error => {
      return Promise.reject(error);
  });
};
