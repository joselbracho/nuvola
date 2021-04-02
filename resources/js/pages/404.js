import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import GuestNav from '../components/GuestNav';

const propTypes = {
  authenticated: PropTypes.bool.isRequired
};

const NotFound = (props) => {
  const nav = props.authenticated ? <AuthNav /> : <GuestNav />;

  return (
    <div className="flex">
      {nav}

      <div className="container-fluid content-page">
        <div className="row">
          <span className="error-font">404</span>
        </div>
        <div className="row">
          <span>Lo sentimos, la página que estás buscando no existe.</span>
        </div>
      </div>  
    </div>
  );
};

NotFound.propTypes = propTypes;
const mapStateToProps = ({ auth: { authenticated } }) => ({ authenticated });
export default connect(mapStateToProps)(NotFound);
