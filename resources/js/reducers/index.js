import { combineReducers } from 'redux';
import auth from './auth';
import loading from './loading';
import token from './token';

export default combineReducers({
  auth,
  token,
  loading
});
