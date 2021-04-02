import { createStore, applyMiddleware } from 'redux';
import reducers from '../reducers';
import thunk from 'redux-thunk';


const loggingMiddleware = (store) => (next) => (action) => {
  // middleware
  // call the next function
  next(action);
}


export default createStore(reducers, 
	applyMiddleware(thunk, loggingMiddleware)
	);


