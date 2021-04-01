import React from 'react';
import store from '../store';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

const propTypes = {
  component: PropTypes.object.isRequired,
  rest: PropTypes.object,
  location: PropTypes.object
};

const GuestRoute = ({ component: Component = null, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      const { auth: { authenticated }, validDomain } = store.getState();

      /*if (!validDomain) {  
        return (<Redirect
           to={{
             pathname: '/404',
             state: { from: props.location }
           }}
         />);
     }*/

      return !authenticated ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: ('/'),
            state: { from: props.location }
          }}
        />
      );
    }
    }
  />
);

GuestRoute.propTypes = propTypes;
GuestRoute.displayName = 'Guest Route';

export default GuestRoute;
