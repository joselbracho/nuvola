import { SET_TOKEN } from '../actions/auth';

export default (state = { token: '' }, action) => {
  switch (action.type) {
    case SET_TOKEN:
        return { ...state, token: action.token };
    default:
      return { ...state, token: null };
  }
};
