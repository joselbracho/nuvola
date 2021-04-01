import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import localforage from 'localforage';

const propTypes = {
	auth: PropTypes.object.isRequired,
};

const showSidebar = 'show-sidebar';

class GuestNav extends Component {
  constructor (props) {
    super(props);
  }

  render () {
  	return (
	    <div className="navbar navbar-expand-lg navbar-light bg-light">
        <Link
          to="/"
          >
            <img src="/img/logo-1.png" className="logo-nav" />
        </Link>

	    	
	      <Link
	        to="/"
	        className="brand">
	        	<span className="name-nav">PRUEBA PRÁCTICA</span>
	      </Link>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ml-auto">
            <Link
              className="button-1"
              to="/historial"
              >
              HISTORIAL 
            </Link>
          </ul>
        </div>

	    </div>
  );
  }
}

GuestNav.propTypes = propTypes;

const mapDispatchToProps = {  };
const mapStateToProps = ( { auth, } ) => ({ auth });

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { pure: false }
)(withRouter(GuestNav));
