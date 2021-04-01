import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { destructServerErrors } from '../helpers/error';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setLoading } from '../actions/loading';
import { initAuthFromExistingToken } from '../actions/auth';
import GuestRoute from './GuestRoute';
import store from '../store';

// Landing
import Landing from '../pages/Landing';
// Historial
import Historial from '../pages/Historial';
// 404
import NotFound from '../pages/404';
const { dispatch } = store;

const propTypes = {
  setLoading: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  initAuthFromExistingToken: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

class App extends Component {
  
  constructor(props) {
    super(props);

    this._isMounted = false;
  }

  componentDidMount () {
    this._isMounted = true;
    this.props.initAuthFromExistingToken(() => this.props.setLoading(false));
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render () {
    if (this.props.loading) {
      return (
        <i className="fas fa-circle-notch fa-spin"></i>
      );
    }

    return (

      <Router>
          <Switch>
            <GuestRoute exact path="/" component={Landing} />
            <GuestRoute exact path="/historial" component={Historial} />
            <Route component={NotFound} />
          </Switch>
      </Router>
    );
  }
}

App.propTypes = propTypes;

const mapDispatchToProps = {
  setLoading,
  initAuthFromExistingToken
};

const mapStateToProps = ({ loading, auth, token }) => ({ loading, auth, token });

export default connect(mapStateToProps, mapDispatchToProps)(App);
