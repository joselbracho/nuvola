import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { destructServerErrors, hasError, getError } from '../helpers/error';
import { Map, Marker, Overlay } from 'pigeon-maps'

const propTypes = {
  auth: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
};
  
class CitiesMap extends Component {
  constructor (props) {
    super(props);
    this.state = {
      miami_humidity: '',
      orlando_humidity: '',
      newyork_humidity: '',
    };
  }

  componentDidMount(){
    console.log(this.props);
    this.setState({
      miami_humidity: this.props.miami_humidity,
      orlando_humidity: this.props.orlando_humidity,
      newyork_humidity: this.props.newyork_humidity,
    });
  }

  mapTilerProvider(x, y, z, dpr) {
    return `https://c.tile.openstreetmap.org/${z}/${x}/${y}.png`;    //<--- tile provider url, should provide colorful map from openstreet
  }
 
  render () {
    return (
      <Map provider={this.mapTilerProvider}  defaultCenter={[35.405553, -72.9969488]} defaultZoom={4} height={400}>
        <Marker anchor={[25.8479091, -80.4325388]} payload={1} onClick={({ event, anchor, payload }) => {}} />
        <Marker anchor={[28.4813989, -81.5089266]} payload={1} onClick={({ event, anchor, payload }) => {}} />
        <Marker anchor={[40.6976701, -74.2598758]} payload={1} onClick={({ event, anchor, payload }) => {}} />

        <Overlay anchor={[25.8479091, -80.4325388]} offset={[15, 15]}>
          <img src='/img/humidity.png' width={25} height={30} alt='' />
          <span className="humidity-number"><b>MI {this.state.miami_humidity}</b></span>
        </Overlay>

        <Overlay anchor={[28.4813989, -81.5089266]} offset={[15, 15]}>
          <img src='/img/humidity.png' width={25} height={30} alt='' />
          <span className="humidity-number"><b>OR {this.state.orlando_humidity}</b></span>
        </Overlay>
        
        <Overlay anchor={[40.6976701, -74.2598758]} offset={[-15, -15]}>
          <img src='/img/humidity.png' width={25} height={30} alt='' />
          <span className="humidity-number">NY<b> {this.state.newyork_humidity}</b></span>
        </Overlay>
      </Map>
    );
  }
}

CitiesMap.propTypes = propTypes;

const mapDispatchToProps = {};
const mapStateToProps = ({ auth, loading }) => ({ auth, loading });

export default connect(mapStateToProps,mapDispatchToProps)(CitiesMap);

