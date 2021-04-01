import { checkTokenExists, setToken } from '../helpers/auth';
import { link } from 'fs';
import NProgress from 'nprogress';

export const getHistorial = (page, params = {}) => dispatch => {
  return window.axios.get('/api/historial', {
    params: {
      page: page,
      search: params.hasOwnProperty('search') && params.search ? params.search : null,
      order_by: params.hasOwnProperty('order_by') && params.order_by ? params.order_by : 'id',
      order_type: params.hasOwnProperty('order_type') && params.order_type ? params.order_type : 'desc',
      closure: params.hasOwnProperty('closure') && params.closure ? params.closure : null,
    }
  })
  .then(({ data: { data, links, meta } }) => Promise.resolve({ data, links, meta }))
  .catch(error => {
    return Promise.reject(error);
  });
};

export const createHistorial = data => dispatch => {

  return window.axios.post('/api/historial/create', data) 
    .then(({ data: { data, meta } }) => {
    return Promise.resolve({ data, meta });
  }).catch(error => {
    return Promise.reject(error);
  });
};