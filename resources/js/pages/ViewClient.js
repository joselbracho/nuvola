import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getClient } from '../actions/clients';
import { destructServerErrors, hasError, getError } from '../helpers/error';
import ProgressBarDownload from '../components/ProgressBarDownload';
import DocumentTitle from 'react-document-title';
import GuestNav from '../components/GuestNav';
const propTypes = {
  auth: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  getClient: PropTypes.func.isRequired
};
  
class ViewClient extends Component {
  constructor (props) {
    super(props);
    this.state = {
        name: '',
        last_name: '',
        email: '',
        address: '',
        phone: '',
        travels: [],
        image: '',
        errors: '',
        success: null,
        loading: true,
      };
  }

  componentDidMount() {
    this.props.getClient(this.props.match.params.id)
        .then(response => {
          console.log('antes');
          this.getSuccess(response);
          console.log('despues');
        })
        .catch(error => this.setState({ errors: destructServerErrors(error) }));
  }

  getSuccess (e) {
    console.log(e.data);
    this.setState({
      name: e.data.name,
      last_name: e.data.last_name,
      email: e.data.email,
      address: e.data.address,
      phone: e.data.phone,
      travels: e.data.travels,
      image: e.data.image,
      loading: false
    });
  }

  render () {
  


    return (
    <DocumentTitle title={`Clients - ${window.App.name}`}>
    <React.Fragment >
        <GuestNav />
       <div className="container-fluid content-page">
            <h1>View Client {this.state.name}</h1>
            <hr/>
       	{this.state.success === false ? error : ''}	
        {this.state.loading && <ProgressBarDownload percentage={100} text={this.state.loadingText} />}
        {!this.state.loading &&
            <div className="row">
              <div className="col-md-6">
                <div>
                  <label>Name</label>
                  <p>{this.state.name}</p>
                </div>
                <div>
                  <label>Last Name</label>
                  <p>{this.state.last_name}</p>
                </div>
                <div>
                  <label>Email</label>
                  <p>{this.state.email}</p>
                </div>
                <div>
                  <label>Address</label>
                  <p>{this.state.address}</p>
                </div>
                <div>
                  <label>Phone number</label>
                  <p>{this.state.phone}</p>
                </div>
              </div>
              <div className="col-md-6">
                <img className="detail-image" src={this.state.image}/>
              </div>
              <div className="table-responsive table-container">

            {/* List */}
            <h2>Travels</h2>
            <table className="table">
              <thead>
                  <tr>
                    <th className="text-center">#</th>
                    <th className="text-center">Date Travel</th>
                    <th>Country </th>
                    <th>City</th>
                  </tr>
              </thead>
              <tbody>
                {this.state.travels.map((item, i) => (
                  item ? (
                    <tr key={i}>
                      <td className="text-center">{item.id}</td>
                      <td className="text-center">{item.travel_date}</td>
                      <td>{item.country_id}</td>
                      <td>{item.city}</td>
                    </tr>
                  ) : ''
                ))}
              </tbody>
            </table>
          </div>

            </div>
        }

      </div>
      </React.Fragment >
      </DocumentTitle>
    );
  }
}

ViewClient.propTypes = propTypes;

const mapDispatchToProps = { 
    getClient, 
};

const mapStateToProps = ({ auth, loading }) => ({ auth, loading });

export default connect(mapStateToProps,mapDispatchToProps)(ViewClient);

