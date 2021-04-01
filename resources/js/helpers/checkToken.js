import store from '../store';
import { logoutUser } from '../actions/auth';

const isHandlerEnabled = (config={}) => {
    return config.hasOwnProperty('handlerEnabled') && !config.handlerEnabled ? 
        false : true
}

const requestHandler = (request) => {
    if (isHandlerEnabled(request)) {
      // Modify request here
    }
    return request
}

const errorHandler = (error) => {
    const {dispatch} = store;

    if (isHandlerEnabled(error.config)) {
        const UNAUTHORIZED = 401;    
        const config = error.config;   
        
        // Redirect if is not authenticated  
        if (error.response.status === UNAUTHORIZED && config.url !== '/api/signin' && config.url !== '/api/me' && config.url !== '/api/check/domain') {
            dispatch(logoutUser(() => {
                //location.href = '/'
            }));
        }
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject({ ...error })
}

const successHandler = (response) => {    
    const {dispatch} = store;

    if (response.data.meta.success === false) {
        dispatch({
            type: SET_VALID_DOMAIN,
            status: false
        });
    }

    if (isHandlerEnabled(response.config)) {
      // Handle responses
    }
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
}

export const checkExpiredToken = () => {
    // Add a response interceptor
    window.axios.interceptors.request.use(request => requestHandler(request));
    window.axios.interceptors.response.use(response => successHandler(response), error => errorHandler(error));
}