import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';
import { getHumidity } from '../actions/humidity';
import { createHistorial } from '../actions/historial';
import { getIntendedUrl } from '../helpers/auth';
import { destructServerErrors, hasError, getError } from '../helpers/error';

import GuestNav from '../components/GuestNav';
import Footer from '../components/Footer';
import CitiesMap from '../components/CitiesMap';

const publicIp = require('public-ip');

const propTypes = {
  getIntendedUrl: PropTypes.func.isRequired,
  getHumidity: PropTypes.func.isRequired,
  createHistorial: PropTypes.func.isRequired
};


class Landing extends Component {
  constructor (props) {
    super(props);
    this._isMounted = false;
    this.state = {
      errors: '',
      ip: '',
      miami_humidity: '',
      orlando_humidity: '',
      newyork_humidity: '',
      pubDate_miami: '',
      pubDate_orlando: '',
      pubDate_newyork: '',
    };
  }
  componentDidMount(){
    this.loadHumidity();

    (async () => {
      this.setState({ip: await publicIp.v4() });
    })();

  }

  loadHumidity() {
   this.props.getHumidity()
      .then(response => this.getHumiditySuccess(response))
      .catch(error => this.setState({ errors: destructServerErrors(error) }));
  }
  getHumiditySuccess (e) {

    this.setState({
      miami_humidity: e.data.miami_humidity,
      orlando_humidity: e.data.orlando_humidity,
      newyork_humidity: e.data.newyork_humidity,
      pubDate_miami: e.data.pubDate_miami,
      pubDate_orlando: e.data.pubDate_orlando,
      pubDate_newyork: e.data.pubDate_newyork,
    });

    const data = new FormData() 
      data.append('ip', this.state.ip);
      data.append('miami_humidity', this.state.miami_humidity);
      data.append('orlando_humidity', this.state.orlando_humidity);
      data.append('newyork_humidity', this.state.newyork_humidity);
      data.append('pubDate_miami', this.state.pubDate_miami);
      data.append('pubDate_orlando', this.state.pubDate_orlando);
      data.append('pubDate_newyork', this.state.pubDate_newyork);

    this.props.createHistorial(data)
        .then(response => this.createSuccess(response))
        .catch(error => this.setState({ errors: destructServerErrors(error), 'success': false }));
  }

  handleInputChange (e) {
    this.setState({
      [e.target.name]: e.target.value,
      errors: {
        ...this.state.errors,
        ...{ [e.target.name]: '' }
      }
    });
  } 
 
  render () {
    return (
      <DocumentTitle title={`${window.App.name}`}>
        <div>
          <GuestNav />
          {this.state.miami_humidity && this.state.orlando_humidity && this.state.newyork_humidity ? (
          <CitiesMap miami_humidity={this.state.miami_humidity} 
            orlando_humidity={this.state.orlando_humidity} 
            newyork_humidity={this.state.newyork_humidity} />
            ) : ''} 
          <div className="container-fluid">

            <div id="box-3">
              <div className="container">
                <div className="row text-center">
                  <div className="col-md-4">
                    <h3>Miami</h3>
                    <span className="humidity-number">{this.state.miami_humidity}</span> 
                     
                  </div>
                  <div className="col-md-4">
                    <h3>Orlando</h3>
                    <span className="humidity-number">{this.state.orlando_humidity} </span> 
                    
                  </div>
                  <div className="col-md-4">
                    <h3>New York</h3>
                    <span className="humidity-number">{this.state.newyork_humidity}</span> 
                     
                  </div>
                </div>
              </div>
            </div>
            <div className="row text-center historial-button">
              <Link
                className="button-1"
                to="/historial"
                >
                VER HISTORIAL DE CONSULTAS
              </Link>
            </div>

          </div>
          <Footer />
        </div>
      </DocumentTitle>
    );
  }
}

Landing.propTypes = propTypes;

const mapDispatchToProps = {
  getIntendedUrl,
  getHumidity,
  createHistorial
};

export default connect(null, mapDispatchToProps)(Landing);
